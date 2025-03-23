import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain.tools import tool
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# Initialize the OpenAI model
openai_model = ChatOpenAI(model="gpt-4o")

# Custom tools for interacting with your Django application
@tool
def analyze_design(design_image_path):
    """Analyzes a design image and returns initial feedback."""
    # This would integrate with your existing DesignFeedbackView
    # For now, we'll create a placeholder implementation
    # In production, this would call your Django API
    return "Initial design feedback based on analysis."


@tool
def identify_design_theme(message):
    """Identifies the main design theme from a message"""
    #This would integrate with your IdentifyThemeView
    return "Identified theme based on the message content."

@tool
def generate_theme_summary(theme, message):
    """Generates a summary of a design theme including definition,
    relation, key terms."""
    # This would integrate with your existing SummarizeView
    return {
        "definition": "Definition of the theme",
        "relation": "How the theme relates to design",
        "key_terms": ["term1", "term2", "term3"],
        "summary": "Summary of the theme based on the message"
    }

#AGENTS
design_analyst_agent = Agent(
    role="Design Analyst",
    goal="Analyze designs and provide detailed, constructive feedback",
    backstory="You are an expert design analyst with years of experience evaluating designs across various domains.",
    verbose=True,
    llm=openai_model,
    tools=[analyze_design]
)

theme_identifier_agent = Agent(
    role="Theme Identifier",
    goal="Identify key design themes and principles from conversations",
    backstory="You excel at recognizing underlying design principles and categorizing design feedback into relevant themes.",
    verbose=True,
    llm=openai_model,
    tools=[identify_design_theme]
)

content_organizer_agent = Agent(
    role="Content Organizer",
    goal="Organize design feedback into structured, educational content",
    backstory="You specialize in transforming unstructured feedback into organized, educational content that links to design principles.",
    verbose=True,
    llm=openai_model,
    tools=[generate_theme_summary]
)

#TASKS
analyze_design_task = Task(
    description="Analyze the uploaded design and provide comprehensive feedback",
    agent=design_analyst_agent,
    expected_output="Detailed design feedback highlighting strengths and areas for improvement"
)

identify_themes_task = Task(
    description="Identify key design themes from the feedback conversation",
    agent=theme_identifier_agent,
    expected_output="List of identified design themes with confidence scores",
    context=[analyze_design_task]
    # This task depends on the output of the design analysis
)

organize_content_task = Task(
    description="Organize feedback into structured content with principles, definitions, and key terms",
    agent=content_organizer_agent,
    expected_output="Structured content organized by design themes",
    context=[identify_themes_task]
    # This task depends on the identified themes
)

# Create your crew
feedstack_crew = Crew(
    agents=[design_analyst_agent, theme_identifier_agent,
            content_organizer_agent],
    tasks=[analyze_design_task, identify_themes_task,
           organize_content_task],
    verbose=2,
    process=Process.sequential # Tasks will run in sequence
)

# Function to run the crew
def process_design_with_crew(design_image_path):
    """Process a design with the CrewAI workflow"""
    result = feedstack_crew.kickoff(inputs={"design_image_path": design_image_path})
    return result





