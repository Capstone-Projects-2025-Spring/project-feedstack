---
sidebar_position: 1
---
## 1. Purpose

Feedstack is a web-based tool designed to provide structured feedback on web and app designs. By allowing users to upload design files, the system generates categorized insights that help improve usability, consistency, and accessibility. The platform is built using Django for backend processing and React for the frontend interface, ensuring a scalable and efficient solution.

This document outlines the architectural foundation of Feedstack, detailing its key components, data flow, and system interactions. The primary objective is to establish a robust and maintainable framework that supports real-time feedback generation and future scalability.

---

## 2. System Overview and Architecture

![diagram-4](https://github.com/user-attachments/assets/116dca1d-00ea-408b-a9d3-c97da226221e)


Feedstack's architecture is divided into three primary areas:

1. **Client Application (Frontend):** The user-facing web interface where designs are uploaded, feedback is reviewed, and interactive features enhance the user experience.
2. **Backend Services:** The core processing layer that handles file uploads, communicates with external analysis tools, and categorizes the feedback.
3. **External Services:** Integrations with OpenAI’s GPT-4 Vision API for design analysis and Firebase for secure storage.

### 2.1 System Components and Interfaces

#### **Client Application (Frontend - React)**
The frontend provides a streamlined interface where users can interact with the system efficiently.

- **Interfaces:**
  - REST API endpoints for uploading designs and retrieving feedback.
  - WebSockets for handling real-time updates.
  - State management via Redux or Zustand for optimal application performance.

- **Core Functionalities:**
  - **Design Upload:** Users can upload and preview design files.
  - **Feedback Display:** AI-generated feedback is structured into categorized sections.
  - **Interactive Chat:** Users can request additional clarification or insights.
  - **Keyword Highlighting:** Key design terms are identified for better readability.
 
<img width="582" alt="Screenshot 2025-02-16 at 5 04 56 PM" src="https://github.com/user-attachments/assets/608a99d9-0d03-4799-bee1-d4f42a015a94" />

- **Components**
  - `ParticipantLogin/` - Handles user authentication
  - `DesignUpload/` - Upload interface for design files
  - **Feedback/** - Displays AI-generated feedback
    - `ImageViewer/` - Renders uploaded designs
    - `ChatInterface/` - AI-powered chatbot for feedback queries
    - `ThemeAccordion/` - Categorized design feedback

- **Assets/**
  - `Sounds/` - UI feedback sounds for accessibility

- **Styles/** - Global styling for consistency

- **Firebase Integration/** - Authentication and data storage


#### **Backend Services (Django)**
The backend is responsible for handling user requests, processing design files, and managing feedback generation.

- **Interfaces:**
  - REST API to manage frontend communication.
  - Integration with external analysis services to evaluate design files.
  - PostgreSQL database for storing user data and feedback.

- **Core Components:**
  - **Design Processor:** Handles file validation, storage, and analysis requests.
  - **Feedback Generator:** Collects and refines AI-generated feedback.
  - **User Management:** Manages authentication and session handling.
  - **Theme Categorizer:** Sorts feedback into predefined design categories.
  
<img width="585" alt="Screenshot 2025-02-16 at 5 05 10 PM" src="https://github.com/user-attachments/assets/14802ff0-d10e-4358-a35b-b0b263e7dc3c" />

- **feedback_app/**
  - `views.py` - API endpoints for feedback and chat interactions
  - `models.py` - Database models for user uploads and feedback
  - `urls.py` - URL routing for backend services
  - `serializers.py` - Data serialization for API responses

- **feedstack_project/**
  - `settings.py` - Configuration for database, authentication, and APIs
  - `urls.py` - Main backend routing

- **media/**
  - `uploads/` - Secure storage for design files

#### **External Services**
Feedstack integrates external tools to enhance its functionality.

- **OpenAI API:** Evaluates design files and returns structured feedback.
- **Database:** Stores user-uploaded designs and processed feedback securely.

---

## 3. Sequence Diagrams

### Use Case 1: Creating an Account
![Seq1_Use1_ProjectInCS](https://github.com/user-attachments/assets/df4bb4a0-7e01-45a1-a230-a29b6af99793)

- Showcases the steps required to create an account. This diagram also shows the types of errors that may be encountered, as well as how they would be handled. 

### Use Case 2: Signing In
![Seq2_Use2_ProjectInCS](https://github.com/user-attachments/assets/c522a020-2512-4bbc-b5f1-ff236cb07f26)

- Displays the process of signing in with a preexisting account. Shows how the application will handle invalid login credentials. It also showcases how a user can reset their password in the event they forget it. 

### Use Case 3: Uploading a Design for Feedback
![Seq3_Use3_ProjectInCS](https://github.com/user-attachments/assets/d08c8d08-5c36-45b9-8c41-c4ab47f93cba)

- Visualizes how the user can upload their design into Feedstack. In this scenario, the user begins from the login screen and works their way into the file upload destination that's housed in the dashboard. This diagram also shows how the file uploading errors will be handled. 

### Use Case 4: Navigating Feedback Using Bookmarks
![Seq4_Use4_ProjectsInCS](https://github.com/user-attachments/assets/4934b33f-ba97-4852-a2b9-0232347b0ea8)

- Shows how a user can navigate to the feedback of their uploaded document. This diagram skips over the login and file upload processes, and begins right after the system returns it's intial feedback. 

---

## 4. Simple Class Diagram

![diagram-9](https://github.com/user-attachments/assets/a00cd152-2587-420c-9520-c8450133abc3)



## 5. Database Design and ERD
![diagram-7](https://github.com/user-attachments/assets/f0f789e2-c525-475d-9650-d301cfc34ac8)
Feedstack's database structure is designed to streamline user interactions, design uploads, and AI-driven feedback. Users can upload their designs, which are stored in the DESIGNUPLOADS table, linking each design to its uploader. Feedback on these designs is captured in the FEEDBACK table, allowing users to provide comments and ratings. To enhance organization, feedback is categorized under predefined THEMECATEGORIES, ensuring insights align with key UX principles. Additionally, KEYWORDS help analyze and relate uploaded designs to relevant themes. This setup keeps everything structured, making it easy to track, categorize, and improve design feedback.

# Database Structure

- **Users (`USERS`)**: Stores user accounts and tracks uploads.
- **Design Uploads (`DESIGNUPLOADS`)**: Holds uploaded designs linked to users.
- **Feedback (`FEEDBACK`)**: Stores comments and ratings for designs.
- **Theme Categories (`THEMECATEGORIES`)**: Groups feedback under UX/UI themes.
- **Keywords (`KEYWORDS`)**: Helps categorize and relate designs.

# 6. Algorithms & AI Model Explanation 
Feedstack leverages AI-powered analysis to provide structured, actionable feedback on UI/UX designs. Two core AI components drive this process:

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
     Analyze this UI design and identify potential issues related to accessibility, typography, color contrast, and layout. Provide structured feedback categorized by theme.
     ```

3. **AI Feedback Generation**
   - The GPT-4 Vision API processes the image and generates detailed feedback based on UI/UX best practices.
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
   - Word2Vec analyzes the text and identifies meaningful keywords based on their relevance to UI/UX design.
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

---

## Data Sources Used

- **Word2Vec Model**
  - Uses Google’s pre-trained Word2Vec embeddings.
  - Can be fine-tuned with UX design articles and annotated datasets to improve theme categorization.

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

