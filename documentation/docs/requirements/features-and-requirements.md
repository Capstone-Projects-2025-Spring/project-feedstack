---
sidebar_position: 4
---

# Functional Requirements

## 1. AI Feedback Generation
- The system must analyze web design files using the OpenAI GPT-4o.
- The chatbot shall provide interactive explanations and follow-up suggestions related to design principles.
- Feedback should highlight key design elements such as typography, color contrast, and structure.

## 2. Design Upload & Processing
- Users must be able to upload web design files in PNG, JPG, and PDF formats.
- The system must validate uploaded files and restrict file sizes to a maximum of 50MB.
- Uploaded design artifacts must be visually displayed within the interface for analysis.

## 3. Theme-Based Accordion Feedback
- Feedback shall be structured under collapsible theme-based "Chapters" (accordions).
- **Sub-requirements:** Each chapter shall contain:
  - **Principle Definition:** A concise AI-generated explanation of the design principle.
  - **Relation to Design:** An explanation of how the principle applies to the uploaded design.
  - **Key Terms:** Highlighted words within the feedback that relate to the design principle.
- AI-generated feedback must be categorized into predefined design themes.
- Users must be able to expand and collapse chapters to view relevant feedback.

## 4. Bookmark Navigation
- Users shall be able to bookmark specific feedback points
- Clicking a bookmark must scroll the user to the bookmarked point

## 5. Dynamic Chapter Discovery
- As new design principles are introduced in the feedback conversation, corresponding chapters must appear in the accordion panel.
- Design principles can be in a pre-defined list.
- Related but **not explicitly mentioned** design principles shall appear in a faded "Emerging Chapters" state.
- Users must be able to interact with emerging chapters to expand and gain additional insights.

## 6. Contextual Term Highlighting
- The chatbot must highlight key terms within its feedback that are relevant to the discussed design principle.
- Hovering over a highlighted term should display a brief explanation of its relevance to design.

## 7. Chapter Instance Navigation
- Users must be able to navigate between multiple instances of feedback for the same design principle within a chapter.
- Clicking forward or backward through instances must also scroll the chat to the relevant portion of the conversation.

## 8. CrewAI
- CrewAI is a lightweight, high-speed Python framework designed to facilitate the creation of autonomous AI agent teams that collaborate to handle complex tasks. Developed independently from other agent frameworks like LangChain, CrewAI offers both high-level simplicity and detailed low-level control, making it suitable for various scenarios.
- Key components of CrewAI include:
   - **Crews:** These are top-level organizations that manage AI agent teams, oversee workflows, ensure collaboration, and deliver outcomes.
   - **AI Agents:** Specialized team members assigned specific roles, equipped with designated tools, capable of delegating tasks, and making autonomous decisions.
   - **Processes:** Workflow management systems that define collaboration patterns, control task assignments, manage interactions, and ensure efficient execution.​
   - **Tasks:** Individual assignments with clear objectives, utilizing specific tools, contributing to the larger process, and producing actionable results.
- CrewAI's design mirrors organizational structures where departments collaborate under leadership to achieve business goals, enabling developers to create AI teams with specialized roles working together to accomplish complex tasks.
- In addition to having such a favorable design and performance for users, CrewAI is also capable of providing interface features meant to provide a better visualization of how they should present themselves.


## 9. **Scrub Bar:** 
A visual progress tracker that lets users quickly navigate through different points within the interaction.

## 10. **Smart Suggestions:** 
Context-aware prompts or follow-up questions generated based on user queries.

## 11.**Quick Menu:** 
A docked menu that lets users quickly jump between related concepts or interface elements.
      - Lets users navigate feedback topics by design principle or instance frequency.
      - Offers **Excerpts**, as well as the aforementioned **Definitions** and **Key Terms**.
      - Guarantees an *Initial Feedback* section.
      
## 12.**Navigation Bar:** 
Users can tap to expand categories to see related feedback.

# Non-Functional Requirements

1. **Performance**  
   The system shall provide AI feedback within 15-20 seconds for at least 90% of operations under typical load.
   Use simple performance testing (manual timing or local scripts) to confirm that 90% of requests return feedback within this time.

   
2. **Availability and Reliability**  
   - During testing and demonstrations, the system should be available at least 95% of the time.  
   - Monitor uptime during demo sessions, using a simple monitoring tool or manual checks to verify that the system remains available 95% of the time.

3. **Maintainability and Extensibility**  
   - The codebase should be modular and well-documented, with a minimum of 60% unit test coverage.  

