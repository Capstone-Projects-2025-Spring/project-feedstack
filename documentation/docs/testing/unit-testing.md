---
sidebar_position: 1
---
# Unit Tests for Feedstack
Unit testing is a critical component of software development, ensuring that individual components of the application function correctly. This document outlines the unit tests implemented for **Feedstack**.The tests validate the integrity of the **Participant Model**, **DesignUpload Model**, and various API endpoints within the application. 

The unit tests cover the following:

1. Testing the `Participant` model
2. Testing the `DesignUpload` model
3. Testing the `ParticipantView` API
4. Testing the `DesignFeedbackView` API
5. Testing the `ChatbotView` API
6. Testing the `IdentifyThemeView` API

Each test includes the **method** being tested, the **input**, the **expected result**, and a brief explanation of the **test's purpose**.

---

## 1. Testing the Participant Model

### Method: `__str__` representation of Participant model

```python
    def test_participant_string_representation(self):
        participant = Participant.objects.create(participant_id="test123")
        self.assertEqual(str(participant), "test123")
```

#### Explanation:
- **Input:** A `Participant` object is created with `participant_id="test123"`.
- **Expected Result:** The string representation of the object should return "test123".
- **Purpose:** Ensures that the `__str__` method correctly returns the participant ID as a string.

### Method: Participant creation with a unique ID

```python
    def test_participant_unique_id(self):
        Participant.objects.create(participant_id="unique_id")
        with self.assertRaises(Exception):
            Participant.objects.create(participant_id="unique_id")
```

#### Explanation:
- **Input:** Two `Participant` objects with the same `participant_id` are created.
- **Expected Result:** The second creation attempt raises an exception.
- **Purpose:** Verifies that the `participant_id` field is unique and prevents duplicate entries.

---

## 2. Testing the DesignUpload Model

### Method: `DesignUpload`-`Participant` relationship

```python
    def test_design_upload_participant_relationship(self):
        participant = Participant.objects.create(participant_id="design_tester")
        design = DesignUpload.objects.create(
            participant=participant,
            feedback="Test feedback"
        )
        self.assertEqual(design.participant.participant_id, "design_tester")
```

#### Explanation:
- **Input:** A `DesignUpload` object is linked to a `Participant` with ID "design_tester".
- **Expected Result:** The retrieved `participant_id` from `DesignUpload` matches "design_tester".
- **Purpose:** Ensures that each `DesignUpload` is correctly associated with a `Participant`.

---

## 3. Testing the ParticipantView API

### Method: Create a new participant

```python
    def test_create_new_participant(self):
        response = self.client.post(
            reverse('participant'),
            {'participant_id': 'new_user'},
            format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['participant_id'], 'new_user')
```

#### Explanation:
- **Input:** A `POST` request is sent with `participant_id="new_user"`.
- **Expected Result:** Returns HTTP status `201` and the correct participant ID.
- **Purpose:** Confirms that the API successfully creates a new participant.

---

## 4. Testing the DesignFeedbackView API

### Method: Generate feedback for a design

```python
    @patch('feedback_app.views.client.chat.completions.create')
    def test_design_feedback_generation(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "This is AI feedback"
        mock_openai.return_value = mock_response
        
        participant = Participant.objects.create(participant_id="feedback_tester")
        image_data = "data:image/jpeg;base64,..." 
        
        response = self.client.post(
            reverse('design_feedback'),
            {
                'participant': 'feedback_tester',
                'image': image_data
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['feedback'], "This is AI feedback")
```

#### Explanation:
- **Input:** A `POST` request is sent with `participant_id` and a base64-encoded image.
- **Expected Result:** Returns HTTP status `201` and AI-generated feedback.
- **Purpose:** Ensures that the AI feedback generation process functions correctly.

---

## 5. Testing the ChatbotView API

### Method: Generate chat response

```python
    @patch('feedback_app.views.client.chat.completions.create')
    def test_chatbot_response_generation(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "This is a chat response"
        mock_openai.return_value = mock_response
        
        participant = Participant.objects.create(participant_id="chat_tester")
        design = DesignUpload.objects.create(
            participant=participant,
            feedback="Initial feedback"
        )
        
        response = self.client.post(
            reverse('chatbot'),
            {
                'participant_id': 'chat_tester',
                'message': 'Test question'
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data['bot_message']['content'],
            "This is a chat response"
        )
```

#### Explanation:
- **Input:** A `POST` request is sent with `participant_id` and a chat message.
- **Expected Result:** Returns HTTP status `201` and AI-generated chat response.
- **Purpose:** Verifies that the chatbot API generates appropriate responses.

---

## 6. Testing the IdentifyThemeView API

### Method: Identify design theme

```python
    @patch('feedback_app.views.client.chat.completions.create')
    def test_theme_identification(self, mock_openai):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "typography"
        mock_openai.return_value = mock_response
        
        response = self.client.post(
            reverse('identify_theme'),
            {'message': 'This design has great font choices'},
            format='json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['theme'], "typography")
```

#### Explanation:
- **Input:** A `POST` request is sent with a message related to typography.
- **Expected Result:** Returns HTTP status `200` and identifies the theme as "typography".
- **Purpose:** Ensures that the AI correctly identifies and categorizes design themes.

---
