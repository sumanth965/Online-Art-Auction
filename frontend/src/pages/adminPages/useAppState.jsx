import { useState, useEffect } from "react";
import axios from "axios";

const useAppState = () => {
  const [pendingArtworks, setPendingArtworks] = useState([]);

  const fetchPendingArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/pending");
      setPendingArtworks(res.data);
    } catch (err) {
      console.error("Error fetching pending artworks:", err);
    }
  };

  const handleApproveArtwork = async (id) => {
    await axios.put(`http://localhost:5000/api/artworks/approve/${id}`);
    setPendingArtworks((prev) => prev.filter((art) => art._id !== id));
  };

  const handleRejectArtwork = async (id) => {
    await axios.put(`http://localhost:5000/api/artworks/reject/${id}`);
    setPendingArtworks((prev) => prev.filter((art) => art._id !== id));
  };

  useEffect(() => {
    fetchPendingArtworks();
  }, []);

  return { pendingArtworks, handleApproveArtwork, handleRejectArtwork };
};

export default useAppState;
