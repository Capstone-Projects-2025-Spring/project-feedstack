from openai import OpenAI
from typing_extensions import override
import os
import json

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def highlight_theme(text: str, theme: str, reasoning: str, key_terms: list[str]) -> str:
    return f"Theme: {theme}\nReasoning: {reasoning}\nKey Terms: {', '.join(key_terms)}\nHighlighted Text: {text}"

def add_theme(theme: str) -> str:
    return f"Added theme: {theme}"

highlight_theme_schema = {
    "type": "function", "function": {
        "description": "Visually highlight a snippet of text in the current conversation that relates to a design theme.",
        "name": "highlight_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "text_snippet": {"type": "string", "description": "The text snippet to be highlighted."},
                "design_theme": {"type": "string", "description": "The theme that relates to the text."},
                "reasoning": {"type": "string", "description": "The reasoning as the text relates to the theme."},
                "key_terms": {"type": "array", "items": {"type": "string"}, "description": "Additional key terms from the highlight."}
            },
            "required": ["text_snippet", "design_theme", "reasoning", "key_terms"]
        }
    }
}

add_theme_schema = {
    "type": "function", "function": {
        "description": "Add a theme that is relevant to the current conversation to a list that is displayed visually to the user on the frontend.",
        "name": "add_theme",
        "parameters": {
            "type": "object",
            "properties": {
                "design_theme": {"type": "string", "description": "A theme that is relevant to the current conversation."}
            },
            "required": ["design_theme"]
        }
    }
}

assistant = client.beta.assistants.create(
    name="Design Assistant",
    instructions="You are a design expert. Engage with the user, a novice designer, by giving highly valuable design feedback. Respond as casually, conversationally, and concisely as possible in 1-5 sentences max unless explicitly asked by the user to elaborate. Ask follow-up questions if needed. Allow the user guide the pace and flow of the conversation topic. Avoid the use of number or bullet point lists. Use the highlight_theme function to emphasize important design concepts.",
    tools=[highlight_theme_schema, add_theme_schema],
    model="gpt-4o",  
)

def create_thread_with_image(image_url: str):
    thread = client.beta.threads.create()
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=[
            {"type": "text", "text": "I need feedback on this design."},
            {"type": "image_url", "image_url": {"url": image_url}}
        ]
    )
    return thread

def add_message_to_thread(thread_id: str, content: str):
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=content
    )
    return message

def get_ai_response(thread_id: str):
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant.id,
        model="gpt-4o"  # Specify the vision model here
    )
    run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    
    while run.status != 'completed':
        if run.status == 'requires_action':
            tool_outputs = []
            for tool in run.required_action.submit_tool_outputs.tool_calls:
                if tool.function.name == "highlight_theme":
                    args = json.loads(tool.function.arguments)
                    output = highlight_theme(args['text_snippet'], args['design_theme'], args['reasoning'], args['key_terms'])
                    tool_outputs.append({"tool_call_id": tool.id, "output": output})
                elif tool.function.name == "add_theme":
                    args = json.loads(tool.function.arguments)
                    output = add_theme(args['design_theme'])
                    tool_outputs.append({"tool_call_id": tool.id, "output": output})

            if tool_outputs:
                run = client.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread_id,
                    run_id=run.id,
                    tool_outputs=tool_outputs
                )
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    return messages.data[0].content[0].text.value