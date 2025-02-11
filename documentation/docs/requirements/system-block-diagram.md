---
sidebar_position: 2
---

# System Block Diagram

![diagram-4](https://github.com/user-attachments/assets/99371d8f-499a-4299-8664-c37f2b06803d)
Figure 1.1
# FeedStack Modular Architecture

The FeedStack system follows a modular architecture, integrating various components to provide an efficient AI-driven web design feedback platform. The architecture consists of three primary layers:

Client Application (Frontend & Hosting)
Backend Services
External Services (AI & Storage)
This document describes the role of each component and their interactions in the system.

## System Components
- **Frontend (React, JavaScript, HTML, CSS)**  
  Provides an intuitive UI for file uploads, AI interactions, and feedback visualization.

- **Backend (Django, Python)**  
  Handles file storage, request processing, and AI API communication.

- **AI Integration (OpenAI GPT-4o API, Word2Vec)**  
  Processes design files, extracts insights, and categorizes feedback into predefined themes.

- **Authentication (Google OAuth 2.0)**  
  Enables secure user login.

- **Storage & Database (Firebase)**  
  Stores user-uploaded files, feedback data, and chat history.

- **Version Control & Deployment (GitHub, Grok)**  
  Manages the development process, ensuring stability and continuous updates.
