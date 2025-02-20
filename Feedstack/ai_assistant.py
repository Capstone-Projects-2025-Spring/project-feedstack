import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

# Function definitions
def highlight_theme(text: str, theme: str, reasoning: str, key_terms: list[str]) -> str:
    success_message = f"Successfully highlighted the theme '{theme}' in the text: '{text}'. The reasoning for this theme is: '{reasoning}'. The key terms from the highlight are: {key_terms}."
    print(success_message)
    return success_message

def add_theme(theme: str) -> str:
    success_message = f"Successfully added the theme '{theme}' to the list of themes."
    print(success_message)
    return success_message

# Function schemas
highlight_theme_schema = {
    "type": "function",
    "function": {
        "description": "Visually highlight a snippet of text in the current conversation that relates to a design theme.",
        "name": "highlight_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "text_snippet": {
                    "type": "string",
                    "description": "The text snippet to be highlighted."
                },
                "design_theme": {
                    "type": "string",
                    "description": "The theme that relates to the text."
                },
                "reasoning": {
                    "type": "string",
                    "description": "The reasoning as the text relates to the theme."
                },
                "key_terms": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Additional key terms from the highlight."
                }
            },
            "required": ["text_snippet", "design_theme", "reasoning", "key_terms"]
        }
    }
}

add_theme_schema = {
    "type": "function",
    "function": {
        "description": "Add a theme that is relevant to the current conversation to a list that is displayed visually to the user on the frontend.",
        "name": "add_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "design_theme": {
                    "type": "string",
                    "description": "A theme that is relevant to the current conversation."
                }
            },
            "required": ["design_theme"]
        }
    }
}

# Create assistant
assistant = client.beta.assistants.create(
    name="Design Assistant",
    instructions="You are a design expert. Engage with the user, a novice designer, by giving highly valuable design feedback. Respond as casually, conversationally, and concisely as possible in 1-5 sentences max unless explicitly asked by the user to elaborate. Ask follow-up questions if needed. Allow the user guide the pace and flow of the conversation topic. Avoid the use of number or bullet point lists.",
    tools=[highlight_theme_schema, add_theme_schema],
    model="gpt-4",
)

# Create a thread
def create_thread(initial_message, image_file_path):
    image_file = client.files.create(
        file=open(image_file_path, "rb"),
        purpose="assistants"
    )
    
    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": initial_message,
                    },
                    {
                        "type": "image_file",
                        "image_file_id": image_file.id,
                    },
                ]
            },
        ]
    )
    return thread

# Add a message to the thread
def add_message_to_thread(thread_id, content):
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=content
    )
    return message

# Run the assistant
def run_assistant(thread_id):
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant.id
    )
    return run

# Get the assistant's response
def get_assistant_response(thread_id):
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    return messages.data[0].content[0].text.value

# Handle function calls
def handle_function_calls(thread_id, run_id):
    run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
    
    if run.status == 'requires_action':
        tool_outputs = []
        for tool_call in run.required_action.submit_tool_outputs.tool_calls:
            if tool_call.function.name == "highlight_theme":
                args = json.loads(tool_call.function.arguments)
                output = highlight_theme(args['text_snippet'], args['design_theme'], args['reasoning'], args['key_terms'])
            elif tool_call.function.name == "add_theme":
                args = json.loads(tool_call.function.arguments)
                output = add_theme(args['design_theme'])
            
            tool_outputs.append({
                "tool_call_id": tool_call.id,
                "output": output,
            })
        
        client.beta.threads.runs.submit_tool_outputs(
            thread_id=thread_id,
            run_id=run_id,
            tool_outputs=tool_outputs
        )
    
    while run.status not in ['completed', 'failed']:
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
    
    return run.status