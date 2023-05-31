import React, { useState, useEffect, useCallback, useRef } from "react";
import { SocialLoginWidget } from "./SocialLoginWidget";
import "./demo.css";

const shop = "xxxx.myshopify.com";

export default function Demo() {
    const publicAccessToken = "ad37ca1f4764e9048e9bafaf82cb475e";
    const logoutCallbackRef = useRef();
    const refreshCallbackRef = useRef();
    const [customer, setCustomer] = useState(window.HIKO?.customer);

    const logout = useCallback((callback) => {
        logoutCallbackRef.current = callback;
    }, []);

    const refresh = useCallback((callback) => {
        refreshCallbackRef.current = callback;
    }, []);

    const handleCustomEvents = useCallback((event) => {
        console.info(`catch event: ${JSON.stringify(event.detail, null, "  ")}`);

        if (["login", "activate", "multipass"].includes(event.detail.action)) setCustomer(event.detail.customer);
        else console.error(`unhandled action ${event.detail.action}`);
    }, []);

    const getCustomerDetail = useCallback(() => {
        fetch(`https://${shop}/api/2023-04/graphql.json`, {
            headers: {
                "Content-Type": "application/graphql",
                "X-Shopify-Storefront-Access-Token": publicAccessToken,
            },
            method: "POST",
            body: `query {
                customer(customerAccessToken: "${customer.accessToken}") { 
                    id
                    firstName
                    lastName
                    acceptsMarketing
                    phone
                    email
                    tags 
                    metafields(identifiers: []) {
                        id
                        value
                    }
                }
            }`,
        })
            .then((response) => response.json())
            .then((res) => setCustomer({ ...res.data.customer, ...customer }))
            .catch((err) => console.error(err.message));
    });

    useEffect(() => {
        document.addEventListener("hiko", handleCustomEvents);
        return () => document.removeEventListener("hiko", handleCustomEvents);
    }, []);

    return (
        <div className="main">
            <div className="widget">
                <SocialLoginWidget
                    shop={shop}
                    publicAccessToken={publicAccessToken}
                    logout={logout}
                    refresh={refresh}
                ></SocialLoginWidget>

                {customer ? (
                    <ul>
                        {Object.keys(customer).map((key) => (
                            <li key={key}>
                                {key}: {customer[key]}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>

            <div className="panel">
                <button onClick={() => refreshCallbackRef.current()}>Refresh</button>

                {customer ? (
                    <>
                        <button
                            onClick={() => {
                                logoutCallbackRef.current();
                                setCustomer();
                            }}
                        >
                            Logout
                        </button>

                        <button onClick={() => getCustomerDetail()}>Customer detail</button>
                    </>
                ) : null}
            </div>
        </div>
    );
}
