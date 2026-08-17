import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("access")));

    const login = useCallback((access, refresh) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an <AuthProvider>");
    }

    return context;
}
