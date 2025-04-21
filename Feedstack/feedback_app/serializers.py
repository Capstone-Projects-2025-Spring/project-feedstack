from rest_framework import serializers
from .models import Participant, DesignUpload, ChatMessage

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class DesignUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignUpload
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'