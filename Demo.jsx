// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback, useRef } from "react";
import { SocialLoginWidget } from "hiko-social-login-react";
import "./demo.css";

export function Demo({
  shop,
  publicAccessToken,
  baseUrl = "https://apps.hiko.link",
}) {
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
      .then((res) => {
        const value = { ...res.data.customer, ...customer };
        setCustomer(value);
        window.HIKO.customer = value;
      })
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
          setCustomer={setCustomer}
          logout={logout}
          refresh={refresh}
          baseUrl={baseUrl}
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
