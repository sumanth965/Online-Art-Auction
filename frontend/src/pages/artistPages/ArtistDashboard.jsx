import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    category: "",
    basePrice: "",
    description: "",
    image: null,
  });
  const navigate = useNavigate();
  const [approvedArtworks, setApprovedArtworks] = useState([]);
  const [pendingArtworks, setPendingArtworks] = useState([]);

  useEffect(() => {
    fetchApprovedArtworks();
    fetchPendingArtworks();
  }, []);
  const { userName } = useAuth(); // logged-in artist name

  // Fetch Approved Artworks
  const fetchApprovedArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks");
      setApprovedArtworks(res.data);
    } catch (err) {
      console.error("Error fetching approved artworks:", err);
    }
  };

  // Fetch Pending Artworks
  const fetchPendingArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/pending");
      setPendingArtworks(res.data);
    } catch (err) {
      console.error("Error fetching pending artworks:", err);
    }
  };

  // Upload Artwork
  const handleAddArtwork = async () => {
    if (!newArtwork.title || !newArtwork.category || !newArtwork.image) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();

    Object.entries(newArtwork).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // ✅ Send logged-in artist name
    formData.append("artistName", userName);

    try {
      await axios.post("http://localhost:5000/api/artworks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Artwork uploaded and waiting for approval!");

      setNewArtwork({
        title: "",
        category: "",
        basePrice: "",
        description: "",
        image: null,
      });

      fetchPendingArtworks();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading artwork. Please try again.");
    }
  };


  // Delete Artwork
  const handleDeleteArtwork = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`);
      setApprovedArtworks((prev) => prev.filter((a) => a._id !== id));
      alert("Artwork deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting artwork. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Artist Dashboard
        </h1>

        {/* Upload Form */}
        <div className="bg-black p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Artwork</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Artwork Title"
              value={newArtwork.title}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, title: e.target.value })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />

            <select
              value={newArtwork.category}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, category: e.target.value })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select Category</option>
              <option value="Abstract">Abstract</option>
              <option value="Landscape">Landscape</option>
              <option value="Digital">Digital</option>
              <option value="Portrait">Portrait</option>
            </select>

            <input
              type="number"
              placeholder="Base Price (₹)"
              value={newArtwork.basePrice}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, basePrice: e.target.value })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewArtwork({
                  ...newArtwork,
                  image: e.target.files?.[0] || null,
                })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <textarea
            placeholder="Artwork Description"
            value={newArtwork.description}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, description: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 resize-none placeholder-gray-400"
            rows="4"
          />

          <button
            onClick={handleAddArtwork}
            className="px-6 py-2 bg-amber-500 text-gray-900 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors"
          >
            <Plus size={18} /> Upload Artwork
          </button>
        </div>

        {/* Approved & Pending TAB Buttons */}
        <div className="mt-12">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "approved"
                ? "bg-amber-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Approved ({approvedArtworks.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "pending"
                ? "bg-amber-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Pending ({pendingArtworks.length})
            </button>
          </div>

          {/* Approved Artworks */}
          {activeTab === "approved" && (
            <div>
              {approvedArtworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedArtworks.map((art, idx) => (
                    <div
                      key={art._id}
                      className="group bg-gradient-to-br from-black to-black border border-slate-700/50 rounded-2xl overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="relative overflow-hidden aspect-square bg-slate-700/30">
                        <img
                          src={`http://localhost:5000/uploads/${art.image}`}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <button
                            onClick={() => navigate(`/bid/${art._id}`)}
                            className="flex-1 bg-amber-400 text-black font-bold py-2 rounded-lg hover:bg-amber-300"
                          >
                            Bid Now
                          </button>

                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2 truncate">
                          {art.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3">
                          <span className="px-2 py-1 bg-slate-700/50 rounded-full">
                            {art.category}
                          </span>
                        </p>
                        <p className="text-amber-400 font-bold mb-4">
                          ₹{art.basePrice}
                        </p>

                        <button
                          onClick={() => handleDeleteArtwork(art._id)}
                          className="w-full py-2 bg-red-700/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6">
                  No approved artworks yet.
                </p>
              )}
            </div>
          )}

          {/* Pending Artworks */}
          {activeTab === "pending" && (
            <div>
              {pendingArtworks.length > 0 ? (
                <div className="space-y-3">
                  {pendingArtworks.map((art, idx) => (
                    <div
                      key={art._id}
                      className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{art.title}</p>
                          <p className="text-slate-400 text-sm">Under review</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        <p className="text-slate-400 text-sm">Pending</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6">
                  No artworks pending approval.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in .6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ArtistDashboard;