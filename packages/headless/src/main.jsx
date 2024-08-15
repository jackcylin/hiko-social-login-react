import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider, Page } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { Demo } from "hiko-social-login-react";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider i18n={enTranslations}>
            <App />
        </AppProvider>
    </React.StrictMode>
);

function App() {
    return (
        <Page title="Headless lab">
            <Demo
                shop={import.meta.env.VITE_SHOP}
                publicAccessToken={import.meta.env.VITE_PUBLIC_ACCESS_TOKEN}
                baseUrl={import.meta.env.VITE_BASE_URL}
            />

            <textarea id="hikolog" rows="10" style={{ width: "100%" }} />
        </Page>
    );
}
