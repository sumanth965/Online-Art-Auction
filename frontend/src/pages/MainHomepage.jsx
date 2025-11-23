import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreeBackground from "../components/ThreeBackground";


export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const [artworks] = useState([
    {
      id: 1,
      title: "Golden Sunset",
      artist: "Alex Rivera",
      currentBid: 125000,
      bids: 24,
      timeLeft: "2h 30m",
      image: "/Golden Sunset.png"
    },
    {
      id: 2,
      title: "Cosmic Dreams",
      artist: "Maya Patel",
      currentBid: 89500,
      bids: 18,
      timeLeft: "5h 15m",
      image: "/Cosmic Dreams.png"
    },
    {
      id: 3,
      title: "Ocean Whispers",
      artist: "James Chen",
      currentBid: 156000,
      bids: 31,
      timeLeft: "1h 45m",
      image: "/Ocean Whispers.png"
    },
    {
      id: 4,
      title: "Forest Echo",
      artist: "Sofia Mendez",
      currentBid: 98700,
      bids: 22,
      timeLeft: "3h 20m",
      image: "/Forest Echo.png"
    },
    {
      id: 5,
      title: "Midnight City",
      artist: "Marcus Johnson",
      currentBid: 142300,
      bids: 29,
      timeLeft: "4h 10m",
      image: "/Midnight City.png"
    },
    {
      id: 6,
      title: "Desert Rose",
      artist: "Elena Rossi",
      currentBid: 111500,
      bids: 26,
      timeLeft: "2h 55m",
      image: "/Desert Rose.png"
    },
  ]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-black overflow-hidden">
      <ThreeBackground />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(217,119,6,0.3); }
          50% { box-shadow: 0 0 40px rgba(217,119,6,0.6); }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .shimmer { animation: shimmer 3s infinite; background-size: 1000px 100%; }
        .slide-up { animation: slide-up 0.8s ease-out forwards; }
        .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
      `}
      </style>

      {/* Animated Gradient Orb */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-amber-500/30 to-orange-500/20 rounded-full blur-3xl pointer-events-none pulse-glow"
        style={{
          left: `${mousePos.x * 0.09}px`,
          top: `${mousePos.y * 0.09}px`,
          transition: "all 0.3s ease-out",
        }}
      ></div>

      {/* Secondary Orb */}
      <div className="absolute w-80 h-80 bg-gradient-to-r from-red-500/20 to-amber-500/15 rounded-full blur-3xl pointer-events-none float"
        style={{
          right: "-100px",
          bottom: "-50px",
        }}
      ></div>

      {/* Radial Accent Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.25),rgba(0,0,0,0))] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white">
        {/* Hero Section */}
        <div className="text-center mb-24 slide-up">
          <h1
            className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tight drop-shadow-xl [font-family:cursive]"
          >
            Discover Authentic Art
          </h1>





          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-[slide-up_0.8s_ease-out_0.2s_forwards]">
            Experience the world of fine art. Bid on exclusive pieces, support visionary artists, and own timeless masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center opacity-0 animate-[slide-up_0.8s_ease-out_0.4s_forwards]">
            <button className="px-10 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-gray-900 rounded-xl font-semibold tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all duration-300 glow-pulse">
              Explore Auctions
            </button>

            <button onClick={() => navigate("/login")}

              className="px-10 py-3.5 border border-amber-400 text-amber-300 rounded-xl font-semibold tracking-wide hover:bg-amber-400/10 hover:text-amber-200 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>









        {/* Ongoing Auctions */}
        {/* Ongoing Auctions */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-amber-400 opacity-0 animate-[slide-up_0.8s_ease-out_0.3s_forwards]">
            Ongoing Auctions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6">
            {artworks.map((artwork, idx) => (
              <div
                key={artwork.id}
                onClick={() => navigate(`/artwork/${artwork.id}`)}
                className="relative group bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl overflow-hidden border border-gray-700 cursor-pointer hover:border-amber-400/70 transition-all duration-500  hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.6)]"
                style={{
                  animationDelay: `${0.1 * (idx + 1)}s`,
                }}
              >
                {/* Artwork Image */}
                <div className="relative h-56 overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-800/20 to-gray-800 text-6xl group-hover:opacity-80 transition-all">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
                    🔴 LIVE
                  </div>
                </div>


                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-extrabold text-amber-400 group-hover:text-amber-300 transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-400 text-sm">by {artwork.artist}</p>

                  <div className="border-t border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Current Bid</span>
                      <span className="text-amber-400 font-bold">
                        ₹{artwork.currentBid.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bids</span>
                      <span className="text-white font-semibold">{artwork.bids}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Time Left</span>
                      <span className="text-orange-400 font-semibold">
                        {artwork.timeLeft}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/artwork/${artwork.id}`);
                    }}
                    className="w-full py-2 mt-4 bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 rounded-lg font-bold hover:from-amber-300 hover:to-amber-500 transition-all shadow-md group-hover:shadow-lg"
                  >
                    View Details →
                  </button>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-t from-amber-400/20 to-transparent transition-all duration-500"></div>
              </div>
            ))}
          </div>

        </div>

        {/* Features */}
        <div className="mt-32 relative">
          <h2 className="text-3xl font-bold mb-8 text-center text-amber-400 opacity-0 animate-[slide-up_0.8s_ease-out_0.3s_forwards]">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-16">
            {[
              { icon: "🔨", title: "Live Bidding", desc: "Experience real-time auctions with instant updates and competitive thrill." },
              { icon: "🎨", title: "Artist Portal", desc: "Empower artists to upload, manage, and showcase artworks seamlessly." },
              { icon: "📊", title: "Analytics", desc: "Get insights into bidding trends, popular artists, and buyer activity." },
              { icon: "🔍", title: "Smart Search", desc: "Find art quickly using filters for category, artist, and price range." },
              { icon: "🔒", title: "Secure", desc: "Protect your transactions with advanced encryption and JWT authentication." },
              { icon: "📱", title: "Mobile Ready", desc: "Enjoy a smooth, responsive experience across all devices." },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="relative group backdrop-blur-lg bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-3xl p-8 border border-gray-700 shadow-xl hover:shadow-amber-500/20 hover:border-amber-500/50 transform transition-all duration-500 "
                style={{
                  animationDelay: `${0.08 * (idx + 1) + 0.5}s`,
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors ">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>

                {/* Glow border animation */}
                <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-amber-400/30 transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}