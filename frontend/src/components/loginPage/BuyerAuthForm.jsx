import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    UserPlus,
    LogIn,
    AlertCircle,
    CheckCircle,
    Loader,
} from "lucide-react";

const BuyerAuthForm = ({
    isSignUp,
    setIsSignUp,
    success,
    setSuccess,
    error,
    setError,
}) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const API_URL = "http://localhost:5000/api/buyers";

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // ---------------- HANDLE SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (isSignUp && (!name || !email || !password)) {
            setError("Please fill in all fields");
            return;
        }
        if (!isSignUp && (!email || !password)) {
            setError("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                // ---------------- SIGN UP ----------------
                const res = await axios.post(`${API_URL}/register`, {
                    name,
                    email,
                    password,
                });

                if (res.data.success) {
                    setSuccess(true);

                    setTimeout(() => {
                        setIsSignUp(false);
                        setSuccess(false);
                        setEmail("");
                        setPassword("");
                        setName("");
                    }, 1500);
                }
            } else {
                // ---------------- LOGIN ----------------
                const res = await axios.post(`${API_URL}/login`, {
                    email,
                    password,
                });

                if (res.data.success) {
                    setSuccess(true);

                    if (rememberMe) {
                        localStorage.setItem("buyerToken", res.data.token);
                    }

                    login("Buyer");

                    setTimeout(() => {
                        navigate("/artworks");
                    }, 1500);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fillTestCredentials = () => {
        setEmail("buyer@gmail.com");
        setPassword("123");
        setError("");
    };

    return (
        <>
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <AlertCircle size={16} className="text-red-400" />
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <CheckCircle size={16} className="text-blue-400" />
                    <p className="text-blue-300 text-sm">Success! Redirecting...</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                {isSignUp && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-4 pr-4 py-3 bg-gray-700/20 border rounded-lg text-gray-100 placeholder-gray-500 text-sm transition-all ${focusedField === "name"
                                    ? "border-blue-500/50 bg-gray-700/30 shadow-lg shadow-blue-500/5"
                                    : "border-gray-600/30"
                                }`}
                            disabled={loading}
                        />
                    </div>
                )}

                {/* EMAIL */}
                <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-600" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/20 border rounded-lg text-gray-100 placeholder-gray-500 text-sm transition-all ${focusedField === "email"
                                    ? "border-blue-500/50 bg-gray-700/30 shadow-lg shadow-blue-500/5"
                                    : "border-gray-600/30"
                                }`}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-600" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-3 bg-gray-700/20 border rounded-lg text-gray-100 placeholder-gray-500 text-sm transition-all ${focusedField === "password"
                                    ? "border-blue-500/50 bg-gray-700/30 shadow-lg shadow-blue-500/5"
                                    : "border-gray-600/30"
                                }`}
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

                {!isSignUp && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600/30 bg-gray-700/20 cursor-pointer accent-blue-500"
                        />
                        <label htmlFor="remember" className="ml-2.5 text-xs text-gray-400 cursor-pointer">
                            Remember me for 30 days
                        </label>
                    </div>
                )}

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${loading
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 opacity-50 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 shadow-lg shadow-blue-500/20"
                        }`}
                >
                    <div className="flex items-center justify-center">
                        {loading ? (
                            <>
                                <Loader className="animate-spin mr-2" size={18} />
                                {isSignUp ? "Creating Account..." : "Authenticating..."}
                            </>
                        ) : isSignUp ? (
                            <>
                                <UserPlus size={16} className="mr-2" /> Sign Up
                            </>
                        ) : (
                            <>
                                <LogIn size={16} className="mr-2" /> Sign In
                            </>
                        )}
                    </div>
                </button>
            </form>

            {!isSignUp && (
                <>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-700/30" />
                        <span className="text-xs text-gray-500">Demo Access</span>
                        <div className="flex-1 h-px bg-gray-700/30" />
                    </div>

                    <button
                        onClick={fillTestCredentials}
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-gray-700/20 border border-gray-600/30 text-gray-300 text-sm rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        Load Test Credentials
                    </button>
                </>
            )}

            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    {isSignUp ? "Already have an account?" : "New to the marketplace?"}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setSuccess(false);
                        }}
                        className="text-blue-400 hover:text-blue-300 ml-1 underline"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </>
    );
};

export default BuyerAuthForm;
