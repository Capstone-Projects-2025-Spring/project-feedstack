---
sidebar_position: 5
---

# Use-case descriptions

## Use Case 1: Creating an Account
:bust_in_silhouette: **Actor:** User  
:zap: **Triggering Event:** A user wants to create an account to save their design feedback and track progress.

### Normal Flow:
1. The user accesses the Feedstack web application
2. The user clicks on 'Register' to open the account creation form
3. The user enters required details (email, username, password)
4. The system validates the input
5. If valid, the system creates an account and displays a success message

### Alternate Flows:
- :warning: **Invalid email format:** System prompts the user to enter a valid email
- :warning: **Password too weak:** System prompts the user to enter a stronger password
- :warning: **Email already registered:** System suggests logging in instead

## Use Case 2: Signing In  
:bust_in_silhouette: **Actor:** User  
:zap: **Triggering Event:** A user wants to log in to access their saved designs and feedback

### Normal Flow:
1. The user clicks on 'Login'
2. The user enters valid credentials (email and password)
3. The system authenticates the credentials
4. Upon success, the user is redirected to the dashboard

### Alternate Flows:
- :warning: **Incorrect credentials:** System displays an error message
- :warning: **Forgot password:** System provides a reset password option

## Use Case 3: Uploading a Design for Feedback
:art: **Actor:** Designer  
:zap: **Triggering Event:** A designer wants to upload a design for AI-generated feedback

### Normal Flow:
1. The user logs in and clicks 'Upload Design'
2. The user selects a file (PNG, JPG, PDF) and submits it
3. The system validates and processes the file
4. AI-generated feedback is displayed under categorized themes

### Alternate Flows:
- :warning: **Unsupported file format:** System notifies the user and suggests accepted formats
- :warning: **File size too large:** System prompts user to upload a smaller file
- :warning: **Upload failure due to network issue:** System prompts the user to retry

## Use Case 4: Navigating Feedback Using Bookmarks
:bust_in_silhouette: **Actor:** User  
:zap: **Triggering Event:** A user wants to bookmark specific feedback insights for quick access

### Normal Flow:
1. The user reviews AI-generated feedback in the theme-based accordions
2. The user bookmarks specific insights
3. Clicking the bookmark navigates the user to the relevant section

### Alternate Flows:
- :warning: **No bookmarks set:** System suggests key themes based on user history
- :warning: **Bookmark deleted by mistake:** System provides an undo option

# User Stories & Scenarios

## User Story 1: Uploading a Design
:clipboard: **As a designer, I want to upload my design so that I can receive AI-generated feedback on accessibility and usability.**

### Scenario 1 (Successful Upload)
- :white_check_mark: Given that I am logged in
- :arrow_right: When I upload a valid image
- :tada: Then the system should generate categorized feedback

### Scenario 2 (Invalid File Format)
- :white_check_mark: Given that I am logged in
- :arrow_right: When I upload an unsupported file format
- :x: Then the system should show an error message

## User Story 2: Bookmarking Feedback
:clipboard: **As a user, I want to bookmark specific feedback so that I can reference it later.**

### Scenario 1 (Bookmarking Feedback Successfully)
- :white_check_mark: Given that I am viewing my feedback
- :arrow_right: When I select a feedback item to bookmark
- :bookmark: Then it should be saved in my bookmarks section

### Scenario 2 (No Bookmarks Available)
- :white_check_mark: Given that I have not bookmarked anything
- :arrow_right: When I visit the bookmarks section
- :bulb: Then the system should suggest key themes based on my history
