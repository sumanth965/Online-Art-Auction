import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeBackground from "../../components/ThreeBackground";
import Carousel from "./Carousel";
import PlatformFeatures from "./PlatformFeatures";

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

        {/* Features */}
        <PlatformFeatures />
      </div>
    </>
  );
}