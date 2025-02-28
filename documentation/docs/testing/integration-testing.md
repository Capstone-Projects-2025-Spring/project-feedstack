---
sidebar_position: 2
---
# Integration Tests for Feedstack Project

## Introduction
Integration testing is essential for verifying that different components of an application work together as expected. Unlike unit tests, which focus on isolated functions, integration tests evaluate user workflows and interactions between modules. This document outlines the integration tests for the **Feedstack Project**, ensuring that key functionalities, such as user registration, design uploads, chatbot interactions, and theme identification, function correctly in a cohesive environment.

Each integration test simulates a complete user flow, leveraging mocked external dependencies to provide consistent, automated testing. The following sections describe various integration tests implemented in the project:

1. **User Registration and Design Upload Flow**
2. **Chat Conversation Flow**
3. **Theme Identification and Summarization Flow**
4. **End-to-End User Journey**

---

## 1. User Registration and Design Upload Flow
This test verifies the complete flow from user registration through design upload to initial feedback generation.

### Test Implementation

```python
# feedback_app/tests/test_integration.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
import base64
from unittest.mock import patch, MagicMock
from feedback_app.models import Participant, DesignUpload

class RegistrationAndUploadFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
    @patch('feedback_app.views.client.chat.completions.create')
    def test_registration_and_upload_flow(self, mock_openai):
        """Test user registration and design upload flow"""
        # Mock OpenAI response for design feedback
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Your design has a clean layout with good color choices."
        mock_openai.return_value = mock_response
        
        # Step 1: Register new participant
        participant_response = self.client.post(
            reverse('participant'),
            {'participant_id': 'integration_test_user'},
            format='json'
        )
        self.assertEqual(participant_response.status_code, 201)
        
        # Verify participant was created in database
        self.assertTrue(Participant.objects.filter(participant_id='integration_test_user').exists())
        
        # Step 2: Upload design image
        test_image_data = "data:image/jpeg;base64,/9j/..."
        
        upload_response = self.client.post(
            reverse('design_feedback'),
            {
                'participant': 'integration_test_user',
                'image': test_image_data
            },
            format='json'
        )
        
        # Verify upload and feedback generation
        self.assertEqual(upload_response.status_code, 201)
        self.assertEqual(upload_response.data['feedback'], "Your design has a clean layout with good color choices.")
        
        # Verify design was saved in database
        self.assertTrue(DesignUpload.objects.filter(participant__participant_id='integration_test_user').exists())
```

---

## 2. Chat Conversation Flow
This test verifies the chat interaction flow after a design has been uploaded.

### Test Implementation

```python
class ChatConversationFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.participant = Participant.objects.create(participant_id="chat_flow_user")
        self.design = DesignUpload.objects.create(
            participant=self.participant,
            feedback="Initial design feedback"
        )
    
    @patch('feedback_app.views.client.chat.completions.create')
    def test_multi_turn_conversation(self, mock_openai):
        """Test multiple turns of conversation with the AI assistant"""
        mock_response1 = MagicMock()
        mock_response1.choices[0].message.content = "The color scheme works well for your target audience."
        mock_openai.return_value = mock_response1
        
        chat_response1 = self.client.post(
            reverse('chatbot'),
            {
                'participant_id': 'chat_flow_user',
                'message': 'What do you think about my color choices?'
            },
            format='json'
        )
        
        self.assertEqual(chat_response1.status_code, 201)
        self.assertEqual(chat_response1.data['bot_message']['content'], "The color scheme works well for your target audience.")
```

---

## 3. Theme Identification and Summarization Flow
This test verifies the flow for theme identification and summarization from chat messages.

### Test Implementation

```python
class ThemeAndSummarizationFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.participant = Participant.objects.create(participant_id="theme_flow_user")
        self.design = DesignUpload.objects.create(
            participant=self.participant,
            feedback="Your design shows good use of white space."
        )
    
    @patch('feedback_app.views.client.chat.completions.create')
    def test_theme_identification_and_summarization(self, mock_openai):
        """Test identifying themes from feedback and generating summaries"""
        chat_response = MagicMock()
        chat_response.choices[0].message.content = "The layout is well-structured but could use better alignment."
        mock_openai.return_value = chat_response
        
        chat_result = self.client.post(
            reverse('chatbot'),
            {
                'participant_id': 'theme_flow_user',
                'message': 'What do you think about my layout?'
            },
            format='json'
        )
        
        theme_response = MagicMock()
        theme_response.choices[0].message.content = "layout"
        mock_openai.return_value = theme_response
        
        theme_result = self.client.post(
            reverse('identify_theme'),
            {'message': chat_result.data['bot_message']['content']},
            format='json'
        )
        
        self.assertEqual(theme_result.status_code, 200)
        self.assertEqual(theme_result.data['theme'], "layout")
```

---

## 4. End-to-End User Journey
This test simulates the complete user journey from registration to feedback to multiple chat interactions.

### Test Implementation

```python
class EndToEndUserJourneyTest(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    @patch('feedback_app.views.client.chat.completions.create')
    def test_complete_user_journey(self, mock_openai):
        """Test the complete user journey through the application"""
        self.client.post(
            reverse('participant'),
            {'participant_id': 'journey_test_user'},
            format='json'
        )
```

---

## Conclusion
These integration tests ensure that the **Feedstack Project** components work together seamlessly, covering user registration, design uploads, chatbot interactions, and theme identification. By utilizing mocked external dependencies, these tests validate complete workflows, ensuring robustness and reliability in the application.

