---
sidebar_position: 1
---

# System Overview

# 🖥️ Feedstack - IDE for Feedback

## Abstract

FeedStack is an AI-powered IDE platform designed to provide clear and structured feedback on web design files. The platform serves a wide range of users, such as designers, developers, complete beginners, and generally interested users of web design, enabling quick identification of areas in design files in PNG, JPG, or PDF formats that need improvement. In this context, web design files refer to visual representations of website interfaces, these include static mockups, wireframes screenshots, and high-fidelity prototypes that showcase elements of the webpage like layout, color schemes, typography, and overall aesthetic. Typically, these files are exported from design tools (such as Figma, Sketch, or Adobe) in PNG, JPG, or PDF formats.

Using OpenAI's GPT-4o model, FeedStack analyzes key design aspects such as layout, color contrast, typography, etc. The provided feedback is systematically grouped in line with design themes, hence enabling identification of areas of improvement as well as areas that work effectively. The AI chatbot allows users to ask anything related to the web design and it will provide key expert design feedback. In addition, there is a chat assistant that presents follow-up questions and suggestions to help users easily enhance their web design.

User-friendly, FeedStack runs effectively across modern web browsers on different devices such as desktops and mobile devices. Users enter in an indentifying key to gain access to the application.

Overall, FeedStack greatly enhances the process of evaluating web design by providing quick and reliable analyses that lead to improvement in usability, accessibility, and aesthetic appeal. This document outlines system requirements, design structure, and resources required for use as well as development.

## High-Level Requirement

FeedStack is built with the following broad system goals in mind:

- **File Uploads for AI Analysis:**  
  Users must be able to upload web design files (PNG, JPG, PDF) for AI analysis.

- **Categorized AI Feedback:**  
  AI feedback should be categorized into predefined design themes to provide structured insights.

- **Interactive AI Chatbot:**  
  Users should be able to interact with the AI chatbot, receiving real-time feedback and follow-up suggestions.

- **Accordion-based UI for Feedback Summarization:**  
  Feedback should be summarized using an accordion-based UI, enabling efficient navigation.

- **Cross-Platform Accessibility:**  
  The system must be accessible via web browsers on both desktop and mobile.

- **Authentication via Participant ID:**  
  Authentication should be handled through Users entering a key allowing them to launch the app.

- **Scalable Platform Design:**  
  The platform should be designed for scalability, ensuring it can handle an increasing number of users and design uploads.


## Conceptual Design

FeedStack follows a modular architecture, integrating various components to deliver a seamless user experience and robust functionality:

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

  ![feedstack-design](https://github.com/user-attachments/assets/98175b6a-c5a5-43a1-bde8-88aff5759acd)

  <img width="1132" alt="Screenshot 2025-04-28 at 11 07 11 PM" src="https://github.com/user-attachments/assets/bc017657-d4a5-4434-92f5-e4cdc02baf73" />




## Required Resources

To build and run Feedstack, the following resources are required:
- **AI Model**: OpenAI’s GPT-4o
- **Hosting & Cloud Services**: Fly.io
- **Frontend Framework**: React for responsive and dynamic UI, HTML, CSS
- **Backend & API**: Python, Django REST Framework
- **Database**: Firebase for data storage

## Background and References

FeedStack was conceptualized to address the lack of structured AI feedback in web design analysis. While various design tools provide automated accessibility checks and heuristics-based analysis, few systems leverage AI to provide contextual feedback based on design principles and best practices. FeedStack aims to fill this gap by offering a conversational AI assistant that not only critiques designs but also educates users on why specific design choices matter.

For further reading on AI-powered design evaluation, see:
- Nielsen Norman Group: [Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- WCAG Guidelines: [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- OpenAI API Docs: [GPT-4 Vision API](https://openai.com/research/gpt-4)


