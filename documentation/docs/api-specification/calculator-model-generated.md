---
sidebar_position: 3
---

# Feedstack API - Class Documentation

## Class: `Participant`

### Description
Represents an entity interacting with the system, primarily a user submitting design feedback.

### Fields
- `private int id` - Unique identifier for the participant.
- `private String name` - Full name of the participant.
- `private String email` - Contact email for correspondence and authentication.
- `private Date createdAt` - Timestamp indicating the entity creation time.

### Methods
#### `public Participant()`
**Description:** Default constructor that initializes participant properties.

#### `public int getId()`
**Returns:** Unique identifier of the participant.

#### `public String getName()`
**Returns:** Full name of the participant.

#### `public String getEmail()`
**Returns:** Email of the participant.

#### `public Date getCreatedAt()`
**Returns:** Timestamp of when the participant record was created.

---

## Class: `ChatMessage`

### Description
Stores dialogue between a participant and the system for design feedback.


### Fields
- `private int id` - Unique identifier for the chat message.
- `private Participant participant` - Reference to the participant.
- `private String message` - Message content.
- `private Date timestamp` - System-generated timestamp upon message creation.

### Methods
#### `public ChatMessage()`
**Description:** Default constructor that initializes chat message properties.

#### `public int getId()`
**Returns:** Unique identifier of the chat message.

#### `public Participant getParticipant()`
**Returns:** Associated participant.

#### `public String getMessage()`
**Returns:** Content of the message.

#### `public Date getTimestamp()`
**Returns:** Timestamp of when the message was created.

---

## Class: `DesignUpload`

### Description
Represents an uploaded design file submitted for evaluation and feedback.

### Fields
- `private int id` - Unique identifier for the uploaded design.
- `private Participant participant` - Reference to the participant.
- `private File file` - Uploaded design file.
- `private Date uploadedAt` - Timestamp of file submission.

### Methods
#### `public DesignUpload()`
**Description:** Default constructor that initializes design upload properties.

#### `public int getId()`
**Returns:** Unique identifier of the design upload.

#### `public Participant getParticipant()`
**Returns:** Associated participant.

#### `public File getFile()`
**Returns:** The uploaded design file.

#### `public Date getUploadedAt()`
**Returns:** Timestamp of when the file was uploaded.

---

## Class: `OpenAIIntegration`

### Description
Handles integration with OpenAI API for AI-generated feedback.

### Methods
#### `public static String generateFeedback(String inputText)`
**Description:** Sends user input to OpenAI API for analysis and returns AI-generated feedback.

#### **Parameters**
- `inputText (String)` - User-supplied textual input.

#### **Returns**
- `(String)` - AI-generated response based on input analysis.

#### **Exceptions**
- `ConnectionError` - Raised if OpenAI API is unreachable.
- `TimeoutError` - Raised if the request exceeds response time limits.
- `ValueError` - Raised if input text is empty or improperly formatted.

---

## Class: `APIErrorHandling`

### Description
Manages exception handling across the API to ensure robust error reporting.

### Methods
#### `public static String handleException(Exception e)`
**Description:** Provides a formatted error message for caught exceptions.

#### **Parameters**
- `e (Exception)` - Exception instance thrown by the system.

#### **Returns**
- `(String)` - A formatted error message for the API response.
