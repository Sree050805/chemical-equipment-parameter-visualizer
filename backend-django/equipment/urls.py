from django.urls import path
from .views import UploadCSVView, HistoryView, PDFReportView, DatasetStatsView

urlpatterns = [
    path("upload/", UploadCSVView.as_view()),
    path("history/", HistoryView.as_view()),
    path("report/<int:pk>/", PDFReportView.as_view()),
    path("stats/<int:pk>/", DatasetStatsView.as_view()),
]
