const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const boardRoutes = require("./routes/boardRoutes");
const columnRoutes = require("./routes/columnRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Kanban API is running" });
});

app.use("/api/boards", boardRoutes);
app.use("/api", columnRoutes);
app.use("/api", taskRoutes);

// Serve frontend static files when running full app from backend
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
