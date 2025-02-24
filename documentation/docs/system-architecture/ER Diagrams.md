---
sidebar_position: 8
---

## Database Design and Entity Relationship Diagrams 
![diagram-7](https://github.com/user-attachments/assets/f0f789e2-c525-475d-9650-d301cfc34ac8)
Feedstack's database structure is designed to streamline user interactions, design uploads, and AI-driven feedback. Users can upload their designs, which are stored in the DESIGNUPLOADS table, linking each design to its uploader. Feedback on these designs is captured in the FEEDBACK table, allowing users to provide comments and ratings. To enhance organization, feedback is categorized under predefined THEMECATEGORIES, ensuring insights align with key visual design principles. Additionally, KEYWORDS help analyze and relate uploaded designs to relevant themes. This setup keeps everything structured, making it easy to track, categorize, and improve design feedback.

# Database Structure

- **Users (`USERS`)**: Stores user accounts and tracks uploads.
- **Design Uploads (`DESIGNUPLOADS`)**: Holds uploaded designs linked to users.
- **Feedback (`FEEDBACK`)**: Stores comments and ratings for designs.
- **Theme Categories (`THEMECATEGORIES`)**: Groups feedback under visual design  themes.
- **Keywords (`KEYWORDS`)**: Helps categorize and relate designs.