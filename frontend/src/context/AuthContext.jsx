import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);

    /* =========================
       RESTORE AUTH ON REFRESH
    ========================= */
    useEffect(() => {
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("userName");

        if (role) {
            setIsLoggedIn(true);
            setUserRole(role);
            setUserName(name);
        }
    }, []);

    /* =========================
       LOGIN
    ========================= */
    const login = (role, token, name) => {
        setIsLoggedIn(true);
        setUserRole(role);
        setUserName(name);

        // Store auth info
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name);

        if (role === "Admin") {
            localStorage.setItem("adminToken", token);
        } else if (role === "Artist") {
            localStorage.setItem("artistToken", token);
        } else {
            localStorage.setItem("buyerToken", token);
        }
    };

    /* =========================
       LOGOUT
    ========================= */
    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userRole,
                userName, // ✅ exposed
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
