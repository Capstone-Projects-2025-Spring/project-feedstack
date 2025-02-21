---
sidebar_position: 2
---

# Algorithms & AI Model Explanation 
Feedstack leverages AI-powered analysis to provide structured, actionable feedback on visual designs. Two core AI components drive this process:

## GPT-4o

The GPT-4 Vision API processes uploaded UI designs and provides structured feedback based on accessibility, typography, color contrast, and layout and more.

### Processing Steps
1. **User Uploads a Design**
   - Users submit a PNG, JPG, or PDF file via the Feedstack interface.
   - The frontend validates the file type and size before sending it to the backend.
   - The design is stored in Firebase Storage or a local Django directory.

2. **Backend Prepares API Request**
   - The Django backend retrieves the file path and prepares an API request.
   - A structured prompt ensures relevant feedback, such as:
     ```plaintext
     Analyze this UI design and identify potential issues related to accessibility, typography, color contrast, and layout. Provide structured feedback categorized by theme. Respond as if you were a design expert & educator providing simple, constructive feedback to a design student
     ```

3. **AI Feedback Generation**
   - The GPT-4 Vision API processes the image and generates detailed feedback based on the best visual design practices.
   - The response is structured into themes like Color Contrast, Typography, and Layout.

4. **Storing & Displaying Feedback**
   - The backend categorizes and stores feedback in the PostgreSQL database.
   - The frontend displays categorized feedback in an expandable accordion, making it easy for users to navigate.

---

## Word2Vec: Keyword Extraction & Theme Categorization

To enhance readability, Feedstack automatically highlights key terms within feedback using Word2Vec, a word embedding model that links keywords to predefined design themes.

### Processing Steps
1. **Extracting Feedback Text**
   - After GPT-4 Vision generates feedback, the backend tokenizes the text and removes stopwords (e.g., “the”, “is”, “and”).

2. **Identifying Key Terms**
   - Word2Vec analyzes the text and identifies meaningful keywords based on their relevance to visual design.
   - **Example:**
     ```plaintext
     The text contrast is too low → Word2Vec detects “contrast” as a keyword.
     It maps “contrast” to the Color Contrast theme based on learned word associations.
     ```

3. **Highlighting Keywords in Feedback**
   - The frontend visually highlights important terms in feedback.
   - Hovering over a keyword displays a tooltip with an explanation, such as:
     ```plaintext
     "Low contrast affects readability. Aim for a minimum 4.5:1 ratio to meet accessibility guidelines."
     ```

4. **Enhancing User Interaction**
   - The chatbot references these highlighted keywords in conversations.
   - Clicking a keyword navigates users to relevant resources (e.g., WCAG guidelines).

## Data Sources Used

- **Word2Vec Model**
  - Uses Google’s pre-trained Word2Vec embeddings.
  - Can be fine-tuned with visual design articles and annotated datasets to improve theme categorization.

---

## Fallback Handling: Ensuring System Reliability

AI models can sometimes fail due to API errors, timeouts, or incorrect responses. Feedstack includes fallback mechanisms to maintain a seamless experience.

### Handling GPT-4 Vision API Failures
- If the API times out or returns an invalid response, the system:
  - Retries the request up to **3 times**.
  - If all retries fail, displays fallback feedback such as:
    ```plaintext
    "Ensure your text has sufficient contrast and your layout follows accessibility principles."
    ```
  - Logs the error for debugging and future improvements.

### Handling Word2Vec Keyword Extraction Failures
- If no keywords are detected, the system:
  - Uses a predefined list of keywords from common design heuristics.
  - Allows **manual user tagging**, so users can assign themes themselves if necessary.

---
