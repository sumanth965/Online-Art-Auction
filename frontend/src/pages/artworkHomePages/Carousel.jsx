import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FloatingCarousel() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const images = [
    {
      id: 1,
      title: "Golden Sunset",
      artist: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    },
    {
      id: 2,
      title: "Cosmic Dreams",
      artist: "Maya Patel",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    },
    {
      id: 3,
      title: "Ocean Whispers",
      artist: "James Chen",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    },
    {
      id: 4,
      title: "Forest Echo",
      artist: "Sofia Mendez",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          onUpdate: (self) =>
            setScrollProgress(Math.round(self.progress * 100)),
        },
      });

      cardsRef.current.forEach((card, i) => {
        const centerOffset = i - (images.length - 1) / 2;

        gsap.set(card, {
          x: centerOffset * 260,
          scale: 0.85,
          opacity: 0,
        });

        tl.to(
          card,
          {
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            duration: 0.6,
          },
          i * 0.15
        );
      });

      // subtle floating (not scroll-based)
      cardsRef.current.forEach((card, i) => {
        gsap.to(card, {
          y: "+=16",
          repeat: -1,
          yoyo: true,
          duration: 2 + i * 0.3,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen bg-black text-white overflow-hidden">
      {/* Cards */}
      <div className="fixed inset-0 flex items-center justify-center">
        {images.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="absolute w-72 h-96"
          >
            <div className="h-full rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl">
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-0 p-5">
                <h3 className="text-xl font-bold">{img.title}</h3>
                <p className="text-amber-300 text-xs">By {img.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-400"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </section>
  );
}
