from django.urls import path
from .views import ParticipantView, DesignFeedbackView, ChatbotView, IdentifyThemeView, SummarizeView, ProcessDesignView



urlpatterns = [
    path('participant/', ParticipantView.as_view(), name='participant'),
    path('upload/', DesignFeedbackView.as_view(), name='design_feedback'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    # path('suggested-topics/', SuggestedTopicsView.as_view(), name='suggested_topics'),
    path('identify-theme/', IdentifyThemeView.as_view(), name='identify_theme'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('process-design/', ProcessDesignView.as_view(), name='process_design'),
    # path('highlight-terms/', HighlightTermsView.as_view(), name='highlight_terms'),
]