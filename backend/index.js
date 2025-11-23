import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import artworkRoutes from "./routes/artworkRoutes.js";
import artistRoutes from "./routes/artistRoutes.js"
import buyerRoutes from "./routes/buyerRoutes.js"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // ✅ Load environment variables FIRST
connectDB();     // ✅ Connect after dotenv is loaded

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/artworks", artworkRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/buyers", buyerRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("🎨 ArtVault API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
