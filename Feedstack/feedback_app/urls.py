from django.urls import path
from .views import ParticipantView, DesignFeedbackView, ChatbotView, IdentifyThemeView, SummarizeView, GenerateSuggestionsView
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def test_endpoint(request):
    return Response({"message": "API is working!"})
urlpatterns = [
    path('participant/', ParticipantView.as_view(), name='participant'),
    path('upload/', DesignFeedbackView.as_view(), name='design_feedback'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    # path('suggested-topics/', SuggestedTopicsView.as_view(), name='suggested_topics'),
    path('identify-theme/', IdentifyThemeView.as_view(), name='identify_theme'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('generate-suggestions/', GenerateSuggestionsView.as_view(), name='generate-suggestions'),
    # path('highlight-terms/', HighlightTermsView.as_view(), name='highlight_terms'),
    path('test/', test_endpoint, name='test_endpoint'),
    
]