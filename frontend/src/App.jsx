import { useState } from "react";

import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WatchlistPage from "./pages/WatchlistPage";

function App() {
    const { loggedIn } = useAuth();
    const [authView, setAuthView] = useState("login"); // "login" | "register"

    if (!loggedIn) {
        return authView === "login" ? (
            <LoginPage onSwitchToRegister={() => setAuthView("register")} />
        ) : (
            <RegisterPage onSwitchToLogin={() => setAuthView("login")} />
        );
    }

    return <WatchlistPage />;
}

export default App;
