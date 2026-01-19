import React, { useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
  UserPlus,
  LogIn,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ArtistAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL = "https://online-art-auction.onrender.com/api/artists";

  // 🔑 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password || (isSignup && !confirmPass)) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (isSignup && password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // 🔸 SIGN UP
        const res = await axios.post(`${API_URL}/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setSuccess(true);
          setTimeout(() => {
            setIsSignup(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPass("");
            setSuccess(false);
          }, 1500);
        }
      } else {
        // 🔹 SIGN IN
        const res = await axios.post(`${API_URL}/login`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setSuccess(true);
          login("Artist");

          if (rememberMe) {
            localStorage.setItem("artistToken", res.data.token);
          }
          login("Artist", res.data.token, res.data.artist.name);

          setTimeout(() => {
            navigate("/artist-dashboard");
          }, 1500);
        } else {
          setError(res.data.message || "Invalid credentials");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Demo Credentials
  const fillTestCredentials = () => {
    setName("Demo Artist");
    setEmail("artist@gmail.com");
    setPassword("123");
    setError("");
  };

  return (
    <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-2xl p-8 rounded-2xl border border-gray-700/40 shadow-2xl">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">
          {isSignup ? "Artist Sign Up" : "Artist Sign In"}
        </h2>
        <p className="text-gray-400 text-sm">
          {isSignup
            ? "Create your artist account to showcase art"
            : "Welcome back! Continue your creative journey"}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4 flex gap-3">
          <AlertCircle size={16} className="text-red-400" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-pink-500/10 border border-pink-500/30 p-3 rounded-lg mb-4 flex gap-3">
          <CheckCircle size={16} className="text-red-400" />
          <p className="text-red-300 text-sm">
            {isSignup ? "Account created successfully!" : "Login successful!"}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        {isSignup && (
          <div>
            <label className="text-xs uppercase text-gray-300 mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-gray-600" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Artist Name"
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/20 border rounded-lg text-sm text-gray-100 placeholder-gray-500 ${focusedField === "name"
                  ? "border-pink-500/50"
                  : "border-gray-600/30"
                  }`}
                disabled={loading}
              />
            </div>
          </div>)}

        {/* Email */}
        <div>
          <label className="text-xs uppercase text-gray-300 mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-gray-600" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-lg text-sm text-gray-100"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs uppercase text-gray-300 mb-2 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-gray-600" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 bg-gray-700/20 border border-gray-600/30 rounded-lg text-sm text-gray-100"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        {isSignup && (
          <div>
            <label className="text-xs uppercase text-gray-300 mb-2 block">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-lg text-sm text-gray-100"
              disabled={loading}
            />
          </div>
        )}

        {/* Remember Me */}
        {!isSignup && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-pink-500"
            />
            <span className="ml-2 text-xs text-gray-400">Remember me</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 text-gray-900"
        >
          {loading ? (
            <Loader className="animate-spin mx-auto" size={18} />
          ) : isSignup ? (
            <span className="flex justify-center gap-2">
              <UserPlus size={16} /> Create Account
            </span>
          ) : (
            <span className="flex justify-center gap-2">
              <LogIn size={16} /> Sign In
            </span>
          )}
        </button>
      </form>

      {/* Demo */}
      {!isSignup && (
        <button
          onClick={fillTestCredentials}
          className="w-full mt-4 py-2 text-sm bg-gray-700/20 border border-gray-600/30 rounded-lg text-gray-300"
        >
          Load Test Credentials
        </button>
      )}

      {/* Toggle */}
      <p className="text-center text-sm text-gray-400 mt-6">
        {isSignup ? "Already have an account?" : "New to ArtVault?"}{" "}
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setSuccess(false);
          }}
          className="text-pink-400 font-medium"
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default ArtistAuthForm;
