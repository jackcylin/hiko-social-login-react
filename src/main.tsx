import React from "react";
import ReactDOM from "react-dom/client";
import { Demo } from "./Demo";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

function App() {
    return (
        <Demo
            shop={import.meta.env.VITE_SHOP}
            publicAccessToken={import.meta.env.VITE_PUBLIC_ACCESS_TOKEN}
            baseUrl={import.meta.env.VITE_BASE_URL}
        />
    );
}
