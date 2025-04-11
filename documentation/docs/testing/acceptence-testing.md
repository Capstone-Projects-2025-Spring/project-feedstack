---
sidebar_position: 3
---
# Acceptance test for Feedstack

## Introduction
Acceptence testing in Feedstack assesses the project for all functional & nonfunctional requirements. Using a production-like environment, all system components are evaluated in a **Continual Integration** pipeline. Powered by *Docker* and *Jenkins*, automation of the execution of acceptance-testing provides insighht into real-time application behavior to reliably deliver updates.

---

## **Continual Integration(CI)**
**Purpose:** 
The **GitHub hook trigger for GITScm polling** in Jenkins listens for push events from GitHub, ensuring that the pipeline automatically runs as soon as a change is pushed to the repository, keeping the integration process seamless and continuous.

### Implimentation:
When Jenkins receives a GitHub push hook, GitHub Plugin checks to see whether the hook came from a GitHub repository which matches the Git repository defined in SCM/Git section of this job. If they match and this option is enabled, GitHub Plugin triggers a one-time polling on GITScm.

---

###Groovy Pipeline Script 

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // Clone the GitHub repository
                git branch: 'JonWorking', url: 'https://github.com/Capstone-Projects-2025-Spring/project-feedstack.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('Feedstack') {
                    sh 'pip install -r requirements.txt' // Install dependencies
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('Feedstack') {
                    sh 'pytest unit_test.py --junitxml=test-results.xml' //python testing
                }
            }
        }
    }
}
```

## 1. User Login and Upload

**Test Cases:**
- User can successfully log in using an ID.
- User is blocked from uploading without logging in.
- After login, user is prompted to upload a design image.
- System accepts supported image formats (e.g., JPG, PNG).
- Uploaded image is displayed clearly on the left-hand side.

---

## 2. Chatbot Feedback Interaction

**Test Cases:**
- Chatbot generates accurate and context-aware feedback after a user query.
- Chat interface accepts multiline input and handles long queries.
- GPT-4o API returns feedback within an acceptable response time.
- Feedback refers to specific design elements in the uploaded image.
- No hallucinations or feedback errors occur under normal use.

---

## 3. Theme Detection and Accordion Generation

**Test Cases:**
- Each chatbot response is correctly analyzed for design themes (Accessibility, Visual Hierarchy, etc.).
- Accurate accordion is generated with the right theme title.
- Clicking the accordion displays the corresponding feedback summary.
- Multiple feedback instances under the same theme are listed correctly with summaries.

---

## 4. Highlighted Keywords

**Test Cases:**
- Key design-related terms are correctly highlighted in the chatbot response.
- All keywords under each accordion are listed below it accurately.




