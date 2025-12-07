import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Artwork from "../models/Artwork.js";
import {
  getArtworks,
  uploadArtwork,
  deleteArtwork,
  getPendingArtworks,
  approveArtwork,
  rejectArtwork,
  getApprovedArtworks,
  placeBid,
  finalizeAuction, // 👈 add controller function
} from "../controllers/artworkController.js";

const router = express.Router();

router.get("/all", getArtworks);
router.post("/", upload.single("image"), uploadArtwork);
router.delete("/:id", deleteArtwork);
router.get("/pending", getPendingArtworks);
router.put("/approve/:id", approveArtwork);
router.put("/reject/:id", rejectArtwork);
router.get("/", getApprovedArtworks);

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

// ✅ Use router.post instead of app.post
router.post("/finalize/:id", finalizeAuction);

export default router;
