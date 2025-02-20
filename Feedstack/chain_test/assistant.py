from openai import OpenAI
from typing_extensions import override
from openai import AssistantEventHandler
import os
import pathlib
import json
from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import sent_tokenize
import matplotlib.pyplot as plt
import seaborn as sns
import nltk

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# CLIENT
client = OpenAI(
  api_key=OPENAI_API_KEY,
) # Initialize the OpenAI client with your API key

nltk.download('punkt_tab')

def get_embeddings(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-large"
    )
    return response.data[0].embedding
  
def calculate_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

target_phrase = "Color Contrast"
sample_text = "The “Student Services” page has a clean and bold design with that strong yellow banner at the top, which definitely grabs attention. The minimalist approach is nice, but the contrast between the yellow and white sections feels a bit stark. It might help to soften that transition or add a subtle visual element to guide the eyes down the page. What was your main goal with this layout? You could consider adding a simple horizontal line or a gradient between the yellow and white sections to create a smoother transition. Another option might be to incorporate an icon or subtle pattern related to student services near the section headers. These elements can guide the eye and make the page feel more cohesive. Does that sound like something you’d want to explore?"
sample_sentences = sent_tokenize(sample_text)

target_embedding = get_embeddings(target_phrase)
sentence_embeddings = [get_embeddings(sentence) for sentence in sample_sentences]

similarities = [calculate_similarity(target_embedding, sentence_embedding) for sentence_embedding in sentence_embeddings]

# Create a heatmap
plt.figure(figsize=(10, 10))
sns.heatmap([[similarity] for similarity in similarities], annot=True, cmap='coolwarm', cbar=True, yticklabels=sample_sentences)
plt.title(f'Similarity Heatmap for "{target_phrase}" in Text')
plt.ylabel('Similarity')
plt.show()

###################################################################

# FUNCTION DEFINITION
def highlight_theme(text: str, theme: str, reasoning: str, key_terms: list[str]) -> str:
  
    success_message = f"Successfully highlighted the theme '{theme}' in the text: '{text}'. The reasoning for this theme is: '{reasoning}'. The key terms from the highlight are: {key_terms}."
    
    print(success_message)
    
    return success_message
  
def add_theme(theme: str) -> str:
  
    success_message = f"Successfully added the theme '{theme}' to the list of themes."
    
    print(success_message)
    
    return

# FUNCTION SCHEMA
highlight_theme_schema = {
    "type": "function", "function":
    {
        "description": "Quote a snippet of text that relates to a given design theme.",
        "name": "highlight_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "text_quote": {
                    "type": "string",
                    "description": "The text quote to be highlighted."
                },
                "design_theme": {
                    "type": "string",
                    #"enum": ["Accessibility", "Visual Hierarchy", "Color Contrast"],
                    "description": "The design theme that relates to the text quote."
                },
                "reasoning": {
                    "type": "string",
                    "description": "The reasoning as the text quote relates to the design theme."
                },
                "key_terms": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Additional key terms from the highlight."
                }
        },
        "required": ["text_quote", "design_theme", "reasoning", "key_terms"],
        "additionalProperties": False,
        }
    }}

add_theme_schema = {
    "type": "function", "function":
    {
        "description": "Add a theme that is relevant to the current conversation to a list that is displayed visually to the user on the frontend.",
        "name": "add_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "design_theme": {
                    "type": "string",
                    #"enum": ["Accessibility", "Visual Hierarchy", "Color Contrast"],
                    "description": "A theme that is relevant to the current conversation."
                },
        },
        "required": ["theme"],
        "additionalProperties": False,
        }
    }}

# ASSISTANT
assistant = client.beta.assistants.create(
  name="Design Assistant",
  instructions="You are a design expert. Engage with the user, a novice designer, by giving highly valuable design feedback. Respond as casually, conversationally, and concisely as possible in 1-5 sentences max unless explicitly asked by the user to elaborate. Ask follow-up questions if needed. Allow the user guide the pace and flow of the conversation topic. Avoid the use of number or bullet point lists.",
  tools=[highlight_theme_schema],
  model="gpt-4o",
  temperature=1.0,
)

# DESIGN FILE
image_file = pathlib.Path("C:/Users/4gutz/Documents/Projects/Feedstack/chain_test/design.jpeg")
design_file = client.files.create(
  file=open(image_file, "rb"), # Replace "design.png" with the path to your design file
  purpose="vision",
)

# THREAD/CONVERSATION
thread = client.beta.threads.create(
  messages=[
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "I need feedback on this design.",
        },
        {
          "type": "image_file",
          "image_file": {"file_id": design_file.id},
        },
      ]
    },
  ]
)

def add_message_to_thread(content: str):
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=content
    )
    return message

'''

while True:
 
  run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id
  )

  if run.status == 'completed':
    messages = client.beta.threads.messages.list(
      thread_id=thread.id
    )
    print(f"ASSISTANT: {messages.data[0].content[0].text.value}")
  else:
    print(f"RUN STATUS: {run.status}")
    if run.status == 'requires_action':
      print("ACTION TAKEN")
    
    # Define the list to store tool outputs
    tool_outputs = []
    
    # Loop through each tool in the required action section
    for tool in run.required_action.submit_tool_outputs.tool_calls:
      if tool.function.name == "highlight_theme":
        
        # Call the highlight_theme function with the required parameters
        arguments = tool.function.arguments
        print(arguments)
        
        output = highlight_theme(arguments[0], arguments[1], arguments[2], arguments[3])
        
        tool_outputs.append({
          "tool_call_id": tool.id,
          "output": output,
        })
        
    # Submit all tool outputs at once after collecting them in a list
    if tool_outputs:
      try:
        run = client.beta.threads.runs.submit_tool_outputs_and_poll(
          thread_id=thread.id,
          run_id=run.id,
          tool_outputs=tool_outputs
        )
        print("Tool outputs submitted successfully.")
      except Exception as e:
        print("Failed to submit tool outputs:", e)
    else:
      print("No tool outputs to submit.")
    
    if run.status == 'completed':
      messages = client.beta.threads.messages.list(
        thread_id=thread.id
      )
      print(f"ASSISTANT: {messages.data[0].content[0].text.value}")
    else:
      print(f"RUN STATUS: {run.status}")
      if run.status == 'failed':
        print(run.last_error)
      
  # get user input
  user_input = input("USER: ")
  add_message_to_thread(user_input)
  
'''