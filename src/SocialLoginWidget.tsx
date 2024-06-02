import { useState, useRef, useEffect } from "react";

const DEFAULT_PATH = "/js/hiko-auth-headless.js";

export function SocialLoginWidget({
    shop,
    publicAccessToken,
    logout,
    refresh,
    baseUrl,
}: {
    shop: string;
    publicAccessToken: string;
    logout: Function;
    refresh: Function;
    baseUrl: string;
}) {
    const container = useRef<HTMLInputElement>(null);
    const [path, setPath] = useState(DEFAULT_PATH);

    useEffect(() => {
        if (!document.querySelector(`script[src*="${path}"]`)) {
            const script = document.createElement("script");
            script.src = `${baseUrl}${path}`;
            script.async = true;
            script.onload = () =>
                window.HIKO.render(container.current, shop, publicAccessToken);
            document.head.appendChild(script);
        } else {
            window.HIKO.render(container.current, shop, publicAccessToken);
        }
    }, [path]);

    useEffect(() => {
        logout(() => {
            window.HIKO.logout();
            window.HIKO.render(container.current, shop, publicAccessToken);
        });
    }, [logout]);

    useEffect(() => {
        refresh(() => {
            const found = document.querySelector(`script[src*="${path}"]`);
            if (found) {
                found.remove();
                window.HIKO.release();
                setPath(`${DEFAULT_PATH}?t=${Date.now()}`);
            }
        });
    }, [refresh]);

    return <div ref={container}></div>;
}
