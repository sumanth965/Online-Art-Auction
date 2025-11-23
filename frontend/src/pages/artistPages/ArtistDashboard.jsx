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
  const [userArtworks, setUserArtworks] = useState([]);

  // ✅ Fetch artworks on load
  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks");
      setUserArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  // ✅ Upload new artwork
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

      alert("Artwork uploaded successfully!");
      setNewArtwork({
        title: "",
        category: "",
        basePrice: "",
        description: "",
        image: null,
      });
      fetchArtworks();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload artwork.");
    }
  };

  // ✅ Delete artwork
  const handleDeleteArtwork = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`);
      setUserArtworks((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting artwork:", err);
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Artist Dashboard
        </h1>

        {/* Upload Form */}
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Artwork</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Artwork Title"
              value={newArtwork.title}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, title: e.target.value })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />

            <select
              value={newArtwork.category}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, category: e.target.value })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
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
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, image: e.target.files[0] })
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-900 hover:file:bg-amber-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <textarea
            placeholder="Artwork Description"
            value={newArtwork.description}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, description: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 mb-4 resize-none"
            rows="4"
          />

          <button
            onClick={handleAddArtwork}
            className="px-6 py-2 bg-amber-500 text-gray-900 rounded-lg font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Upload Artwork
          </button>
        </div>

        {/* Your Artworks */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Uploaded Artworks</h2>
          {userArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArtworks.map((art) => (
                <div
                  key={art._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
                >
                  {art.image && (
                    <img
                      src={`http://localhost:5000/uploads/${art.image}`}
                      alt={art.title}
                      className="w-full h-60 object-cover rounded-xl mb-4 border border-gray-700"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {art.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Category: {art.category}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Base Price: ₹{art.basePrice.toLocaleString()}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteArtwork(art._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              You haven’t uploaded any artworks yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistDashboard;
