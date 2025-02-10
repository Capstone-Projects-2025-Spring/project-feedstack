---
sidebar_position: 4
---

# Functional Requirements

## 1. AI Feedback Generation
- System must be able to analyze designs using OpenAI GPT-4 Vision API.
- Feedback must be categorized into predefined design themes.
- The chatbot shall provide interactive explanations and follow-up suggestions.

## 2. Design Upload & Processing
- Users must be able to upload the most common image formats: PNG, JPG, & PDF.
- System must be able to validate varying file format and size (size limited to 2 gigs).

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
- System must support secure login via Google Sign-In.
- User sessions must be maintained securely.

# Non-Functional Requirements

## 1. Performance
- Initial Image Design Feedback must be generated within **30 seconds**.
- Separate user chat's response time must be under **15 seconds**.
- The system should be able to meet the two benchmarks above with **at least 20 people**.

## 2. Security
- API keys must be **securely stored and managed**, unable to be seen by the user via the site.
- All user data must be **encrypted in transit**.
- Session management should **prevent unauthorized access**.

## 3. Usability
- The **mobile-view** should have the same navigation options as desktop view.
- User must be able to **navigate** to desired pages within 20 seconds.
- Design feedback must be readable and eyecatching, having the most important parts **highlighted, accented, or bolded**.
- Color contrast and typography must meet **WCAG accessibility guidelines**.

## 4. Scalability
- **Load balancing** for large amounts of network requests should be implemented
