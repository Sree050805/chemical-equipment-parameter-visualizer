from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from reportlab.pdfgen import canvas
import pandas as pd
from datetime import datetime

from .models import Dataset


class UploadCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        # Read CSV
        df = pd.read_csv(file)

        # ✅ Create unique filename INSIDE the method
        unique_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.name}"

        # Analytics
        total_count = len(df)
        avg_flowrate = df["Flowrate"].mean()
        avg_pressure = df["Pressure"].mean()
        avg_temperature = df["Temperature"].mean()
        type_distribution = df["Type"].value_counts().to_dict()

        Dataset.objects.create(
            filename=unique_name,
            total_count=total_count,
            avg_flowrate=avg_flowrate,
            avg_pressure=avg_pressure,
            avg_temperature=avg_temperature,
            type_distribution=type_distribution
        )

        # Keep only last 5 datasets
        if Dataset.objects.count() > 5:
            Dataset.objects.order_by("uploaded_at").first().delete()

        return Response({
            "total_count": total_count,
            "avg_flowrate": avg_flowrate,
            "avg_pressure": avg_pressure,
            "avg_temperature": avg_temperature,
            "type_distribution": type_distribution
        })


class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        datasets = Dataset.objects.order_by("-uploaded_at")[:5]
        return Response([
            {
                "id": d.id,
                "filename": d.filename,
                "uploaded_at": d.uploaded_at,
                "total_count": d.total_count
            }
            for d in datasets
        ])


class PDFReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        dataset = Dataset.objects.get(id=pk)

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = "attachment; filename=report.pdf"

        p = canvas.Canvas(response)
        p.drawString(50, 800, "Chemical Equipment Analysis Report")
        p.drawString(50, 770, f"Filename: {dataset.filename}")
        p.drawString(50, 740, f"Total Count: {dataset.total_count}")
        p.drawString(50, 710, f"Avg Flowrate: {dataset.avg_flowrate}")
        p.drawString(50, 680, f"Avg Pressure: {dataset.avg_pressure}")
        p.drawString(50, 650, f"Avg Temperature: {dataset.avg_temperature}")
        p.drawString(50, 620, f"Type Distribution: {dataset.type_distribution}")
        p.showPage()
        p.save()

        return response
class DatasetStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        dataset = Dataset.objects.get(id=pk)
        return Response({
            "total_count": dataset.total_count,
            "avg_flowrate": dataset.avg_flowrate,
            "avg_pressure": dataset.avg_pressure,
            "avg_temperature": dataset.avg_temperature,
            "type_distribution": dataset.type_distribution
        })

