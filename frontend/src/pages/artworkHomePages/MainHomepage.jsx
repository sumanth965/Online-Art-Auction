import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeBackground from "../../components/ThreeBackground";
import Carousel from "./Carousel";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const artworksRef = useRef([]);
  const featuresRef = useRef([]);
  const heroRef = useRef(null);

  const [artworks] = useState([
    {
      id: 1,
      title: "Golden Sunset",
      artist: "Alex Rivera",
      currentBid: 125000,
      bids: 24,
      timeLeft: "2h 30m",
      image: "/Golden Sunset.png",
    },
    {
      id: 2,
      title: "Cosmic Dreams",
      artist: "Maya Patel",
      currentBid: 89500,
      bids: 18,
      timeLeft: "5h 15m",
      image: "/Cosmic Dreams.png",
    },
    {
      id: 3,
      title: "Ocean Whispers",
      artist: "James Chen",
      currentBid: 156000,
      bids: 31,
      timeLeft: "1h 45m",
      image: "/Ocean Whispers.png",
    },
    {
      id: 4,
      title: "Forest Echo",
      artist: "Sofia Mendez",
      currentBid: 98700,
      bids: 22,
      timeLeft: "3h 20m",
      image: "/Forest Echo.png",
    },
    {
      id: 5,
      title: "Midnight City",
      artist: "Marcus Johnson",
      currentBid: 142300,
      bids: 29,
      timeLeft: "4h 10m",
      image: "/Midnight City.png",
    },
    {
      id: 6,
      title: "Desert Rose",
      artist: "Elena Rossi",
      currentBid: 111500,
      bids: 26,
      timeLeft: "2h 55m",
      image: "/Desert Rose.png",
    },
  ]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ScrollTrigger animations
  useEffect(() => {
    // Hero section fade-in
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      }
    );

    // Artwork cards stagger animation
    gsap.fromTo(
      artworksRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out",
        scrollTrigger: {
          trigger: ".artworks-section",
          start: "top 80%",
          end: "top 20%",
          scrub: 0.5,
          markers: false,
        },
      }
    );

    // Features section stagger
    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
          end: "top 25%",
          scrub: 0.5,
          markers: false,
        },
      }
    );

    // Floating animation for feature icons
    featuresRef.current.forEach((el) => {
      gsap.to(el.querySelector(".feature-icon"), {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="relative w-full overflow-hidden bg-black text-white">
        <ThreeBackground />

        {/* Animated Gradient Orb */}
        <div
          className="fixed top-20 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
          style={{
            transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Secondary Orb */}
        <div
          className="fixed bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"
          style={{
            transform: `translate(${-mousePos.x * 0.03}px, ${-mousePos.y * 0.03}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Radial Accent Overlay */}
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(251,146,60,0.05) 0%, transparent 50%)`,
            transition: "background 0.3s ease-out",
          }}
        />

        {/* Hero Section */}
        <div
          ref={heroRef}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Discover Authentic Art
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Experience the world of fine art. Bid on exclusive pieces, support visionary artists, and own timeless masterpieces.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("/artworks")}
              className="px-10 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-gray-900 rounded-xl font-semibold tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all duration-300 glow-pulse"
            >
              Explore Auctions
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-3.5 border border-amber-400 text-amber-300 rounded-xl font-semibold tracking-wide hover:bg-amber-400/10 hover:text-amber-200 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
        <Carousel />

        {/* Ongoing Auctions */}
        <div className="artworks-section relative z-10 py-20 px-6">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Ongoing Auctions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {artworks.map((artwork, idx) => (
              <div
                key={artwork.id}
                ref={(el) => (artworksRef.current[idx] = el)}
                onClick={() => navigate("/artworks")}
                className="relative group bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl overflow-hidden border border-gray-700 cursor-pointer hover:border-amber-400/70 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.6)]"
              >
                {/* Artwork Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    🔴 LIVE
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{artwork.title}</h3>
                  <p className="text-amber-300 text-sm mb-4">by {artwork.artist}</p>
                  <div className="space-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Current Bid</span>
                      <span className="text-amber-300 font-semibold">₹{artwork.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bids</span>
                      <span className="text-amber-300 font-semibold">{artwork.bids}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Left</span>
                      <span className="text-red-400 font-semibold">{artwork.timeLeft}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/artworks")}
                    className="w-full py-2 mt-4 bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 rounded-lg font-bold hover:from-amber-300 hover:to-amber-500 transition-all shadow-md group-hover:shadow-lg"
                  >
                    View Details →
                  </button>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="features-section relative z-10 py-20 px-6">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "🔨",
                title: "Live Bidding",
                desc: "Experience real-time auctions with instant updates and competitive thrill.",
              },
              {
                icon: "🎨",
                title: "Artist Portal",
                desc: "Empower artists to upload, manage, and showcase artworks seamlessly.",
              },
              {
                icon: "📊",
                title: "Analytics",
                desc: "Get insights into bidding trends, popular artists, and buyer activity.",
              },
              {
                icon: "🔍",
                title: "Smart Search",
                desc: "Find art quickly using filters for category, artist, and price range.",
              },
              {
                icon: "🔒",
                title: "Secure",
                desc: "Protect your transactions with advanced encryption and JWT authentication.",
              },
              {
                icon: "📱",
                title: "Mobile Ready",
                desc: "Enjoy a smooth, responsive experience across all devices.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                ref={(el) => (featuresRef.current[idx] = el)}
                className="relative p-8 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 rounded-2xl border border-gray-700 hover:border-amber-400/50 transition-all duration-300 group hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className="feature-icon text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-amber-300">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>

                {/* Glow border animation */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}