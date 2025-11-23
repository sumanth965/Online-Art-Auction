import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getArtworks,
  uploadArtwork,
  deleteArtwork,
  getPendingArtworks,
  approveArtwork,
  rejectArtwork,getApprovedArtworks,
} from "../controllers/artworkController.js";

const router = express.Router();

router.get("/", getArtworks);
router.post("/", upload.single("image"), uploadArtwork);
router.delete("/:id", deleteArtwork);
router.get("/pending", getPendingArtworks);
router.put("/approve/:id", approveArtwork);
router.put("/reject/:id", rejectArtwork);
router.get("/", getApprovedArtworks);


export default router;
