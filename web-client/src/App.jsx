import { useEffect, useMemo, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API = "http://127.0.0.1:8000/api";
const AUTH = "Basic " + btoa("Sree345:123456");

export default function App() {
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadHistory(true);
  }, []);

  async function loadHistory(loadLatest = false) {
    setStatus("Loading...");
    const res = await fetch(`${API}/history/`, {
      headers: { Authorization: AUTH },
    });
    const data = await res.json();
    setHistory(data);
    setStatus("");

    if (loadLatest && data.length > 0) {
      loadStats(data[0].id);
    }
  }

  async function loadStats(id) {
    setActiveId(id);
    setStatus("Loading charts...");
    const res = await fetch(`${API}/stats/${id}/`, {
      headers: { Authorization: AUTH },
    });
    const data = await res.json();
    setSummary(data);
    setStatus("");
  }

  async function uploadCSV() {
    if (!file) return alert("Select a CSV file");

    const fd = new FormData();
    fd.append("file", file);

    setStatus("Uploading...");
    await fetch(`${API}/upload/`, {
      method: "POST",
      headers: { Authorization: AUTH },
      body: fd,
    });

    setFile(null);
    loadHistory(true);
  }

  // Normalize keys
  const dist =
    summary?.type_distribution ??
    summary?.typeDistribution ??
    {};

  const total =
    summary?.total_count ?? summary?.totalCount ?? 0;
  const avgFlow =
    summary?.avg_flowrate ?? summary?.avgFlowrate ?? 0;
  const avgPressure =
    summary?.avg_pressure ?? summary?.avgPressure ?? 0;
  const avgTemp =
    summary?.avg_temperature ?? summary?.avgTemperature ?? 0;

  const pieData = useMemo(() => ({
    labels: Object.keys(dist),
    datasets: [
      {
        data: Object.values(dist),
        backgroundColor: [
          "#4f46e5",
          "#22c55e",
          "#f97316",
          "#ef4444",
          "#06b6d4",
        ],
      },
    ],
  }), [dist]);

  const countBar = useMemo(() => ({
    labels: Object.keys(dist),
    datasets: [
      {
        label: "Count",
        data: Object.values(dist),
        backgroundColor: "#4f46e5",
      },
    ],
  }), [dist]);

  const avgBar = {
    labels: ["Flowrate", "Pressure", "Temperature"],
    datasets: [
      {
        label: "Average Values",
        data: [avgFlow, avgPressure, avgTemp],
        backgroundColor: ["#22c55e", "#f97316", "#ef4444"],
      },
    ],
  };

  const percentageBar = {
    labels: Object.keys(dist),
    datasets: [
      {
        label: "Percentage %",
        data: Object.values(dist).map(v => (v / total) * 100),
        backgroundColor: "#06b6d4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Chemical Equipment Parameter Visualizer</h1>
          <p style={styles.subtitle}>CSV upload • Analytics • Reports</p>
        </div>
        <div>
          <input type="file" accept=".csv"
            onChange={e => setFile(e.target.files[0])} />
          <button style={styles.btn} onClick={uploadCSV}>
            Upload CSV
          </button>
        </div>
      </header>

      {status && <div style={styles.status}>{status}</div>}

      <section style={styles.card}>
        <h3>Upload History (Last 5)</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded</th>
              <th>Total</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}
                onClick={() => loadStats(h.id)}
                style={{
                  cursor: "pointer",
                  background: h.id === activeId ? "#eef2ff" : "transparent",
                }}>
                <td>{h.filename}</td>
                <td>{String(h.uploaded_at)}</td>
                <td>{h.total_count}</td>
                <td>
                  <a href={`${API}/report/${h.id}/`} target="_blank">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {summary && (
        <>
          <section style={styles.summaryGrid}>
            <Summary label="Total Equipment" value={total} />
            <Summary label="Avg Flowrate" value={avgFlow.toFixed(2)} />
            <Summary label="Avg Pressure" value={avgPressure.toFixed(2)} />
            <Summary label="Avg Temperature" value={avgTemp.toFixed(2)} />
          </section>

          <section style={styles.grid}>
            <ChartCard title="Equipment Type Distribution">
              <Pie data={pieData} options={options} />
            </ChartCard>

            <ChartCard title="Equipment Count">
              <Bar data={countBar} options={options} />
            </ChartCard>

            <ChartCard title="Average Parameters">
              <Bar data={avgBar} options={options} />
            </ChartCard>

            <ChartCard title="Equipment Share (%)">
              <Bar data={percentageBar} options={{
                ...options,
                indexAxis: "y",
              }} />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div style={styles.summaryBox}>
      <div>{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <div style={{ height: 300 }}>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: 24,
    fontFamily: "Segoe UI",
  },
  header: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 28, margin: 0 },
  subtitle: { opacity: 0.7 },
  btn: {
    marginLeft: 10,
    padding: "8px 14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  status: {
    background: "#fff7ed",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {
    background: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 20,
  },
  summaryBox: {
    background: "#eef2ff",
    padding: 16,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
};