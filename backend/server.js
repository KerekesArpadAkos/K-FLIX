import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import { CONFIG } from './config.js';

const app = express();

// CORS Configuration to allow requests from your frontend
app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

app.use(bodyParser.json());

// Default route for root URL
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Routes
app.use("/api/auth", authRoutes);

// Starting the server
const PORT = CONFIG.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} : http://localhost:${PORT}`);
});
