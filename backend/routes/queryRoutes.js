import express from "express";
import Artwork from "../models/Artwork.js";
import Artist from "../models/artistModel.js";
import Buyer from "../models/buyerModel.js";

const router = express.Router();

// =========================
//       QUERY HANDLER
// =========================
router.post("/run", async (req, res) => {
    const { queryId } = req.body;

    try {
        switch (queryId) {
            // 1️⃣ List artworks sold above ₹1 lakh.
            case 1:
                return res.json(await Artwork.find({ soldStatus: "sold", highestBid: { $gt: 100000 } }));

            // 2️⃣ Find artists whose works were unsold.
            case 2: {
                const unsoldArtworks = await Artwork.find({ soldStatus: "unsold" }).distinct("artistName");
                return res.json(unsoldArtworks);
            }

            // 3️⃣ Show bidders who won multiple auctions.
            case 3: {
                const winners = await Artwork.aggregate([
                    { $match: { soldStatus: "sold" } },
                    {
                        $group: {
                            _id: "$bids.user",
                            wins: { $sum: 1 }
                        }
                    },
                    { $match: { wins: { $gt: 1 } } }
                ]);
                return res.json(winners);
            }

            // 4️⃣ Calculate average bid per artwork.
            case 4: {
                const avg = await Artwork.aggregate([
                    { $unwind: "$bids" },
                    {
                        $group: {
                            _id: "$title",
                            averageBid: { $avg: "$bids.amount" }
                        }
                    }
                ]);
                return res.json(avg);
            }

            // 5️⃣ Artworks bid on by 5+ users.
            case 5:
                return res.json(
                    await Artwork.aggregate([
                        { $project: { title: 1, uniqueUsers: { $size: "$bids" } } },
                        { $match: { uniqueUsers: { $gte: 5 } } }
                    ])
                );

            // 6️⃣ Highest bid artwork in each category.
            case 6:
                return res.json(await Artwork.aggregate([
                    { $sort: { highestBid: -1 } },
                    {
                        $group: {
                            _id: "$category",
                            artwork: { $first: "$title" },
                            highestBid: { $first: "$highestBid" }
                        }
                    }
                ]));

            // 7️⃣ Auctions where no bids were placed.
            case 7:
                return res.json(await Artwork.find({ bids: { $size: 0 } }));

            // 8️⃣ Artists featured in multiple auctions.
            case 8:
                return res.json(await Artwork.aggregate([
                    {
                        $group: {
                            _id: "$artistName",
                            count: { $sum: 1 }
                        }
                    },
                    { $match: { count: { $gt: 1 } } }
                ]));

            // 9️⃣ Top 3 bidders by total spend.
            case 9:
                return res.json(await Artwork.aggregate([
                    { $match: { soldStatus: "sold" } },
                    {
                        $group: {
                            _id: "$bids.user",
                            totalSpend: { $sum: "$highestBid" }
                        }
                    },
                    { $sort: { totalSpend: -1 } },
                    { $limit: 3 }
                ]));

            // 🔟 Categories with most artworks.
            case 10:
                return res.json(await Artwork.aggregate([
                    { $group: { _id: "$category", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]));

            default:
                return res.status(400).json({ message: "Invalid Query ID" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
