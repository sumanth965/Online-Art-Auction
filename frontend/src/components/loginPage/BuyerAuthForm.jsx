import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
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

    const API_URL = "https://online-art-auction.onrender.com/api/buyers";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // ---------------- HANDLE SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validation
        if (!email || !password || (isSignUp && !confirmPassword)) {
            setError("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                // -------- SIGN UP --------
                const res = await axios.post(`${API_URL}/register`, {
                    name,
                    email,
                    password,
                });

                if (res.data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        setIsSignUp(false);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setSuccess(false);
                    }, 1500);
                }
            } else {
                // -------- SIGN IN --------
                const res = await axios.post(`${API_URL}/login`, {
                    email,
                    password,
                });

                if (res.data.success) {
                    setSuccess(true);

                    if (rememberMe) {
                        localStorage.setItem("buyerToken", res.data.token);
                    }

                    // ✅ THIS IS WHERE IT GOES
                    login("Buyer", res.data.token, res.data.buyer.name);

                    setTimeout(() => {
                        navigate("/buyer-dashboard");
                    }, 1500);
                }

            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Demo credentials
    const fillTestCredentials = () => {
        setName("Demo Buyer");
        setEmail("bbuyer@gmail.com");
        setPassword("123");
        setError("");
    };

    return (
        <>
            {/* ALERTS */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex gap-3">
                    <AlertCircle size={16} className="text-red-400" />
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex gap-3">
                    <CheckCircle size={16} className="text-blue-400" />
                    <p className="text-blue-300 text-sm">Success! Redirecting...</p>
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                {/* NAME (Both Sign In & Sign Up) */}
                {isSignUp && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
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
                                placeholder="John Doe"
                                className={`w-full pl-10 pr-4 py-3 bg-gray-700/20 border rounded-lg text-sm text-gray-100 ${focusedField === "name"
                                    ? "border-blue-500/50 bg-gray-700/30 shadow-lg shadow-blue-500/5"
                                    : "border-gray-600/30"
                                    }`}
                                disabled={loading}
                            />
                        </div>
                    </div>)}

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
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/20 border rounded-lg text-sm text-gray-100 ${focusedField === "email"
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
                            className={`w-full pl-10 pr-10 py-3 bg-gray-700/20 border rounded-lg text-sm text-gray-100 ${focusedField === "password"
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

                {/* CONFIRM PASSWORD (Sign Up Only) */}
                {isSignUp && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-gray-700/20 border border-gray-600/30 rounded-lg text-sm text-gray-100"
                            disabled={loading}
                        />
                    </div>
                )}

                {/* REMEMBER ME */}
                {!isSignUp && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-400">Remember me for 30 days</span>
                    </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${loading
                        ? "bg-blue-500/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 shadow-lg shadow-blue-500/20"
                        }`}
                >
                    {loading ? (
                        <Loader className="animate-spin mx-auto" size={18} />
                    ) : isSignUp ? (
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

            {/* DEMO */}
            {!isSignUp && (
                <button
                    onClick={fillTestCredentials}
                    className="w-full py-2.5 bg-gray-700/20 border border-gray-600/30 rounded-lg text-sm text-gray-300"
                >
                    Load Test Credentials
                </button>
            )}

            {/* TOGGLE */}
            <p className="text-center text-sm text-gray-400 mt-6">
                {isSignUp ? "Already have an account?" : "New to the marketplace?"}
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                        setSuccess(false);
                    }}
                    className="ml-1 text-blue-400 underline"
                >
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
            </p>
        </>
    );
};

export default BuyerAuthForm;
