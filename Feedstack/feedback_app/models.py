from django.db import models

class Participant(models.Model):
    participant_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.participant_id

class DesignUpload(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/')
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Design by {self.participant.participant_id} at {self.created_at}"

class ChatMessage(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    content = models.TextField()
    is_user = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'User' if self.is_user else 'Bot'} message for {self.participant.participant_id}"