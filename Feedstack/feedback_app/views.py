import base64
import io
from PIL import Image
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Participant, DesignUpload, ChatMessage
from .serializers import ParticipantSerializer, DesignUploadSerializer, ChatMessageSerializer
from django.conf import settings
from openai import OpenAI
import logging
# from sentence_transformers import SentenceTransformer
import numpy as np
import re

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY)
# model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

class ParticipantView(APIView):
    def post(self, request):
        participant_id = request.data.get('participant_id')
        if not participant_id:
            return Response({"error": "participant_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        participant, created = Participant.objects.get_or_create(participant_id=participant_id)
        serializer = ParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class DesignFeedbackView(APIView):
    def post(self, request):
        participant_id = request.data.get('participant')
        if not participant_id:
            return Response({"error": "participant ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            participant = Participant.objects.get(participant_id=participant_id)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)

        image_data = request.data.get('image')
        if not image_data:
            return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode base64 image
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            data = base64.b64decode(imgstr)

            # Save image to a temporary file
            with io.BytesIO(data) as f:
                with Image.open(f) as img:
                    img_io = io.BytesIO()
                    img.save(img_io, format=ext)
                    img_file = img_io.getvalue()

            # Create a new DesignUpload instance
            design = DesignUpload.objects.create(
                participant=participant,
                image=f"design_image.{ext}"
            )

            # Save the image file
            design.image.save(f"design_image.{ext}", io.BytesIO(img_file))

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
            logger.error(f"Error processing image: {str(e)}")
            return Response({"error": "Invalid image data"}, status=status.HTTP_400_BAD_REQUEST)


class ChatbotView(APIView):
    def post(self, request):
        participant_id = request.data.get('participant_id')
        message = request.data.get('message')
        
        try:
            participant = Participant.objects.get(participant_id=participant_id)
            design = DesignUpload.objects.filter(participant=participant).latest('created_at')
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)
        except DesignUpload.DoesNotExist:
            return Response({"error": "No design found for this participant"}, status=status.HTTP_404_NOT_FOUND)
        
        user_message = ChatMessage.objects.create(participant=participant, content=message, is_user=True)
        
        try:
            previous_messages = ChatMessage.objects.filter(participant=participant).order_by('created_at')
            
            conversation_history = [
                {"role": "system", "content": "You are a helpful design assistant. You will provide feedback on a design uploaded by the user. Always refer to and consider this specific design when answering questions. You are a friendly and approachable design expert. As you engage with the user, who is a novice designer, offer insightful, tailored feedback that feels natural and conversational. Your tone should be supportive, guiding the user through their design challenges while encouraging them to reflect and improve. Be highly interactive, focusing on the specific design they're presenting, and make sure to ask open-ended, thoughtful follow-up questions that help you better understand their design choices and needs. Let the user set the pace of the conversation, and adapt your advice based on what they want to explore further. Avoid a rigid, structured approach—make the discussion feel fluid and dynamic, like a natural, friendly chat. Instead of just providing answers, create a back-and-forth dialogue, diving into the user's goals, preferences, and vision for their design. DO NOt use bullet points or numbered lists in your feedback."},
                {"role": "user", "content": f"Here's the initial feedback I provided on the user's design:\n\n{design.feedback}"}
            ]
            
            for msg in previous_messages:
                role = "user" if msg.is_user else "assistant"
                conversation_history.append({"role": role, "content": msg.content})
            
            conversation_history.append({"role": "user", "content": message})
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=conversation_history,
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
# class SuggestedTopicsView(APIView):
#     def get(self, request):
#         topics = [
#             "Color scheme analysis",
#             "Layout improvement suggestions",
#             "Typography recommendations",
#             "User experience enhancement",
#             "Accessibility considerations",
#             "Visual hierarchy assessment",
#             "Consistency in design elements",
#             "Branding alignment"
#         ]
#         return Response({"topics": topics})
    
class IdentifyThemeView(APIView):
    def post(self, request):
        message = request.data.get('message')
        print(f"Received message from identify theme: {message}")

        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that identifies the main theme of a message, for reference use design principles and UX/UI design principles to identify and do so by using a single word. Identify this main theme from the following list: Balance, Consistency, Contrast, Alignment & Spacing, Accessibility"},
                    {"role": "user", "content": f"Identify the main theme of this message: {message}"}
                ],
                max_tokens=500
            )
            theme = response.choices[0].message.content.strip()
            return Response({"theme": theme}, status=status.HTTP_200_OK)
        except Exception as e:
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

# class HighlightTermsView(APIView):
#     def post(self, request):
#         text = request.data.get('text', '')
#         themes = request.data.get('themes', [])

#         highlighted_terms = {}
#         for theme in themes:
#             response = client.chat.completions.create(
#                 model="gpt-4o",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful assistant that identifies key terms, phrases, and concepts related to design principles."},
#                     {"role": "user", "content": f"List 150 key terms, phrases, or concepts (can be multiple words) related to the design principle of {theme}. Include synonyms and closely related terms. Separate them by commas."}
#                 ],
#                 max_tokens=1000
#             )
#             terms = response.choices[0].message.content.strip().split(', ')
            
#             for term in terms:
#                 term = term.strip().lower()
#                 if len(term) > 2:  # Ignore very short terms
#                     pattern = r'\b' + re.escape(term) + r'\b'
#                     if re.search(pattern, text.lower()):
#                         highlighted_terms[term] = theme

#         # print("Highlighted terms:", highlighted_terms)  # Debug print
#         return Response({"highlighted_terms": highlighted_terms}, status=status.HTTP_200_OK)