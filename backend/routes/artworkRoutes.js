import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Artwork from "../models/Artwork.js";   // <--- ADD THIS IMPORT

import {
  getArtworks,
  uploadArtwork,
  deleteArtwork,
  getPendingArtworks,
  approveArtwork,
  rejectArtwork,
  getApprovedArtworks,
  placeBid,
} from "../controllers/artworkController.js";

const router = express.Router();

router.get("/all", getArtworks);
router.post("/", upload.single("image"), uploadArtwork);
router.delete("/:id", deleteArtwork);
router.get("/pending", getPendingArtworks);
router.put("/approve/:id", approveArtwork);
router.put("/reject/:id", rejectArtwork);
router.get("/", getApprovedArtworks);

// ⭐ SINGLE ARTWORK ROUTE
router.get("/:id", async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });
    res.json(art);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/bid/:id", placeBid);

export default router;
