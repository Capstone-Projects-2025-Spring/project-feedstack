---
sidebar_position: 5
---

# Use-case descriptions
# Use Cases for Feedstack

##  Use Case 1 - Creating an Account

**As a user, I want to create an account to maintain my design feedback history and project progress.**

### Steps:
1. The user accesses the Feedstack web application.
2. The user clicks on **'Register'** to open the account creation form.
3. The user fills out the required fields (email, username, password).
4. After submitting, the system validates the data and creates the account.
5. A success message confirms account creation.

---

##  Use Case 2 - Signing In

**As a user, I want to log into my account to access my saved designs and feedback.**

### Steps:
1. The user clicks on the **'Login'** button.
2. The user enters valid credentials (email and password).
3. Upon successful authentication, the user is redirected to the dashboard.
4. If credentials are invalid, an error message is displayed.

---

##  Use Case 3 - Uploading a Design for Feedback

**As a designer, I want to upload my design to receive AI-generated feedback on accessibility and usability.**

### Steps:
1. The user logs in and clicks **'Upload Design'**.
2. The user selects a file (**PNG, JPG, PDF**) and submits it.
3. The system validates and processes the file.
4. Feedback is generated using **GPT-4 Vision** and displayed in categorized themes.


## Use Case 4 - Navigating Feedback Using Bookmarks

**As a user, I want to bookmark specific feedback insights to quickly reference them later.**

### Triggering Event:
- A user wishes to reference specific feedback quickly.

### Normal Flow:
1. The user reviews AI-generated feedback in the theme-based accordions.
2. The user bookmarks specific insights.
3. Clicking the bookmark navigates the user to the relevant section.

### Alternate Flow:
- If no bookmarks are set, the system suggests key themes based on user history.

