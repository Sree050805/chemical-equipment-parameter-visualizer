# Chemical Equipment Parameter Visualizer

A hybrid Web + Desktop application for visualizing chemical equipment data.

## Features
- **Web App**: React-based dashboard for easy access and visualization.
- **Desktop App**: PyQt5-based native client for desktop users.
- **Shared Backend**: Node.js/Express API with Postgres database.
- **Data Analysis**: CSV parsing, summary statistics, and charts.

## Structure
- `client/`: React Web Application code.
- `server/`: Node.js Backend API code.
- `shared/`: Shared TypeScript types for API contracts.
- `desktop/`: Python Desktop Application code.

## Web Application
The web application runs automatically in the Replit environment.
1. Click "Run" to start the server.
2. Open the Webview to access the app.
3. Register/Login to upload data and view charts.

## Desktop Application
The desktop application code is located in the `desktop/` folder. To run it locally:

1. **Install Python**: Ensure Python 3 is installed on your machine.
2. **Install Dependencies**:
   ```bash
   pip install -r desktop/requirements.txt
   ```
   (Note: You may need to install PyQt5 system libraries depending on your OS).

3. **Configure URL**:
   Open `desktop/main.py` and update the `API_BASE_URL` variable to point to your deployed Replit URL (e.g., `https://your-repl-name.replit.app`).
   Default is `http://localhost:5000` for local testing if you run the backend locally.

4. **Run App**:
   ```bash
   python desktop/main.py
   ```

## Tech Stack
- **Web**: React, Recharts, Tailwind CSS.
- **Desktop**: Python, PyQt5, Matplotlib, Requests.
- **Backend**: Node.js, Express, Drizzle ORM, Postgres.
