from rest_framework import serializers
from .models import Participant, DesignUpload, ChatMessage

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'participant_id', 'created_at']

class DesignUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignUpload
        fields = ['id', 'participant', 'image', 'feedback', 'created_at']
    def create(self, validated_data):
        return DesignUpload.objects.create(**validated_data)
    

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'participant', 'content', 'is_user', 'created_at']