import sys
import requests
import matplotlib.pyplot as plt

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QPushButton, QLabel, QFileDialog, QTableWidget,
    QTableWidgetItem, QHeaderView, QMessageBox, QTabWidget
)
from PyQt5.QtCore import Qt


# ================= CONFIG =================
API_BASE_URL = "http://127.0.0.1:8000"
USERNAME = "Sree345"
PASSWORD = "123456"
# =========================================


class UploadTab(QWidget):
    def __init__(self, session):
        super().__init__()
        self.session = session

        layout = QVBoxLayout()

        self.label = QLabel("Upload Chemical Equipment CSV")
        self.label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.label)

        self.upload_btn = QPushButton("Choose CSV File")
        self.upload_btn.clicked.connect(self.upload_file)
        layout.addWidget(self.upload_btn)

        self.status_label = QLabel("")
        self.status_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.status_label)

        self.setLayout(layout)

    def upload_file(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select CSV File", "", "CSV Files (*.csv)"
        )

        if not file_path:
            return

        try:
            with open(file_path, "rb") as f:
                response = self.session.post(
                    f"{API_BASE_URL}/api/upload/",
                    files={"file": f}
                )

            if response.status_code != 200:
                QMessageBox.critical(self, "Error", response.text)
                return

            data = response.json()
            self.status_label.setText("Upload Successful!")

            # -------- MATPLOTLIB CHART --------
            types = data["type_distribution"]

            plt.figure()
            plt.bar(types.keys(), types.values())
            plt.title("Equipment Type Distribution")
            plt.xlabel("Equipment Type")
            plt.ylabel("Count")
            plt.xticks(rotation=30)
            plt.tight_layout()
            plt.show()

        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))


class HistoryTab(QWidget):
    def __init__(self, session):
        super().__init__()
        self.session = session

        layout = QVBoxLayout()

        self.refresh_btn = QPushButton("Refresh History")
        self.refresh_btn.clicked.connect(self.refresh_data)
        layout.addWidget(self.refresh_btn)

        self.table = QTableWidget()
        self.table.setColumnCount(3)
        self.table.setHorizontalHeaderLabels(
            ["Filename", "Uploaded At", "Total Count"]
        )
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        layout.addWidget(self.table)

        self.pdf_btn = QPushButton("Download PDF Report (Latest)")
        self.pdf_btn.clicked.connect(self.download_pdf)
        layout.addWidget(self.pdf_btn)

        self.setLayout(layout)
        self.refresh_data()

    def refresh_data(self):
        try:
            response = self.session.get(f"{API_BASE_URL}/api/history/")
            if response.status_code != 200:
                QMessageBox.warning(self, "Error", "Failed to load history")
                return

            datasets = response.json()
            self.table.setRowCount(len(datasets))

            for i, d in enumerate(datasets):
                self.table.setItem(i, 0, QTableWidgetItem(d["filename"]))
                self.table.setItem(i, 1, QTableWidgetItem(d["uploaded_at"]))
                self.table.setItem(i, 2, QTableWidgetItem(str(d["total_count"])))

        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))

    def download_pdf(self):
        try:
            # Download PDF of MOST RECENT dataset (id = 1 is fine for demo)
            import webbrowser
            webbrowser.open(f"{API_BASE_URL}/api/report/1/")
        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))


class MainWindow(QMainWindow):
    def __init__(self, session):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Parameter Visualizer")
        self.setGeometry(100, 100, 900, 600)

        tabs = QTabWidget()
        tabs.addTab(UploadTab(session), "Upload Data")
        tabs.addTab(HistoryTab(session), "History")

        self.setCentralWidget(tabs)


# ================= APP ENTRY =================
if __name__ == "__main__":
    app = QApplication(sys.argv)

    session = requests.Session()
    session.auth = (USERNAME, PASSWORD)

    window = MainWindow(session)
    window.show()

    sys.exit(app.exec_())
