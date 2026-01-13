import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Heart, Share2, AlertCircle, CheckCircle, Clock, User, Gavel } from "lucide-react";

const ArtworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userType, isLoggedIn, userData } = useAuth();

    const [art, setArt] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bidHistory, setBidHistory] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [loading, setLoading] = useState(true);
    const [bidding, setBidding] = useState(false);
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [auctionEndTime, setAuctionEndTime] = useState(null);
    const [auctionFinalized, setAuctionFinalized] = useState(false);
    // Fetch artwork
    // inside fetchArt
    const fetchArt = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
            setArt(res.data);
            setBidHistory(res.data.bids || []);

            // Check localStorage first
            const storedEndTime = localStorage.getItem(`auctionEndTime_${id}`);
            if (storedEndTime) {
                setAuctionEndTime(new Date(storedEndTime));
            } else {
                const endTime = new Date(Date.now() + 60 * 60 * 1000); // +1 hour
                setAuctionEndTime(endTime);
                localStorage.setItem(`auctionEndTime_${id}`, endTime.toISOString());
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load artwork");
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchArt();
    }, [id]);

    // Countdown timer
    useEffect(() => {
        if (!auctionEndTime || auctionFinalized) return;

        const updateTime = async () => {
            const now = new Date();
            const diff = auctionEndTime - now;

            if (diff <= 0) {
                setTimeLeft("Auction Ended");
                setAuctionEnded(true);

                if (!auctionFinalized) {
                    setAuctionFinalized(true);

                    try {
                        // Send request to server to finalize auction
                        const res = await axios.post(`http://localhost:5000/api/artworks/finalize/${id}`, {
                            highestBid: art.highestBid,
                            winner: bidHistory.length > 0 ? bidHistory[bidHistory.length - 1].user : null
                        });

                        setSuccess(res.data.message || "Auction finalized successfully!");
                    } catch (err) {
                        console.error(err);
                        setError("Failed to finalize auction");
                    }
                }
            } else {
                setAuctionEnded(false);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, [auctionEndTime, auctionFinalized, art, bidHistory, id]);


    // Place bid
    const submitBid = async () => {
        if (!isLoggedIn || userType !== "Buyer") {
            return navigate("/buyer-login");
        }
        if (auctionEnded) {
            setError("Auction has ended");
            return;
        }
        if (!bidAmount) {
            setError("Please enter a bid amount");
            return;
        }

        const bid = parseFloat(bidAmount);
        if (bid <= art.highestBid) {
            setError(`Bid must be higher than ₹${art.highestBid}`);
            return;
        }

        setBidding(true);
        try {
            const res = await axios.post(
                `http://localhost:5000/api/artworks/bid/${id}`,
                { amount: bidAmount, user: userData.name }
            );
            setSuccess(res.data.message || "Bid placed successfully!");
            setBidAmount("");
            setError("");
            fetchArt();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Error placing bid");
        } finally {
            setBidding(false);
        }
    };

    const handleWishlist = () => setIsWishlisted(!isWishlisted);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setSuccess("Link copied to clipboard!");
        setTimeout(() => setSuccess(""), 2000);
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin">
                    <Gavel className="w-12 h-12 text-amber-500" />
                </div>
            </section>
        );
    }

    if (!art) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
                <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-6 h-6" />
                    <p>Artwork not found</p>
                </div>
            </section>
        );
    }

    const isBuyerLoggedIn = isLoggedIn && userType === "Buyer";
    const bidsCount = bidHistory.length;

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 md:py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2 transition"
                    >
                        ← Back
                    </button>
                    <div className="flex gap-3">
                        <button onClick={handleWishlist} className="p-2 md:p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition">
                            <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
                        </button>
                        <button onClick={handleShare} className="p-2 md:p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition">
                            <Share2 className="w-6 h-6 text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Image & Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-6">
                            <img
                                src={`http://localhost:5000/uploads/${art.image}`}
                                alt={art.title}
                                className="w-full h-96 md:h-[500px] object-cover"
                            />
                        </div>
                        <div className="bg-black rounded-xl p-6 md:p-8 shadow-2xl mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{art.title}</h1>
                            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">{art.description}</p>

                            {/* Artist Info */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Artist</p>
                                    <p className="text-white font-semibold">{art.artistName || "Anonymous"}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Base Price</p>
                                    <p className="text-amber-400 text-xl font-bold">₹{art.basePrice}</p>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Total Bids</p>
                                    <p className="text-green-400 text-xl font-bold">{bidsCount}</p>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Category</p>
                                    <p className="text-blue-400 text-xl font-bold">{art.category || "Art"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bidding Section */}
                    <div>
                        {/* Highest Bid Card */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 md:p-8 shadow-2xl mb-6">
                            <p className="text-amber-100 text-sm font-semibold mb-2">Current Highest Bid</p>
                            <p className="text-4xl md:text-5xl font-bold text-white mb-1">₹{art.highestBid}</p>
                            <p className="text-amber-100 text-sm">{bidsCount} bids placed</p>
                        </div>

                        {/* Countdown Timer */}
                        <div className={`rounded-xl p-6 mb-6 shadow-2xl border ${auctionEnded ? 'bg-red-500/20 border-red-500/50' : 'bg-black border-gray-700'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className={`w-5 h-5 ${auctionEnded ? 'text-red-500' : 'text-amber-500'}`} />
                                <p className={`text-sm font-semibold ${auctionEnded ? 'text-red-400' : 'text-gray-400'}`}>
                                    {auctionEnded ? 'Auction Ended' : 'Time Remaining'}
                                </p>
                            </div>
                            <p className={`text-2xl font-bold ${auctionEnded ? 'text-red-400' : 'text-white'}`}>
                                {timeLeft || "Loading..."}
                            </p>
                        </div>

                        {/* Bidding Form */}
                        {isBuyerLoggedIn ? (
                            <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">Place Your Bid</h3>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        placeholder={`Min ₹${art.highestBid + 1}`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        min={art.highestBid + 1}
                                        disabled={auctionEnded}
                                    />
                                    <button
                                        onClick={submitBid}
                                        disabled={bidding || auctionEnded}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {auctionEnded ? "Auction Ended" : bidding ? "Placing Bid..." : "Place Bid"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/buyer-login")}
                                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition"
                            >
                                Login as Buyer
                            </button>
                        )}

                        {/* Messages */}
                        {error && (
                            <div className="mt-4 flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="mt-4 flex items-start gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <p className="text-green-400 text-sm">{success}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bid History */}
                <div className="mt-8 bg-black rounded-xl p-6 md:p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Bid History</h2>
                    {bidHistory.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No bids placed yet</p>
                    ) : (
                        <div className="space-y-3">
                            {[...bidHistory].reverse().map((bid, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-900 hover:bg-gray-650 p-4 rounded-lg transition border border-gray-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {bid.user.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{bid.user}</span>
                                    </div>
                                    <span className="text-amber-400 font-bold text-lg">₹{bid.amount}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ArtworkDetailPage;
