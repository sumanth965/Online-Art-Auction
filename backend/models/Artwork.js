import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: true,
  },
  title: String,
  category: String,
  basePrice: Number,
  description: String,
  image: String,


  soldStatus: {
    type: String,
    enum: ["sold", "unsold"],
    default: "unsold",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // 🟡 Bidding Fields
  highestBid: {
    type: Number,
    default: 0,
  },

  bids: [
    {
      amount: Number,
      user: { type: String }, // Later can change to userId reference
      timestamp: { type: Date, default: Date.now }
    }
  ],

  // ⭐ Ratings & Reviews
  averageRating: {
    type: Number,
    default: 0,
  },

  ratings: [
    {
      user: { type: String }, // or ObjectId
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now },
});

const Artwork = mongoose.model("Artwork", artworkSchema);
export default Artwork;


