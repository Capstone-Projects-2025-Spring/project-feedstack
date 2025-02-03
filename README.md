[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17853696)
<div align="center">

# Feedstack
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-spring.github.io/project-feedstack/)


</div>


### 1. System Overview

Feedstack is an AI-powered design feedback system that combines GPT-4 Vision capabilities with natural language processing to provide intelligent design analysis. The system features a three-panel interface displaying the uploaded design, an interactive chat interface, and a dynamic theme-based feedback organization system.

#### 1.1 Core Components
-Frontend: React-based user interface
-Backend: Django REST framework
-AI Integration: OpenAI GPT-4o API
-Database: Firebase for data persistence
-Natural Language Processing: NLTK and Word2Vec for term analysis
-Authentication: Google Sign-In

#### 1.2 Key Features
-Design upload and analysis
-AI-powered conversational feedback
-Theme-based feedback organization
-Interactive chat with context awareness
-Term highlighting with semantic matching
-Bookmark-based navigation
-Expandable theme summaries

#### 1.3 System Block Diagram

![Alt text](/img/feedstack1.png)

#### 1.4 Use Case 1 - Account Creation
As a user, I want to create an account to maintain my design feedback history and project progress.

-The user accesses the Feedstack web application.
-The user clicks on 'Register' to open the account creation form.
-The user fills out the required fields (email, username, password).
-After submitting, the system validates the data and creates the account.
-A success message confirms account creation.

#### 1.4 Use Case 2 - Signing In
As a user, I want to log into my account to access my saved designs and feedback.

-The user clicks on the 'Login' button.
-The user enters valid credentials (email and password).
-Upon successful authentication, the user is redirected to the dashboard.
-If credentials are invalid, an error message is displayed.

#### 1.4 Use Case 3 - Uploading a Design for Feedback
As a designer, I want to upload my design to receive AI-generated feedback on accessibility and usability.

-The user logs in and clicks 'Upload Design.'
-The user selects a file (PNG, JPG, PDF) and submits it.
-The system validates and processes the file.
-Feedback is generated using GPT-4 Vision and displayed in categorized themes.

![Alt text](/img/feedstack7.png)

#### 1.4 Use Case 4 - Collaborative Feedback Mode
As a team member, I want to collaborate on design feedback in real-time with my colleagues.

-The user logs in and accesses a design project.
-The user invites collaborators via email.
-Team members can view, annotate, and leave comments on feedback.
-Real-time updates ensure changes are visible to all participants.

![Alt text](/img/feedstack8.png)

#### 1.5 User Personas

![Alt text](/img/feedstack2.png)

![Alt text](/img/feedstack3.png)

### **2\. System Architecture**

#### **2.1 Frontend Architecture**

\[React Application\]  
├── Components  
│   ├── ParticipantLogin  
│   ├── DesignUpload  
│   └── Feedback  
│       ├── ImageViewer  
│       ├── ChatInterface  
│       └── ThemeAccordion  
├── Assets  
│   └── Sounds  
├── Styles  
└── Firebase Integration

#### **2.2 Backend Architecture**

\[Django Application\]  
├── feedback\_app  
│   ├── views.py  
│   ├── models.py  
│   ├── urls.py  
│   └── serializers.py  
├── feedstack\_project  
│   ├── settings.py  
│   └── urls.py  
└── media  
    └── uploads

**2.3 Framework Visual References / Prototypes**

**Wireframes:**  
![Alt text](/img/feedstack4.png)
![Alt text](/img/feedstack5.png)
![Alt text](/img/feedstack6.png)

### 

### 

### **3\. Technical Requirements**

#### **3.1 Development Environment**

\# Required Python packages  
\- django==4.2.0  
\- djangorestframework==3.14.0  
\- django-cors-headers==4.0.0  
\- pillow==9.5.0  
\- python-dotenv==1.0.0  
\- openai==1.0.0  
\- sentence-transformers==2.2.2  
\- nltk==3.8.1  
\- numpy==1.24.3

\# Required Node.js packages  
\- react: "^18.2.0"  
\- react-router-dom: "^6.8.1"  
\- axios: "^1.3.4"  
\- markdown-it: "^13.0.1"  
\- firebase: "^9.17.2"  
\- framer-motion: "^10.0.1"

#### **3.2 System Setup**

\# Backend Setup  
python \-m venv venv  
source venv/bin/activate  \# Unix  
venv\\Scripts\\activate    \# Windows  
pip install \-r requirements.txt

\# Frontend Setup  
cd client  
npm install

\# Environment Variables  
OPENAI\_API\_KEY=your\_api\_key  
DJANGO\_SECRET\_KEY=your\_secret\_key  
CORS\_ALLOWED\_ORIGINS=http://localhost:3000

**4\. Functional Requirements**

#### **4.1 User Authentication**

* **Participant Login:**  
  * Secure user login using Google Sign-In.  
  * Optional integration for passwordless authentication.  
* **Maintain User Session Data:**  
  * Track active user sessions to preserve interaction history across sessions.  
  * Implement secure session management with automatic logout after inactivity.  
* **Track User Interactions:**  
  * Monitor and log user activities, including design uploads, feedback requests, and chat interactions.  
  * Provide a detailed interaction history for users to review previous feedback sessions.

#### **4.2 Design Upload**

* **File Support:**  
  * Accept design files in PNG, JPG, and PDF formats.  
* **Secure File Upload Handling:**  
  * Implement encrypted file transfers and secure storage.  
* **File Validation and Processing:**  
  * Validate file type, size, and format integrity before processing.  
  * Handle potential upload errors with user-friendly feedback.

#### **4.3 AI Feedback Generation**

* **Design Analysis:**  
  * Utilize GPT-4 Vision for intelligent design analysis.  
* **Categorized Feedback:**  
  * Automatically organize AI-generated feedback into themes such as Color, Typography, and Layout.  
* **Real-Time Feedback Generation:**  
  * Provide immediate suggestions based on design uploads and user interactions.

#### **4.4 Interactive Chat**

* **Context-Aware Conversations:**  
  * Maintain conversational context to avoid redundant suggestions and track user focus areas.  
* **Follow-Up Question Support:**  
  * Allow users to ask follow-up questions to refine feedback.  
* **Key Term Highlighting:**  
  * Emphasize critical design terms within AI feedback for better user understanding.

#### **4.5 Theme Management**

* **Feedback Organization:**  
  * Categorize feedback into distinct themes for structured insights.  
* **Expandable/Collapsible Summaries:**  
  * Provide concise theme summaries that can be expanded for detailed suggestions.  
* **Quick Navigation:**  
  * Allow users to switch seamlessly between theme-based feedback instances.

#### **4.6 Smart Prompts & Proactive Suggestions**

* **Context-Aware Suggested Questions:**  
  * Offer intelligent prompts based on previous user interactions and design context.  
* **Predictive Feedback with Quick Fix Recommendations:**  
  * Generate actionable recommendations to address design issues proactively.

#### **4.7 Collaborative Mode**

* **Real-Time Annotations:**  
  * Allow users to annotate design elements directly within the platform.  
* **Comment Threads:**  
  * Enable threaded discussions for focused feedback on specific design aspects.  
* **Multi-User Feedback Capabilities:**  
  * Support simultaneous feedback sessions for collaborative design reviews.

### 

### **5\. Non-Functional Requirements**

#### **5.1 Performance**

* **Initial Feedback Generation:**  
  * The system should generate AI-driven design feedback within 30 seconds after a design upload.  
* **Chat Response Time:**  
  * AI conversational responses should be delivered in under 15 seconds to maintain user engagement.  
* **Support for Multiple Concurrent Users:**  
  * The system should handle a minimum of 5 concurrent users without degradation in performance.  
* **System Availability:**  
  * Maintain a system uptime 

  #### **5.2 Security**

* **Secure API Key Handling:**  
  * Protect API keys using environment variables and secure storage practices.

  #### **5.3 Usability**

* **Intuitive UI Design:**  
  * Ensure the interface is user-friendly with minimal learning curves for both novice and experienced users.  
* **Mobile Responsiveness:**  
  * Provide a fully responsive design to support seamless usage on mobile devices, tablets, and desktops.

### 

**6\. Data Models**  
class Participant(models.Model):  
    participant\_id \= models.CharField(max\_length=50, unique=True)  
    created\_at \= models.DateTimeField(auto\_now\_add=True)

class DesignUpload(models.Model):  
    participant \= models.ForeignKey(Participant, on\_delete=models.CASCADE)  
    image \= models.ImageField(upload\_to='uploads/')  
    feedback \= models.TextField(blank=True)

class ChatMessage(models.Model):  
    participant \= models.ForeignKey(Participant, on\_delete=models.CASCADE)  
    content \= models.TextField()  
    is\_user \= models.BooleanField(default=True)

### 

### **7\. API Endpoints**

urlpatterns \= \[  
    path('participant/', ParticipantView.as\_view()),  
    path('upload/', DesignFeedbackView.as\_view()),  
    path('chat/', ChatbotView.as\_view()),  
    path('highlight-terms/', HighlightTermsView.as\_view()),  
    path('suggested-topics/', SuggestedTopicsView.as\_view()),  
\]

### 

### **8\. Testing Requirements**

#### **8.1 Unit Testing**

* **Objective:** Ensure individual components and functions operate correctly in isolation.  
* **Scope:**  
  * Frontend components (React): Test UI elements, state management, and form validation.  
  * Backend APIs (Django REST): Test API endpoints, request handling, and data validation.  
* **Tools:** Jest for frontend testing, PyTest for backend testing.  
* **Key Metrics:**  
  * Identification and resolution of component-specific errors.

#### **8.2 Integration Testing**

* **Objective:** Verify the seamless interaction between frontend and backend components.  
* **Scope:**  
  * Ensure API calls return the correct data and handle error scenarios gracefully.  
  * Test user authentication flows, including session management.  
  * Verify consistent data rendering between backend responses and frontend UI updates.  
* **Tools:** Cypress for end-to-end testing, Postman for API integration testing.  
* **Key Metrics:**  
  * Successful completion of at least 90% of integration test cases.  
  * Minimal frontend-backend data synchronization issues.

#### **8.3 User Acceptance Testing (UAT)**

* **Objective:** Validate that the system meets user expectations and functional requirements.  
* **Scope:**  
  * Core features, including design upload, AI-powered feedback generation, and interactive chat.  
  * Usability tests to ensure an intuitive and responsive user experience.  
  * Collaborative mode testing for multi-user scenarios.  
* **Testing Approach:**  
  * Engage a diverse group of target users for feedback.  
  * Use predefined test scripts to guide the evaluation process.  
  * Document and prioritize user-reported issues for resolution.  
* **Success Criteria:**  
  * At least 95% of core features pass UAT without critical issues.  
  * Positive user feedback regarding system usability and feature effectiveness.

### **9\. Deployment Requirements**

#### **9.1 Production Setup**

* **Static Files Collection:**

Execute the command to gather static files for efficient serving in production:  
`python manage.py collectstatic`

* **Database Migrations:**

Apply all necessary database migrations to ensure schema alignment:  
`python manage.py migrate`

* **Application Server:**

Launch the application using Gunicorn as the production server:  
`gunicorn feedstack_project.wsgi:application`

#### **9.2 Environment Configuration**

* **Environment Variables:**  
  * Store and manage sensitive configuration details in environment variables, such as:  
    * `SECRET_KEY`  
    * Database connection credentials  
    * API keys for GPT-4 Vision and Firebase  
* **Environment Setup:**  
  * Use `.env` files for local development and environment-specific configurations.

#### **9.3 Security Configuration**

* **HTTPS Configuration:**  
  * Enable HTTPS for secure communication using SSL/TLS certificates.  
* **Firewall and Security Groups:**  
  * Set up firewall rules to restrict unauthorized access to production servers.  
* **Django Security Settings:**  
  * Set `DEBUG = False` in production.  
  * Configure `ALLOWED_HOSTS` to whitelist valid domains.  
  * Use `SECURE_BROWSER_XSS_FILTER`, `SECURE_HSTS_SECONDS`, and `CSRF_COOKIE_SECURE`.



## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/omarshakir8">
            <img src="https://avatars.githubusercontent.com/u/71716775?v=4" width="100;" alt="Omar"/>
            <br />
            <sub><b>Omar Shakir</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/JonCherryy">
            <img src="https://avatars.githubusercontent.com/u/153747009?v=4" width="100;" alt="Jonothan Cherry"/>
            <br />
            <sub><b>Jonothan Cherry</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/JPLahoda">
            <img src="https://avatars.githubusercontent.com/u/93489427?v=4" width="100;" alt="Jason"/>
            <br />
            <sub><b>Jason Lahoda</b></sub>
        </a>
    </td><td align="center">
        <a href="https://github.com/Jack-Wylie13">
            <img src="https://avatars.githubusercontent.com/u/156946045?v=4" width="100;" alt="Jack Lyle"/>
            <br />
            <sub><b>Jack Wylie</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/JRheeTU">
            <img src="https://avatars.githubusercontent.com/u/143642672?v=4" width="100;" alt="leighflagg"/>
            <br />
            <sub><b>Joshua Rhee</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Random76520">
            <img src="https://avatars.githubusercontent.com/u/123013478?v=4" width="100;" alt="Augustin"/>
            <br />
            <sub><b>Jonathan Augustin</b></sub>
        </a>
    </td>
    </tr>
</table>

[//]: # ( readme: collaborators -end )
