---
sidebar_position: 1
---

# Feedstack Architecture

## Purpose
This document outlines the architectural foundation of Feedstack, detailing its key components, data flow, and system interactions. The primary objective is to establish a robust and maintainable framework that supports real-time feedback generation while ensuring future scalability.

A core feature of Feedstack is its structured feedback system, facilitated through the use of "Chapters." These Chapters categorize insights based on visual design principles, offering a clear and organized way to analyze and improve design elements. Feedback is presented through a peripheral side panel, allowing users to view critiques in context with their design files. This structured approach ensures that design principles remain at the forefront of the evaluation process, helping users make informed adjustments that align with usability best practices.

By emphasizing the role of Chapters, Feedstack not only provides feedback but also educates users on fundamental design principles, fostering a deeper understanding of effective design techniques. The platform's architecture is designed to support real-time processing and iterative refinements, ensuring that users receive actionable insights throughout the design process.

---

## System Overview and Architecture


![Feedstack SBD (2)](https://github.com/user-attachments/assets/0bb6b171-10f0-4272-b06e-6164133dbfad)


Feedstack's architecture is divided into three primary areas:

1. **Client Application (Frontend):** The user-facing web interface where designs are uploaded, feedback is reviewed, and interactive features enhance the user experience.
2. **Backend Services:** The core processing layer that handles file uploads, communicates with external analysis tools, and categorizes the feedback.
3. **External Services:** Integrations with OpenAI’s GPT-4 Vision API for design analysis and Firebase for secure storage.

### System Components and Interfaces

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

- **Python Libraries/**
  - `Django`
  - `djangorestframework`
  - `djangorestframework-simplejwt`
  - `django-cors-headers`
  - `openai`
  - `pillow`
  - `python-dotenv`
  - `scikit-learn`
  - `nltk`
  - `seaborn`
  - `matplotlib`

---

### Use Case: Uploading a Design for Feedback
![Seq3_Use3_ProjectInCS](https://github.com/user-attachments/assets/d08c8d08-5c36-45b9-8c41-c4ab47f93cba)

- Visualizes how the user can upload their design into Feedstack. In this scenario, the user begins from the login screen and works their way into the file upload destination that's housed in the dashboard. This diagram also shows how the file uploading errors will be handled. 

### Use Case: Navigating Feedback Using Bookmarks
![Seq4_Use4_ProjectsInCS](https://github.com/user-attachments/assets/4934b33f-ba97-4852-a2b9-0232347b0ea8)

- Shows how a user can navigate to the feedback of their uploaded document. This diagram skips over the login and file upload processes, and begins right after the system returns it's intial feedback. 

---

## Simple Class Diagram

![diagram-9](https://github.com/user-attachments/assets/a00cd152-2587-420c-9520-c8450133abc3)

---
