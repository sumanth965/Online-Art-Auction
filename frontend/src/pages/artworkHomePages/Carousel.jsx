import React, { useState, useEffect, useRef } from "react";
import { Heart, Gavel, Clock, TrendingUp, ChevronLeft, ChevronRight, Search, Star, Users, Award } from "lucide-react";

const artworks = [
  {
    id: 1,
    title: "Venetian Sunset",
    artist: "Marco Rossi",
    image: "https://images.pexels.com/photos/32044199/pexels-photo-32044199.jpeg",
    startingPrice: 12500,
    currentBid: 18700,
    bidCount: 24,
    timeLeft: "2h 45m",
    likes: 342,
    rarity: "Limited Edition",
    year: 2022,
    medium: "Oil on Canvas",
  },
  {
    id: 2,
    title: "Abstract Dynamics",
    artist: "Emily Chen",
    image: "https://images.pexels.com/photos/35593997/pexels-photo-35593997.jpeg",
    startingPrice: 8900,
    currentBid: 14200,
    bidCount: 18,
    timeLeft: "4h 20m",
    likes: 256,
    rarity: "One of a Kind",
    year: 2023,
    medium: "Acrylic on Canvas",
  },
  {
    id: 3,
    title: "Lady in Elegance",
    artist: "John Reynolds",
    image: "https://images.pexels.com/photos/10284751/pexels-photo-10284751.jpeg",
    startingPrice: 15000,
    currentBid: 22500,
    bidCount: 31,
    timeLeft: "1h 15m",
    likes: 478,
    rarity: "Limited Edition",
    year: 2021,
    medium: "Mixed Media",
  },
  {
    id: 4,
    title: "Classical Beauty",
    artist: "Alessandro Marini",
    image: "https://images.pexels.com/photos/35637950/pexels-photo-35637950.jpeg",
    startingPrice: 20000,
    currentBid: 31800,
    bidCount: 45,
    timeLeft: "58m",
    likes: 612,
    rarity: "Exclusive",
    year: 2020,
    medium: "Bronze Sculpture",
  },
  {
    id: 5,
    title: "Countryside Serenity",
    artist: "Thomas Wright",
    image: "https://images.pexels.com/photos/31718987/pexels-photo-31718987.jpeg",
    startingPrice: 7500,
    currentBid: 11300,
    bidCount: 12,
    timeLeft: "5h 30m",
    likes: 289,
    rarity: "Signed Print",
    year: 2023,
    medium: "Digital Print",
  },
];

const stats = [
  { label: "Active Auctions", value: "150+", icon: Gavel },
  { label: "Total Collectors", value: "5,200+", icon: Users },
  { label: "Artworks Sold", value: "$2.4M", icon: Award },
];

export default function AdvancedArtAuction() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());

  const elementRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check which elements are in viewport
      Object.entries(elementRefs.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
          setVisibleElements((prev) => {
            const newSet = new Set(prev);
            if (isVisible) {
              newSet.add(key);
            }
            return newSet;
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % artworks.length);
  const prev = () => setIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));

  const toggleLike = (id) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || art.rarity === filter;
    return matchesSearch && matchesFilter;
  });

  const visible = [
    artworks[(index - 1 + artworks.length) % artworks.length],
    artworks[index],
    artworks[(index + 1) % artworks.length],
  ];

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-20 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl opacity-30 animate-blob"
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl opacity-15 animate-blob animation-delay-4000"
          style={{ transform: `translateY(${parallaxOffset * 0.4}px)` }}
        />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .scroll-trigger-visible {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 text-center pt-16 pb-12 overflow-hidden">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] text-amber-400/70 uppercase font-light animate-fadeIn">
            Discover Premium Art
          </p>
          {/* <h1 className="text-6xl md:text-8xl font-serif font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent leading-tight animate-slideInLeft"
            style={{ animationDelay: "0.1s" }}>
            Art Auction
          </h1> */}
          <p className="text-slate-400 text-lg tracking-wide animate-slideInRight"
            style={{ animationDelay: "0.2s" }}>
            Exquisite artworks from visionary creators
          </p>
        </div>
      </header>

      {/* Stats Section */}
      {/* <div
        ref={(el) => el && (elementRefs.current.stats = el)}
        className="relative z-10 px-4 sm:px-6 py-12 max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isVisible = visibleElements.has("stats");
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-700/30 rounded-xl p-6 text-center backdrop-blur-sm ${isVisible ? "animate-scaleIn" : "opacity-0"
                  }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <Icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-amber-300">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Search & Filter Bar */}
      <div className="relative z-10 px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center animate-slideInLeft"
          style={{ animationDelay: "0.3s" }}>
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400/50 group-focus-within:text-amber-400 transition" />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-amber-700/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800/60 transition duration-300 backdrop-blur-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {["all", "Limited Edition", "One of a Kind", "Exclusive"].map((f, idx) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition duration-300 whitespace-nowrap ${filter === f
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30"
                  : "bg-slate-800/40 border border-amber-700/20 text-amber-300 hover:bg-slate-700/50 hover:border-amber-500/30 backdrop-blur-sm"
                  }`}
                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Carousel */}
      <div className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif mb-12 text-amber-300 tracking-wide animate-slideInLeft"
            style={{ animationDelay: "0.4s" }}>
            Featured Auctions
          </h2>

          <div className="flex items-center justify-center gap-6 sm:gap-8">
            {/* Previous Button */}
            <button
              onClick={prev}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 backdrop-blur-sm hover:from-amber-500/40 hover:to-amber-600/40 transition duration-300 flex items-center justify-center group shadow-lg hover:shadow-amber-500/20"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition duration-300" />
            </button>

            {/* Cards Container */}
            <div className="relative flex-1 max-w-4xl overflow-hidden">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {visible.map((art, i) => (
                  <div
                    key={art.id}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-700 ease-out flex-shrink-0 group ${i === 1
                      ? "w-72 sm:w-80 h-[420px] sm:h-[480px] scale-100 opacity-100 z-20"
                      : "w-56 sm:w-64 h-80 sm:h-96 scale-75 sm:scale-90 opacity-40 sm:opacity-60"
                      }`}
                  >
                    {/* Card Image */}
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Live Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg">
                      <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
                      LIVE
                    </div>

                    {/* Time Left */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-amber-300 font-semibold">
                      <Clock className="w-4 h-4" />
                      {art.timeLeft}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(art.id)}
                      className="absolute top-16 right-4 w-10 h-10 rounded-full bg-slate-950/70 backdrop-blur-sm flex items-center justify-center hover:bg-slate-950 transition duration-300 shadow-lg hover:shadow-red-500/30 group/heart"
                    >
                      <Heart
                        className={`w-5 h-5 transition duration-300 ${liked.has(art.id)
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-slate-300 group-hover/heart:text-red-400"
                          }`}
                      />
                    </button>

                    {/* Bottom Content */}
                    {i === 1 && (
                      <div className="absolute bottom-0 w-full p-6 space-y-4 animate-fadeIn">
                        <div>
                          <h3 className="text-2xl font-serif text-amber-300 mb-1">
                            {art.title}
                          </h3>
                          <p className="text-sm text-slate-300">By {art.artist}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Current Bid</span>
                            <span className="text-amber-300 font-bold text-lg">
                              ${art.currentBid.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400 text-xs">
                            <span>{art.bidCount} bids</span>
                            <span>Est. ${art.startingPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-amber-500/40 transition duration-300 flex items-center justify-center gap-2 group/btn transform hover:scale-105">
                          <Gavel className="w-5 h-5 group-hover/btn:scale-110 transition duration-300" />
                          Place Bid
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 backdrop-blur-sm hover:from-amber-500/40 hover:to-amber-600/40 transition duration-300 flex items-center justify-center group shadow-lg hover:shadow-amber-500/20"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div
        ref={(el) => el && (elementRefs.current.gallery = el)}
        className="relative z-10 py-16 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif mb-12 text-amber-300 tracking-wide animate-slideInLeft"
            style={{ animationDelay: "0.5s" }}>
            More Auctions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((art, idx) => {
              const isVisible = visibleElements.has("gallery");
              return (
                <div
                  key={art.id}
                  className={`group cursor-pointer ${isVisible ? "scroll-trigger-visible" : "opacity-0"}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 h-64 mb-4 border border-amber-700/20 shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition duration-500">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-500" />

                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {art.rarity}
                    </div>

                    <button
                      onClick={() => toggleLike(art.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-sm flex items-center justify-center hover:bg-slate-950 transition duration-300 shadow-lg hover:shadow-red-500/20 group/heart"
                    >
                      <Heart
                        className={`w-4 h-4 transition duration-300 ${liked.has(art.id)
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-slate-300 group-hover/heart:text-red-400"
                          }`}
                      />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-amber-300 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      {art.bidCount}
                    </div>
                  </div>

                  <h3 className="text-lg font-serif text-white group-hover:text-amber-300 transition duration-300 mb-1">
                    {art.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {art.artist} • {art.year}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current Bid</p>
                      <p className="text-lg font-bold text-amber-400">
                        ${art.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {art.timeLeft}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}