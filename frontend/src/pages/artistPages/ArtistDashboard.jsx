import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

const ArtistDashboard = () => {
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    category: "",
    basePrice: "",
    description: "",
    image: null,
  });

  const [approvedArtworks, setApprovedArtworks] = useState([]);
  const [pendingArtworks, setPendingArtworks] = useState([]);

  useEffect(() => {
    fetchApprovedArtworks();
    fetchPendingArtworks();
  }, []);

  // 👉 Fetch Approved Artworks
  const fetchApprovedArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks");
      setApprovedArtworks(res.data);
    } catch (err) {
      console.error("Error fetching approved artworks:", err);
    }
  };

  // 👉 Fetch Pending Artworks
  const fetchPendingArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/pending");
      setPendingArtworks(res.data);
    } catch (err) {
      console.error("Error fetching pending artworks:", err);
    }
  };

  // 👉 Upload
  const handleAddArtwork = async () => {
    if (!newArtwork.title || !newArtwork.category || !newArtwork.image) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    Object.entries(newArtwork).forEach(([key, value]) => {
      formData.append(key, value);
    });

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
      alert("Failed to upload artwork.");
    }
  };

  // 👉 Delete Artwork
  const handleDeleteArtwork = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`);
      setApprovedArtworks((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Artist Dashboard
        </h1>

        {/* Upload Form */}
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Artwork</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Artwork Title"
              value={newArtwork.title}
              onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />

            <select
              value={newArtwork.category}
              onChange={(e) => setNewArtwork({ ...newArtwork, category: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select Category</option>
              <option value="Abstract">Abstract</option>
              <option value="Landscape">Landscape</option>
              <option value="Digital">Digital</option>
              <option value="Portrait">Portrait</option>
            </select>

            <input type="number" placeholder="Base Price (₹)"
              value={newArtwork.basePrice}
              onChange={(e) => setNewArtwork({ ...newArtwork, basePrice: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />

            <input type="file" accept="image/*"
              onChange={(e) => setNewArtwork({ ...newArtwork, image: e.target.files[0] })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>

          <textarea
            placeholder="Artwork Description"
            value={newArtwork.description}
            onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 resize-none"
            rows="4"
          />

          <button onClick={handleAddArtwork}
            className="px-6 py-2 bg-amber-500 text-gray-900 rounded-lg font-bold flex items-center gap-2">
            <Plus size={18} /> Upload Artwork
          </button>
        </div>

        {/* Approved Artworks */}
        <h2 className="text-2xl font-bold mb-6">Approved Artworks</h2>
        {approvedArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedArtworks.map((art) => (
              <div key={art._id} className="bg-gray-800 p-6 rounded-2xl">
                <img src={`http://localhost:5000/uploads/${art.image}`} className="w-full h-60 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">{art.title}</h3>
                <p className="text-gray-400 mb-2">Category: {art.category}</p>
                <p className="text-gray-400 mb-4">Base Price: ₹{art.basePrice}</p>

                <button onClick={() => handleDeleteArtwork(art._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No approved artworks yet.</p>
        )}

        {/* Pending Artworks */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Pending Artworks</h2>
          {pendingArtworks.length > 0 ? (
            <ul className="text-gray-400 space-y-2">
              {pendingArtworks.map((art) => (
                <li key={art._id}>⏳ {art.title} — Waiting for admin approval</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No artworks pending approval.</p>
          )}
        </div>

      </div>
    </section>
  );
};

export default ArtistDashboard;
