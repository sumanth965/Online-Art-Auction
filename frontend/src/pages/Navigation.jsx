import React, { useState, useEffect } from "react";
import {
  Home,
  Palette,
  ShoppingCart,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Auth state
  const { isLoggedIn, userRole, userName, logout } = useAuth();

  /* =========================
     SCROLL EFFECT
  ========================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     NAV HANDLER
  ========================= */
  const handleNavClick = (path) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
    navigate(path);
  };

  /* =========================
     NAV LINKS
  ========================= */
  const navLinks = [
    { path: "/", label: "Home", icon: Home, show: true },
    { path: "/artworks", label: "Artworks", icon: Palette, show: true },
    {
      path: "/artist-dashboard",
      label: "Dashboard",
      icon: ShoppingCart,
      show: isLoggedIn && userRole === "Artist",
    },
    {
      path: "/buyer-dashboard",
      label: "My Bids",
      icon: ShoppingCart,
      show: isLoggedIn && userRole === "Buyer",
    },
    {
      path: "/admin-panel",
      label: "Admin",
      icon: Users,
      show: isLoggedIn && userRole === "Admin",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      show: isLoggedIn,
    },
  ];

  const visibleLinks = navLinks.filter((l) => l.show);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-gradient-to-r from-black via-gray-900 to-gray-950 shadow-2xl shadow-amber-500/10 border-amber-500/40"
            : "bg-gradient-to-r from-black via-gray-900 to-gray-900 border-amber-500/20"
          } border-b backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* BRAND */}
            <Link
              to="/"
              onClick={() => handleNavClick("/")}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg group-hover:shadow-lg group-hover:shadow-amber-500/50">
                <Palette className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                ArtVault
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex items-center space-x-1">
              {visibleLinks.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => handleNavClick(path)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${activeLink === path
                      ? "bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-300"
                      : "text-gray-300 hover:text-amber-400"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {/* DESKTOP AUTH */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn && userName && (
                <span className="text-sm font-medium text-amber-300">
                  Hi, <span className="font-semibold">{userName}</span>
                </span>
              )}

              {!isLoggedIn ? (
                <button
                  onClick={() => handleNavClick("/login")}
                  className="px-6 py-2 rounded-lg border-2 border-amber-500 text-amber-400 font-semibold hover:bg-amber-500 hover:text-gray-900"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    handleNavClick("/");
                  }}
                  className="px-6 py-2 rounded-lg border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500 hover:text-gray-900 flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-l border-amber-500/30 z-40 transform transition-transform duration-500 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 border-b border-amber-500/20 flex justify-between">
          <span className="text-lg font-bold text-amber-400">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={20} className="text-amber-400" />
          </button>
        </div>

        {/* USERNAME (MOBILE) */}
        {isLoggedIn && userName && (
          <div className="p-4 text-center text-amber-300 font-medium border-b border-amber-500/20">
            Hi, {userName}
          </div>
        )}

        <div className="p-4 space-y-2">
          {visibleLinks.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-amber-500/10"
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-amber-500/20 mt-auto">
          {!isLoggedIn ? (
            <button
              onClick={() => handleNavClick("/login")}
              className="w-full py-3 rounded-lg border-2 border-amber-500 text-amber-400 font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                handleNavClick("/");
              }}
              className="w-full py-3 rounded-lg border-2 border-red-500 text-red-400 font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
