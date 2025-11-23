import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AlertCircle, Clock, TrendingUp, CheckCircle, X } from "lucide-react";

const BidPage = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userName, setUserName] = useState("");
  const [bidHistory, setBidHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchArtDetails();
    const refreshTimer = setInterval(() => {
      if (autoRefresh) fetchArtDetails();
    }, 5000);
    return () => clearInterval(refreshTimer);
  }, [id, autoRefresh]);

  // Countdown timer for auction end time
  useEffect(() => {
    if (!art?.auctionEndTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(art.auctionEndTime);
      const diff = end - now;

      if (diff <= 0) {
        setAuctionEnded(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [art?.auctionEndTime]);

  const fetchArtDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
      setArt(res.data);
      setBidHistory(res.data.bidHistory || []);
    } catch (err) {
      if (loading) setError("Failed to load artwork details. Please try again.");
      console.error("Error fetching artwork:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateBid = () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setError("Please enter a valid bid amount");
      return false;
    }

    if (!userName.trim()) {
      setError("Please enter your name");
      return false;
    }

    if (userName.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

    const amount = parseFloat(bidAmount);
    const minBid = art.highestBid > 0 ? art.highestBid + 1 : art.basePrice;

    if (amount < minBid) {
      setError(`Bid must be at least ₹${minBid}`);
      return false;
    }

    return true;
  };

  const submitBid = async () => {
    setError("");
    setSuccess("");

    if (!validateBid()) return;

    setBidding(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/artworks/bid/${id}`,
        { amount: parseFloat(bidAmount), user: userName.trim() }
      );

      setSuccess(res.data.message || "Bid placed successfully!");
      setBidAmount("");
      setUserName("");
      fetchArtDetails();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error placing bid. Please try again.";
      setError(errorMsg);
    } finally {
      setBidding(false);
    }
  };

  const handleQuickBid = (percentage) => {
    const baseBid = art.highestBid > 0 ? art.highestBid : art.basePrice;
    const suggestedBid = Math.ceil(baseBid * (1 + percentage / 100));
    setBidAmount(suggestedBid.toString());
    setError("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !bidding && !auctionEnded) {
      submitBid();
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading artwork...</p>
        </div>
      </section>
    );
  }

  if (!art) {
    return (
      <section className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-red-400 max-w-md">
          <AlertCircle className="w-6 h-6 mb-2" />
          <p>Artwork not found.</p>
        </div>
      </section>
    );
  }

  const minBid = art.highestBid > 0 ? art.highestBid + 1 : art.basePrice;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="md:col-span-1">
            <img
              src={`http://localhost:5000/uploads/${art.image}`}
              alt={art.title}
              className="w-full h-96 object-cover rounded-xl shadow-2xl"
            />
          </div>

          {/* Details Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 text-white">
              <h1 className="text-4xl font-bold mb-3">{art.title}</h1>
              <p className="text-gray-300 mb-6 leading-relaxed">{art.description}</p>

              {/* Auction Status */}
              {auctionEnded ? (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                  <p className="text-red-400 font-semibold">Auction Ended</p>
                </div>
              ) : timeRemaining ? (
                <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-4 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-300">
                    <span className="font-bold">
                      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                    </span>
                  </p>
                </div>
              ) : null}

              {/* Price Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Base Price</p>
                  <p className="text-amber-400 font-bold text-2xl">{formatPrice(art.basePrice)}</p>
                </div>
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Current Highest Bid</p>
                  <p className="text-green-400 font-bold text-2xl">{formatPrice(art.highestBid)}</p>
                </div>
              </div>

              {/* Bid Form */}
              {!auctionEnded ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={bidding}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Your Bid Amount</label>
                    <input
                      type="number"
                      placeholder={`Minimum: ${formatPrice(minBid)}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={bidding}
                      min={minBid}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  {/* Quick Bid Suggestions */}
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Quick bid suggestions:</p>
                    <div className="flex gap-2">
                      {[5, 10, 25].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => handleQuickBid(percent)}
                          disabled={bidding}
                          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 disabled:opacity-50 transition"
                        >
                          +{percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 flex gap-2 items-start">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm flex-1">{error}</p>
                      <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 flex gap-2 items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-green-300 text-sm flex-1">{success}</p>
                      <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={submitBid}
                    disabled={bidding || !userName.trim() || !bidAmount}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bidding ? "Placing Bid..." : "Place Bid"}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-300">This auction has ended. Final bid: {formatPrice(art.highestBid)}</p>
                </div>
              )}

              {/* Auto Refresh Toggle */}
              <div className="mt-6 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="autoRefresh" className="text-gray-400 cursor-pointer">
                  Auto-refresh bids every 5 seconds
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bid History */}
        {bidHistory.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-white font-semibold mb-4 hover:text-amber-400 transition"
            >
              <TrendingUp className="w-5 h-5" />
              Bid History ({bidHistory.length})
            </button>

            {showHistory && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bidHistory.map((bid, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition">
                    <div>
                      <p className="text-white font-semibold">{bid.user}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(bid.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-green-400 font-bold text-lg">{formatPrice(bid.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BidPage;