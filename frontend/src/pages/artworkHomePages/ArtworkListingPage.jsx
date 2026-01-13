import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ArtworkListingPage = ({
    setSelectedArtwork,
    setCurrentPage
}) => {

    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterPrice, setFilterPrice] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    // Fetch Artworks
    const fetchArtworks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/artworks");
            setArtworks(res.data);
            setFilteredArtworks(res.data);
        } catch (err) {
            console.error("Error fetching artworks:", err);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    // Filtering Logic
    useEffect(() => {
        let result = artworks;

        if (searchTerm.trim() !== "") {
            result = result.filter(art =>
                art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                art.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== "all") {
            result = result.filter(art => art.category === filterCategory);
        }

        if (filterPrice !== "all") {
            if (filterPrice === "low") result = result.filter(art => art.basePrice < 200000);
            if (filterPrice === "mid") result = result.filter(art => art.basePrice >= 200000 && art.basePrice <= 300000);
            if (filterPrice === "high") result = result.filter(art => art.basePrice > 300000);
        }

        if (filterStatus !== "all") {
            result = result.filter(art => art.status === filterStatus);
        }

        setFilteredArtworks(result);
    }, [searchTerm, filterCategory, filterPrice, filterStatus, artworks]);

    return (
        <section className="min-h-screen bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                    Artwork Listings
                </h1>

                {/* Filters */}
                <div className="bg-black p-6 rounded-2xl mb-8 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                            <option value="all">All Categories</option>
                            <option value="Abstract">Abstract</option>
                            <option value="Landscape">Landscape</option>
                            <option value="Digital">Digital</option>
                            <option value="Portrait">Portrait</option>
                        </select>

                        <select
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                            <option value="all">All Prices</option>
                            <option value="low">Below ₹2 Lakh</option>
                            <option value="mid">₹2–3 Lakh</option>
                            <option value="high">Above ₹3 Lakh</option>
                        </select>

                        {/* <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select> */}
                    </div>

                    <p className="text-gray-400">Found {filteredArtworks.length} artworks</p>
                </div>

                {/* Artwork Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArtworks.map(artwork => (
                        <div key={artwork._id} className="group bg-black rounded-2xl border p-2">
                            <img
                                src={`http://localhost:5000/uploads/${artwork.image}`}
                                alt={artwork.title}
                                className="w-full h-48 object-cover rounded-xl"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold">{artwork.title}</h3>
                                <p className="text-gray-400">{artwork.category}</p>
                                <p className="text-amber-400 font-bold">₹{artwork.basePrice?.toLocaleString()}</p>

                                <button
                                    onClick={() => navigate(`/artwork/${artwork._id}`)}
                                    className="mt-4 w-full py-2 bg-amber-500 text-black rounded-lg flex justify-center gap-2 font-bold"
                                >
                                    <Eye size={18} /> View Details
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArtworkListingPage;
