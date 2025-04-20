from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('feedback_app.urls')),

    #re_path(r'^(?!api/).*$', TemplateView.as_view(template_name="index.html")),
]

# Serve static files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    if os.path.exists(settings.STATIC_ROOT):
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) #NEW

urlpatterns += [
    re_path(r'^(?!media/|static/|api/).*$', TemplateView.as_view(template_name="index.html")),
]