import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// 1. Membuat context
export const AuthContext = createContext();

// 2. Komponen provider untuk konteks autentikasi
export const AuthProvider = ({ children }) => {
    // Langsung cek cookie saat state diinisialisasi
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));

    useEffect(() => {
        const handleTokenChange = () => {
            setIsAuthenticated(!!Cookies.get('token'));
        };

        // Listen perubahan storage (berguna jika user logout/login dari tab lain)
        window.addEventListener('storage', handleTokenChange);

        // Cleanup listener saat komponen unmount
        return () => {
            window.removeEventListener('storage', handleTokenChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};