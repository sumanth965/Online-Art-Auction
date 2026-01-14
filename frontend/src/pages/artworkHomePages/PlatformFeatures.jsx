import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PlatformFeatures() {
  const featuresRef = useRef([]);

  useEffect(() => {
    // Respect reduced motion preference
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      // Initial hidden state
      gsap.set(featuresRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        willChange: "transform, opacity",
      });

      // Scroll-trigger animation
      gsap.to(featuresRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const FEATURES = [
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
  ];

  return (
    <section className="features-section relative z-10 py-20 px-6">
      {/* Section Heading */}
      <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
        Platform Features
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) featuresRef.current[idx] = el;
            }}
            className="relative p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/60
                       transition-all duration-300 group hover:border-amber-400/50
                       hover:shadow-lg hover:shadow-amber-500/10"
          >
            {/* Icon */}
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-amber-300">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>

            {/* Glow Overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300
                            bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0" />
          </div>
        ))}
      </div>
    </section>
  );
}
