---
sidebar_position: 4
---

# Functional Requirements

## 1. AI Feedback Generation
- System shall analyze designs using OpenAI GPT-4 Vision API.
- Feedback shall be categorized into predefined design themes.
- The chatbot shall provide interactive explanations and follow-up suggestions.

## 2. Design Upload & Processing
- Users can upload PNG, JPG, or PDF files.
- System shall validate file format and size.
- Uploaded files shall be processed for AI analysis.

## 3. Theme-Based Accordion Feedback
- Feedback shall be structured under collapsible theme-based accordions.
- Each accordion shall include:
  - **Definition** of the design principle.
  - **Relation to Design** explaining its impact.
  - **Key Terms** such as font, contrast, layout, etc.

## 4. Bookmark Navigation
- Users shall be able to bookmark specific feedback points.
- Clicking a bookmark shall anchor the user to the relevant accordion section.
- System shall allow quick switching between related themes.

  ## 5. User Authentication
- System shall support secure login via Google Sign-In.
- User sessions shall be maintained securely.

# Non-Functional Requirements

## 1. Performance
- AI feedback must be generated within **30 seconds**.
- Chat response time must be under **15 seconds**.
- The system should support **concurrent users efficiently**.

## 2. Security
- API keys must be **securely stored and managed**.
- All user data must be **encrypted in transit**.
- Session management should **prevent unauthorized access**.

## 3. Usability
- The UI must be **intuitive and mobile-responsive**.
- Design feedback must be presented in a **structured and accessible manner**.
- Color contrast and typography must meet **accessibility standards**.

## 4. Scalability
- **Load balancing and caching mechanisms** should be implemented.
- Percentage of generations resulting in faulty responses should be **< 5%**
