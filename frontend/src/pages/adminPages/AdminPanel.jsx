import React, { useState } from "react";
import useAppState from "../adminPages/useAppState";
import QueryPage from "../adminPages/QueryPage";
const AdminPanel = () => {
  const {
    pendingArtworks,
    handleApproveArtwork,
    handleRejectArtwork,
  } = useAppState();


  

  return (
    <section className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* MAIN TITLE */}
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>

        {/* ============================ */}
        {/*   PENDING ARTWORKS SECTION    */}
        {/* ============================ */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-4">Pending Artworks</h2>

          {pendingArtworks.length > 0 ? (
            pendingArtworks.map((art) => (
              <div
                key={art._id}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-700 p-4 rounded-lg mb-3 gap-4"
              >
                {/* Artwork Image */}
                {art.image && (
                  <img
                    src={`http://localhost:5000/uploads/${art.image}`}
                    alt={art.title}
                    className="w-40 h-40 object-cover rounded-xl border border-gray-600"
                  />
                )}

                {/* Artwork Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-white">{art.title}</h3>
                  <p className="text-gray-400 text-sm">Category: {art.category}</p>
                  <p className="text-gray-400 text-sm">Base Price: ₹{art.basePrice}</p>
                  <p className="text-gray-400 text-sm">Description: {art.description}</p>
                  <p className="text-gray-400 text-sm">Status: {art.status}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveArtwork(art._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleRejectArtwork(art._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending artworks available.</p>
          )}
        </div>

       <QueryPage />
      </div>
    </section>
  );
};

export default AdminPanel;
