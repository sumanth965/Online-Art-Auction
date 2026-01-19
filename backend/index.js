import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import artworkRoutes from "./routes/artworkRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Load env first
dotenv.config();

// Connect DB
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// ✅ CORS CONFIG (FIXED)
// ======================
app.use(
    cors({
        origin: [
            "https://online-art-auction.vercel.app",
            "https://online-art-auction.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/artworks", artworkRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/queries", queryRoutes);

// Health check (IMPORTANT)
app.get("/", (req, res) => {
    res.status(200).send("🎨 ArtVault API Running...");
});

// ======================
// ✅ RENDER SAFE LISTENER
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
