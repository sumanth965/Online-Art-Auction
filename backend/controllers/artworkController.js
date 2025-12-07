import Artwork from "../models/Artwork.js";

// Get all artworks
export const getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload artwork
export const uploadArtwork = async (req, res) => {
  try {
    const { title, category, basePrice, description } = req.body;

    const newArt = new Artwork({
      title,
      category,
      basePrice,
      description,
      image: req.file?.filename || null,
    });

    await newArt.save();
    res.status(201).json({ message: "Artwork uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete artwork
export const deleteArtwork = async (req, res) => {
  try {
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve Artwork
export const approveArtwork = async (req, res) => {
  try {
    await Artwork.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ success: true, message: "Artwork approved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Reject Artwork
export const rejectArtwork = async (req, res) => {
  try {
    await Artwork.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ success: true, message: "Artwork rejected" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Pending Artworks
export const getPendingArtworks = async (req, res) => {
  try {
    const pending = await Artwork.find({ status: "pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getApprovedArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ status: "approved" });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { amount, user } = req.body;
    const art = await Artwork.findById(req.params.id);

    if (!art) return res.status(404).json({ message: "Artwork not found" });

    if (amount <= art.highestBid || amount <= art.basePrice) {
      return res.status(400).json({ message: "Bid must be higher than current bid" });
    }

    art.bids.push({ amount, user });
    art.highestBid = amount;

    await art.save();
    res.json({ message: "Bid placed successfully", highestBid: art.highestBid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const finalizeAuction = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    artwork.sold = true;
    artwork.winner = req.body.winner || null;
    artwork.finalPrice = req.body.highestBid || artwork.basePrice;

    await artwork.save();
    res.json({ message: `Auction ended. Winner: ${artwork.winner}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
