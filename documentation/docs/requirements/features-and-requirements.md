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


# Non-Functional Requirements

1. **Performance**  
   The system shall provide AI feedback within 15-20 seconds for at least 90% of operations under typical load.
   Use simple performance testing (manual timing or local scripts) to confirm that 90% of requests return feedback within this time.

3. **Scalability**  
   - The system should atleast 10 concurrent user sessions without significant effect to performance .  
   
4. **Availability and Reliability**  
   - During testing and demonstrations, the system should be available at least 95% of the time.  
   - Monitor uptime during demo sessions, using a simple monitoring tool or manual checks to verify that the system remains available 95% of the time.

5. **Security**  
   - The system shall use Google Sign-In for authentication and encrypt data in transit using TLS.  
   - Test the authentication process to ensure only authorized users can sign in, and verify TLS encryption using browser developer tools (confirm that connections use TLS 1.2 or higher).

7. **Maintainability and Extensibility**  
   - The codebase should be modular and well-documented, with a minimum of 60% unit test coverage.  

