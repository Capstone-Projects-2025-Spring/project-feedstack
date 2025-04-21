import base64
import io
import json
import logging
from PIL import Image
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Participant, DesignUpload, ChatMessage
from .serializers import ParticipantSerializer, DesignUploadSerializer, ChatMessageSerializer
from django.conf import settings
from openai import OpenAI
import numpy as np
import re

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

class ParticipantView(APIView):
    def post(self, request, *args, **kwargs):
        # Improved participant_id extraction
        participant_id = None
        
        # Try to get from JSON body
        if hasattr(request, 'data') and isinstance(request.data, dict):
            participant_id = request.data.get('participant_id')
        
        # Try to get from form data
        if not participant_id and request.POST:
            participant_id = request.POST.get('participant_id')
        
        # Try to parse raw request body as JSON
        if not participant_id and request.body:
            try:
                body_data = json.loads(request.body.decode('utf-8'))
                participant_id = body_data.get('participant_id')
            except:
                pass
        
        # Set a default if none found
        if not participant_id:
            participant_id = 'temp-user'
            logger.warning("No participant_id provided, using default: temp-user")
        
        try:
            participant, created = Participant.objects.get_or_create(participant_id=participant_id)
            serializer = ParticipantSerializer(participant)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error creating participant: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DesignFeedbackView(APIView):
    def post(self, request):
        # Comprehensive error logging
        logger.info(f"Design upload request received with content type: {request.content_type}")
        logger.info(f"Request data keys: {request.data.keys() if hasattr(request, 'data') else 'No data attribute'}")
        
        # Extract participant ID with improved reliability
        participant_id = None
        
        # Try different ways to get participant ID
        if hasattr(request, 'data') and isinstance(request.data, dict):
            participant_id = request.data.get('participant')
        
        if not participant_id and request.POST:
            participant_id = request.POST.get('participant')
        
        if not participant_id and request.body:
            try:
                body_data = json.loads(request.body.decode('utf-8'))
                participant_id = body_data.get('participant')
            except:
                pass
                
        # Set default if still not found
        if not participant_id:
            participant_id = 'temp-user'
            logger.warning("No participant ID found, using default: temp-user")
        
        logger.info(f"Using participant ID: {participant_id}")

        try:
            # Create or get participant
            participant, created = Participant.objects.get_or_create(participant_id=participant_id)
            logger.info(f"Participant {'created' if created else 'retrieved'} with ID: {participant_id}")
        except Exception as e:
            logger.error(f"Error with participant: {str(e)}")
            return Response({"error": f"Error with participant: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract image data with better error handling
        image_data = None
        if hasattr(request, 'data') and isinstance(request.data, dict):
            image_data = request.data.get('image')
        
        if not image_data and request.body:
            try:
                body_data = json.loads(request.body.decode('utf-8'))
                image_data = body_data.get('image')
            except:
                pass
        
        if not image_data:
            logger.error("No image data provided in request")
            return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Safer base64 splitting with more validation
            if ';base64,' not in image_data:
                logger.error("Invalid image format: missing ';base64,' marker")
                return Response({"error": "Invalid image format. Base64 data must contain ';base64,' marker."}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Split the base64 data
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            
            # Handle common image formats
            if ext not in ['jpeg', 'jpg', 'png', 'gif', 'webp']:
                logger.warning(f"Unusual image format: {ext}, converting to png")
                ext = 'png'  # Default to PNG for unusual formats
            
            # Decode and process the image
            try:
                data = base64.b64decode(imgstr)
            except Exception as e:
                logger.error(f"Base64 decoding error: {str(e)}")
                return Response({"error": f"Invalid base64 data: {str(e)}"}, 
                               status=status.HTTP_400_BAD_REQUEST)

            # Save image to a temporary file
            with io.BytesIO(data) as f:
                try:
                    with Image.open(f) as img:
                        img_io = io.BytesIO()
                        img.save(img_io, format=ext)
                        img_file = img_io.getvalue()
                except Exception as e:
                    logger.error(f"Error processing image with PIL: {str(e)}")
                    return Response({"error": f"Invalid image data: {str(e)}"}, 
                                   status=status.HTTP_400_BAD_REQUEST)

            # Create a new DesignUpload instance
            design = DesignUpload.objects.create(
                participant=participant,
                image=f"design_image.{ext}"
            )

            # Save the image file
            try:
                design.image.save(f"design_image.{ext}", io.BytesIO(img_file))
            except Exception as e:
                logger.error(f"Error saving image file: {str(e)}")
                return Response({"error": f"Error saving image: {str(e)}"}, 
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                logger.info(f"Sending request to OpenAI API for design {design.id}")
                
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "You are a design expert. Engage with the user, a novice designer, by giving highly valuable design feedback.Give your deep insights and unstructured feedback on the design, Respond as casually, conversationally, and concisely as possible in 10 sentences unless explicitly asked by the user to elaborate. Ask follow-up questions if needed. Allow the user guide the pace and flow of the conversation topic. Avoid the use of number or bullet point lists."},
                                {"type": "image_url", "image_url": {"url": f"data:image/{ext};base64,{imgstr}"}}
                            ],
                        }
                    ],
                    max_tokens=1500,
                )
                
                feedback = response.choices[0].message.content
                design.feedback = feedback
                design.save()
                logger.info(f"Feedback generated successfully for design {design.id}")
                
                return Response({
                    "feedback": feedback,
                    "image_url": design.image.url
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error generating feedback for design {design.id}: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error processing image: {str(e)}")
            return Response({"error": f"Error processing image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

# The rest of your API views remain unchanged
class ChatbotView(APIView):
    def post(self, request):
        participant_id = request.data.get('participant_id')
        message = request.data.get('message')
        conversation_history = request.data.get('conversation_history', [])
        
        try:
            participant = Participant.objects.get(participant_id=participant_id)
            design = DesignUpload.objects.filter(participant=participant).latest('created_at')
        except Participant.DoesNotExist:
            # Create participant if it doesn't exist
            participant = Participant.objects.create(participant_id=participant_id)
            return Response({"error": "No design found for this participant. Please upload a design first."}, 
                          status=status.HTTP_404_NOT_FOUND)
        except DesignUpload.DoesNotExist:
            return Response({"error": "No design found for this participant"}, status=status.HTTP_404_NOT_FOUND)
        
        user_message = ChatMessage.objects.create(participant=participant, content=message, is_user=True)
        
        try:
            # Add a strong instruction about conversation style regardless of history format
            style_instruction = {
                "role": "system", 
                "content": "You are a talented design professional having a casual conversation. IMPORTANT: DO NOT use numbered lists, bullet points, or any structured formats. Instead, speak naturally as if you're chatting with a friend. Example: Instead of saying '1. Use Arial, 2. Try a bold weight', say 'You might try Arial with a bold weight to make that pop.' Keep things flowing like a real conversation. Mention 2-3 ideas casually within your sentences rather than listing them out."
            }
            
            # Convert conversation history to OpenAI format
            openai_messages = [style_instruction]
            
            # Add initial context about the design
            if design.feedback:
                openai_messages.append({"role": "system", "content": f"The following is your initial feedback on the user's design. Remember to reference these elements naturally: {design.feedback}"})
            
            # If the conversation history is in our custom format
            if conversation_history and isinstance(conversation_history, list) and len(conversation_history) > 0:
                if isinstance(conversation_history[0], dict) and 'role' in conversation_history[0]:
                    # Filter out any system messages to avoid conflicting instructions
                    filtered_history = [msg for msg in conversation_history if msg.get('role') != 'system']
                    openai_messages.extend(filtered_history)
                else:
                    # Convert old format messages
                    for msg in conversation_history:
                        if isinstance(msg, dict):
                            role = "user" if msg.get('is_user', False) else "assistant"
                            openai_messages.append({"role": role, "content": msg.get('content', '')})
            
            # Add the latest user message
            openai_messages.append({"role": "user", "content": message})
            
            logger.info(f"Sending conversation to OpenAI: {len(openai_messages)} messages")
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=openai_messages,
                max_tokens=1000
            )
            
            bot_reply = response.choices[0].message.content
            bot_message = ChatMessage.objects.create(participant=participant, content=bot_reply, is_user=False)
            
            return Response({
                "user_message": ChatMessageSerializer(user_message).data,
                "bot_message": ChatMessageSerializer(bot_message).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error generating chatbot response: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Remaining class implementations stay the same
        
class IdentifyThemeView(APIView):
    def post(self, request):
        message = request.data.get('message')
        available_themes = request.data.get('available_themes', [
            'Balance', 
            'Contrast', 
            'Consistency', 
            'Alignment', 
            'Proximity', 
            'Repetition',
            'Typography', 
            'Color Theory', 
            'Hierarchy', 
            'White Space', 
            'Accessibility',
            'Grid Systems', 
            'Affordance', 
            'Gestalt Principles', 
            'Minimalism',
            'Symmetry', 
            'Asymmetry', 
            'Focal Points', 
            'Unity', 
            'Rhythm',
            'Emphasis', 
            'Proportion', 
            'Modularity', 
            'User Flow', 
            'Visual Weight',
            'Texture', 
            'Motion Design', 
            'Negative Space', 
            'Composition', 
            'Pattern'
        ])
        
        print(f"Received message from identify theme: {message}")
        print(f"Available themes: {available_themes}")

        try:
            # Pass the themes list to the API prompt
            themes_list = ", ".join(available_themes)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are a design expert that identifies the main design principle being discussed in a message. Identify ONE specific design principle from the following list that best matches the content of the message: {themes_list}. Choose the most specific and relevant principle that directly relates to the design concepts being discussed. Respond with ONLY the name of the design principle, exactly as it appears in the list."},
                    {"role": "user", "content": f"Identify the main design principle in this message about design: {message}"}
                ],
                max_tokens=50,
                temperature=0.3  # Lower temperature for more deterministic responses
            )
            
            theme = response.choices[0].message.content.strip()
            
            # Ensure the returned theme is in our available_themes list
            if theme not in available_themes:
                # Find the closest match if the exact theme isn't in our list
                closest_match = min(available_themes, key=lambda x: len(set(x.lower()) - set(theme.lower())))
                theme = closest_match
                
            print(f"Identified theme: {theme}")
            return Response({"theme": theme}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error in theme identification: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SummarizeView(APIView):
    def post(self, request):
        theme = request.data.get('theme')
        message = request.data.get('message')
        
        # print(f"Full request.data: {request.data}")  # Log the entire request data
        
        # print(f"Received theme: {theme}")
        # print(f"Received text: {message}")
        try:
            definition_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides definitions for design principles."},
                    {"role": "user", "content": f"Provide a concise definition for the design principle: {theme}"}
                ],
                max_tokens=100
            )
            definition = definition_response.choices[0].message.content.strip()

            relation_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that explains how design principles relate to design."},
                    {"role": "user", "content": f"Explain how the principle of {theme} relates to design in 2-3 sentences."}
                ],
                max_tokens=150
            )
            relation = relation_response.choices[0].message.content.strip()

            key_terms_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that identifies key terms related to design principles."},
                    {"role": "user", "content": f"List up to 5 key terms that is related to the design principle of {theme}, separated by commas. Identify the key terms from the text in this message:\n\n{message}."}
                ],
                max_tokens=50
            )
            key_terms = key_terms_response.choices[0].message.content.strip().split(', ')

            summary_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                    {"role": "user", "content": f"Summarize this text in two sentences:\n\n{message}"}
                ],
                max_tokens=100
            )
            summary = summary_response.choices[0].message.content.strip()

            return Response({
                "definition": definition,
                "relation": relation,
                "key_terms": key_terms,
                "summary": summary
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateSuggestionsView(APIView):
    def post(self, request):
        message = request.data.get('message')
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful design assistant. Generate exactly 3 concise, specific questions (7-15 words each) about the design that would naturally follow in the conversation. Format as direct questions like 'How can we improve the element alignment?' or 'What options exist for refining white space?' Focus on practical design aspects like typography, spacing, color, alignment, and brand identity. Make each question standalone and conversational."},
                    {"role": "user", "content": f"Generate follow-up questions based on this message about design feedback: {message}"}
                ],
                max_tokens=500
            )
            
            # Extract just the questions and clean them up
            questions_text = response.choices[0].message.content.strip()
            # Split by line breaks or numbered items
            questions = [q.strip() for q in re.split(r'\n|^\d+\.', questions_text) if q.strip()]
            # Remove any quotation marks
            questions = [q.strip('"\'') for q in questions if q]
            # Limit to 3 questions
            questions = questions[:3]
            
            return Response({"suggestions": questions}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error generating follow-up questions: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)