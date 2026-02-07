from django.contrib import admin
from .models import Dataset

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = (
        'filename',
        'uploaded_at',
        'total_count',
        'avg_flowrate',
        'avg_pressure',
        'avg_temperature'
    )
