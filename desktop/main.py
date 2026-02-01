import sys
import requests
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QLineEdit, QPushButton, 
                             QTabWidget, QTableWidget, QTableWidgetItem, 
                             QFileDialog, QMessageBox, QHeaderView, QDialog)
from PyQt5.QtCore import Qt

# Configuration
API_BASE_URL = "http://localhost:5000"  # Change this to your Replit URL after publishing

class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Login - Chemical Equipment Visualizer")
        self.setGeometry(300, 300, 300, 200)
        
        layout = QVBoxLayout()
        
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        layout.addWidget(self.username_input)
        
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password_input)
        
        self.login_btn = QPushButton("Login")
        self.login_btn.clicked.connect(self.handle_login)
        layout.addWidget(self.login_btn)
        
        self.register_btn = QPushButton("Register")
        self.register_btn.clicked.connect(self.handle_register)
        layout.addWidget(self.register_btn)
        
        self.status_label = QLabel("")
        layout.addWidget(self.status_label)
        
        self.setLayout(layout)
        self.session = requests.Session()

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()
        
        try:
            response = self.session.post(f"{API_BASE_URL}/api/login", json={
                "username": username,
                "password": password
            })
            
            if response.status_code == 200:
                self.open_main_window()
            else:
                self.status_label.setText("Login failed: " + response.text)
        except Exception as e:
            self.status_label.setText(f"Error: {str(e)}")

    def handle_register(self):
        username = self.username_input.text()
        password = self.password_input.text()
        
        try:
            response = self.session.post(f"{API_BASE_URL}/api/register", json={
                "username": username,
                "password": password
            })
            
            if response.status_code == 201:
                self.status_label.setText("Registered! Please login.")
            else:
                self.status_label.setText("Registration failed: " + response.text)
        except Exception as e:
            self.status_label.setText(f"Error: {str(e)}")

    def open_main_window(self):
        self.main_window = MainWindow(self.session)
        self.main_window.show()
        self.close()

class MainWindow(QMainWindow):
    def __init__(self, session):
        super().__init__()
        self.session = session
        self.setWindowTitle("Chemical Equipment Visualizer")
        self.setGeometry(100, 100, 1000, 700)
        
        self.tabs = QTabWidget()
        self.setCentralWidget(self.tabs)
        
        self.upload_tab = UploadTab(self.session)
        self.history_tab = HistoryTab(self.session)
        
        self.tabs.addTab(self.upload_tab, "Upload Data")
        self.tabs.addTab(self.history_tab, "History")
        
        self.tabs.currentChanged.connect(self.on_tab_change)

    def on_tab_change(self, index):
        if index == 1:
            self.history_tab.refresh_data()

class UploadTab(QWidget):
    def __init__(self, session):
        super().__init__()
        self.session = session
        layout = QVBoxLayout()
        
        self.label = QLabel("Select a CSV file to upload")
        layout.addWidget(self.label)
        
        self.upload_btn = QPushButton("Choose File")
        self.upload_btn.clicked.connect(self.upload_file)
        layout.addWidget(self.upload_btn)
        
        self.status_label = QLabel("")
        layout.addWidget(self.status_label)
        
        self.setLayout(layout)

    def upload_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if file_path:
            files = {'file': open(file_path, 'rb')}
            try:
                response = self.session.post(f"{API_BASE_URL}/api/datasets/upload", files=files)
                if response.status_code == 201:
                    self.status_label.setText("Upload Successful!")
                else:
                    self.status_label.setText("Upload Failed: " + response.text)
            except Exception as e:
                self.status_label.setText(f"Error: {str(e)}")

class HistoryTab(QWidget):
    def __init__(self, session):
        super().__init__()
        self.session = session
        layout = QVBoxLayout()
        
        self.refresh_btn = QPushButton("Refresh List")
        self.refresh_btn.clicked.connect(self.refresh_data)
        layout.addWidget(self.refresh_btn)
        
        self.table = QTableWidget()
        self.table.setColumnCount(3)
        self.table.setHorizontalHeaderLabels(["ID", "Filename", "Date"])
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.table.doubleClicked.connect(self.open_details)
        layout.addWidget(self.table)
        
        self.setLayout(layout)

    def refresh_data(self):
        try:
            response = self.session.get(f"{API_BASE_URL}/api/datasets")
            if response.status_code == 200:
                datasets = response.json()
                self.table.setRowCount(len(datasets))
                for i, data in enumerate(datasets):
                    self.table.setItem(i, 0, QTableWidgetItem(str(data['id'])))
                    self.table.setItem(i, 1, QTableWidgetItem(data['filename']))
                    self.table.setItem(i, 2, QTableWidgetItem(data['createdAt']))
            else:
                QMessageBox.warning(self, "Error", "Failed to fetch history")
        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))

    def open_details(self, index):
        row = index.row()
        dataset_id = self.table.item(row, 0).text()
        self.details_window = DetailsWindow(self.session, dataset_id)
        self.details_window.show()

class DetailsWindow(QDialog):
    def __init__(self, session, dataset_id):
        super().__init__()
        self.session = session
        self.dataset_id = dataset_id
        self.setWindowTitle(f"Dataset Details - ID {dataset_id}")
        self.setGeometry(150, 150, 800, 600)
        
        layout = QVBoxLayout()
        
        # Stats
        self.stats_label = QLabel("Loading stats...")
        layout.addWidget(self.stats_label)
        
        # Charts Area
        self.figure = plt.figure(figsize=(8, 4))
        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)
        
        self.setLayout(layout)
        self.load_data()

    def load_data(self):
        try:
            # Get Stats
            stats_res = self.session.get(f"{API_BASE_URL}/api/datasets/{self.dataset_id}/stats")
            # Get Equipment Data
            equip_res = self.session.get(f"{API_BASE_URL}/api/datasets/{self.dataset_id}/equipment")
            
            if stats_res.status_code == 200 and equip_res.status_code == 200:
                stats = stats_res.json()
                data = equip_res.json()
                
                # Update Label
                self.stats_label.setText(
                    f"Total: {stats['totalCount']} | "
                    f"Avg Flowrate: {stats['avgFlowrate']:.2f} | "
                    f"Avg Pressure: {stats['avgPressure']:.2f} | "
                    f"Avg Temp: {stats['avgTemperature']:.2f}"
                )
                
                # Plot Charts
                self.figure.clear()
                
                # Subplot 1: Distribution
                ax1 = self.figure.add_subplot(121)
                dist = stats['typeDistribution']
                ax1.pie(dist.values(), labels=dist.keys(), autopct='%1.1f%%')
                ax1.set_title("Equipment Types")
                
                # Subplot 2: Scatter Flow vs Pressure
                ax2 = self.figure.add_subplot(122)
                flows = [d['flowrate'] for d in data]
                pressures = [d['pressure'] for d in data]
                ax2.scatter(flows, pressures, alpha=0.5)
                ax2.set_xlabel("Flowrate")
                ax2.set_ylabel("Pressure")
                ax2.set_title("Flow vs Pressure")
                
                self.canvas.draw()
                
            else:
                self.stats_label.setText("Failed to load data")
                
        except Exception as e:
            self.stats_label.setText(f"Error: {str(e)}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = LoginWindow()
    window.show()
    sys.exit(app.exec_())
