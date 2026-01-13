import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetchApprovedArtworks();
  }, []);

  const fetchApprovedArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks");
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching approved artworks:", err);
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-6">Buyer Dashboard</h1>

        {artworks.length === 0 ? (
          <p className="text-gray-300">No artworks available now...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div key={art._id} className="bg-black p-4 rounded-xl shadow-lg">
                <img
                  src={`http://localhost:5000/uploads/${art.image}`}
                  alt={art.title}
                  className="w-full h-56 object-cover rounded-lg"
                />

                <h2 className="text-xl text-white font-bold mt-3">{art.title}</h2>
                <p className="text-gray-400">{art.category}</p>
                <p className="text-amber-400 font-bold">Base Price: ₹{art.basePrice}</p>
                <p className="text-green-400 font-bold mb-3">
                  Highest Bid: ₹{art.highestBid}
                </p>

                <Link to={`/bid/${art._id}`}>
                  <button className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600">
                    Place Bid
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BuyerDashboard;
