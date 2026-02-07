# Chemical Equipment Parameter Visualizer

A full-stack web application to upload, analyze, and visualize chemical equipment parameter data using interactive charts and downloadable PDF reports.

---

## Features

- Upload CSV files containing chemical equipment data
- Automatically computes:
  - Total equipment count
  - Average flowrate
  - Average pressure
  - Average temperature
- Dynamic data visualizations:
  - Equipment type distribution (Pie Chart)
  - Equipment count comparison (Bar Chart)
- Upload history tracking (last 5 datasets)
- Click any dataset to view its charts
- Download PDF reports for each dataset
- Secure API access using authentication

---

## Tech Stack

### Frontend
- React (Vite)
- Chart.js
- HTML, CSS, JavaScript

### Backend
- Django
- Django REST Framework
- Pandas (data analysis)
- ReportLab (PDF generation)

---

## Project Structure

