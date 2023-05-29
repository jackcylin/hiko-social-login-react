import React, { useCallback, useRef, useEffect } from "react";

export function SocialLoginWidget({
    shop,
    baseUrl = "https://apps.hiko.link",
    path = "/js/hiko-auth-headless.js",
}) {
    const container = useRef();

    const createScript = useCallback((document, baseUrl, path) => {
        if (document.querySelector(`script[src*="${path}"]`)) return Promise.resolve();

        return new Promise((resolve) => {
            let script = document.createElement("script");
            script.src = `${baseUrl}${path}`;
            script.async = "async";
            document.head.appendChild(script);
            script.onload = resolve;
        });
    });

    useEffect(() => {
        createScript(document, baseUrl, path).then(() => {
            if (shop) window.HIKO.render(shop, container.current);
        });
    }, [path]);

    return <div ref={container}></div>;
}
