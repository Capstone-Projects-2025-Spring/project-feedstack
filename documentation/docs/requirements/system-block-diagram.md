---
sidebar_position: 2
---

# System Block Diagram

![Feedstack SBD (2)](https://github.com/user-attachments/assets/5acf5ad2-db62-4591-823f-643d7fd596c5)
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

- **Storage & Database (Firebase)**  
  Stores user-uploaded files, feedback data, and chat history.

- **Version Control & Deployment (GitHub, Fly.io)**  
  Manages the development process, ensuring stability and continuous updates.
