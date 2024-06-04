import { useState, useEffect, useCallback, useRef } from "react";
import { SocialLoginWidget } from "./SocialLoginWidget";
import "./demo.css";

export function Demo({
    shop,
    publicAccessToken,
    baseUrl = "https://apps.hiko.link",
}: {
    shop: string;
    publicAccessToken: string;
    baseUrl: string;
}) {
    const logoutCallbackRef = useRef<(() => void) | null>(null);
    const refreshCallbackRef = useRef<(() => void) | null>(null);
    const [customer, setCustomer] = useState(window.HIKO?.customer);

    const handleCustomEvents = useCallback((event: any) => {
        console.info(
            `catch event: ${JSON.stringify(event.detail, null, "  ")}`
        );

        if (["login", "activate", "multipass"].includes(event.detail.action))
            setCustomer(event.detail.customer);
        else if (event.detail.action !== "click")
            console.error(`unhandled action ${event.detail.action}`);
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
                    displayName
                    firstName
                    lastName
                    acceptsMarketing
                    phone
                    email
                    createdAt
                    updatedAt
                }
            }`,
        })
            .then((response) => response.json())
            .then((res) => {
                const value = {
                    ...res.data.customer,
                    ...customer,
                };
                setCustomer(value);
                window.HIKO.customer = value;
            })
            .catch((err) => console.error(err.message));
    }, [customer]);

    useEffect(() => {
        document.addEventListener("hiko", handleCustomEvents);
        return () => document.removeEventListener("hiko", handleCustomEvents);
    }, []);


    const logout = (callback: () => void) => {
        logoutCallbackRef.current = callback;
    };

    const refresh = (callback: () => void) => {
        refreshCallbackRef.current = callback;
    };

    return (
        <div className="main">
            <div className="widget">
                <SocialLoginWidget
                    shop={shop}
                    publicAccessToken={publicAccessToken}
                    logout={logout}
                    refresh={refresh}
                    baseUrl={baseUrl}
                ></SocialLoginWidget>

                <ShowCustomer customer={customer} />
            </div>

            <div className="panel">
                <button
                    onClick={() => {
                        if (refreshCallbackRef.current)
                            refreshCallbackRef.current();
                    }}
                >
                    Refresh
                </button>

                {customer ? (
                    <>
                        <button
                            onClick={() => {
                                if (logoutCallbackRef.current) {
                                    logoutCallbackRef.current();
                                    setCustomer(null);
                                }
                            }}
                        >
                            Logout
                        </button>

                        <button onClick={() => getCustomerDetail()}>
                            Customer detail
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
}

function ShowCustomer({ customer }: { customer: any }) {
    if (!customer) return <></>;
    return (
        <ul>
            {Object.keys(customer).map((key) => (
                <li key={key}>
                    {key}: {customer[key]}
                </li>
            ))}
        </ul>
    );
}
