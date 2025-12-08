import express from "express";
import Artwork from "../models/Artwork.js";

const router = express.Router();

router.post("/run", async (req, res) => {
    const { queryId } = req.body;

    try {
        switch (queryId) {

            /* ============================
               1. Artworks sold above ₹1L
            ============================ */
            case 1:
                return res.json(
                    await Artwork.find(
                        { soldStatus: "sold", highestBid: { $gt: 100000 } },
                        { _id: 0, title: 1, category: 1, artistName: 1, highestBid: 1 }
                    )
                );

            /* ============================
               2. Artists with unsold works
            ============================ */
            case 2:
                return res.json(
                    await Artwork.aggregate([
                        { $match: { soldStatus: "unsold" } },
                        { $group: { _id: "$artistName" } },
                        { $project: { _id: 0, artist: "$_id" } }
                    ])
                );

            /* ============================
               3. Bidders who won multiple auctions
            ============================ */
            case 3:
                return res.json(
                    await Artwork.aggregate([
                        { $match: { soldStatus: "sold" } },
                        {
                            $group: {
                                _id: "$bids.user",
                                auctionsWon: { $sum: 1 }
                            }
                        },
                        { $match: { auctionsWon: { $gt: 1 } } },
                        {
                            $project: {
                                _id: 0,
                                bidder: "$_id",
                                auctionsWon: 1
                            }
                        }
                    ])
                );

            /* ============================
               4. Average bid per artwork
            ============================ */
            case 4:
                return res.json(
                    await Artwork.aggregate([
                        { $unwind: "$bids" },
                        {
                            $group: {
                                _id: "$title",
                                averageBid: { $avg: "$bids.amount" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                artwork: "$_id",
                                averageBid: { $round: ["$averageBid", 2] }
                            }
                        }
                    ])
                );

            /* ============================
               5. Artworks bid by 5+ users
            ============================ */
            case 5:
                return res.json(
                    await Artwork.aggregate([
                        {
                            $project: {
                                title: 1,
                                biddersCount: {
                                    $size: { $ifNull: ["$bids", []] }
                                }
                            }
                        },
                        { $match: { biddersCount: { $gte: 5 } } },
                        { $project: { _id: 0, title: 1, biddersCount: 1 } }
                    ])
                );

            /* ============================
               6. Highest bid artwork per category
            ============================ */
            case 6:
                return res.json(
                    await Artwork.aggregate([
                        { $sort: { highestBid: -1 } },
                        {
                            $group: {
                                _id: "$category",
                                artwork: { $first: "$title" },
                                highestBid: { $first: "$highestBid" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                category: "$_id",
                                artwork: 1,
                                highestBid: 1
                            }
                        }
                    ])
                );

            /* ============================
               7. Auctions with no bids
            ============================ */
            case 7:
                return res.json(
                    await Artwork.find(
                        { bids: { $size: 0 } },
                        { _id: 0, title: 1, category: 1, artistName: 1 }
                    )
                );

            /* ============================
               8. Artists in multiple auctions
            ============================ */
            case 8:
                return res.json(
                    await Artwork.aggregate([
                        {
                            $group: {
                                _id: "$artistName",
                                totalArtworks: { $sum: 1 }
                            }
                        },
                        { $match: { totalArtworks: { $gt: 1 } } },
                        {
                            $project: {
                                _id: 0,
                                artist: "$_id",
                                totalArtworks: 1
                            }
                        }
                    ])
                );

            /* ============================
               9. Top 3 bidders by total spend
            ============================ */
            case 9:
                return res.json(
                    await Artwork.aggregate([
                        { $match: { soldStatus: "sold" } },
                        {
                            $group: {
                                _id: "$bids.user",
                                totalSpend: { $sum: "$highestBid" }
                            }
                        },
                        { $sort: { totalSpend: -1 } },
                        { $limit: 3 },
                        {
                            $project: {
                                _id: 0,
                                bidder: "$_id",
                                totalSpend: 1
                            }
                        }
                    ])
                );

            /* ============================
               10. Categories with most artworks
            ============================ */
            case 10:
                return res.json(
                    await Artwork.aggregate([
                        {
                            $group: {
                                _id: "$category",
                                artworksCount: { $sum: 1 }
                            }
                        },
                        { $sort: { artworksCount: -1 } },
                        {
                            $project: {
                                _id: 0,
                                category: "$_id",
                                artworksCount: 1
                            }
                        }
                    ])
                );

            default:
                return res.status(400).json({ message: "Invalid Query ID" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
