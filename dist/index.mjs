// src/SocialLoginWidget.tsx
import { useState, useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var DEFAULT_PATH = "/js/hiko-auth-headless.js";
function SocialLoginWidget({
  shop,
  publicAccessToken,
  logout,
  refresh,
  baseUrl
}) {
  const container = useRef(null);
  const [path, setPath] = useState(DEFAULT_PATH);
  useEffect(() => {
    if (!document.querySelector(`script[src*="${path}"]`)) {
      const script = document.createElement("script");
      script.src = `${baseUrl}${path}`;
      script.async = true;
      script.onload = () => window.HIKO.render(container.current, shop, publicAccessToken);
      document.head.appendChild(script);
    }
    logout(() => {
      window.HIKO.logout();
      window.HIKO.render(container.current, shop, publicAccessToken);
    });
    refresh(() => {
      const found = document.querySelector(`script[src*="${path}"]`);
      if (found) {
        found.remove();
        window.HIKO.release();
        setPath(`${DEFAULT_PATH}?t=${Date.now()}`);
      }
    });
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: container });
}

// src/Demo.tsx
import { useState as useState2, useEffect as useEffect2, useCallback, useRef as useRef2 } from "react";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function Demo({
  shop,
  publicAccessToken,
  baseUrl = "https://apps.hiko.link"
}) {
  const logoutCallbackRef = useRef2(null);
  const refreshCallbackRef = useRef2(null);
  const [customer, setCustomer] = useState2(window.HIKO?.customer);
  const handleCustomEvents = useCallback((event) => {
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
        "X-Shopify-Storefront-Access-Token": publicAccessToken
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
            }`
    }).then((response) => response.json()).then((res) => {
      const value = {
        ...res.data.customer,
        ...customer
      };
      setCustomer(value);
      window.HIKO.customer = value;
    }).catch((err) => console.error(err.message));
  }, [customer]);
  useEffect2(() => {
    document.addEventListener("hiko", handleCustomEvents);
    return () => document.removeEventListener("hiko", handleCustomEvents);
  }, []);
  const logout = (callback) => {
    logoutCallbackRef.current = callback;
  };
  const refresh = (callback) => {
    refreshCallbackRef.current = callback;
  };
  return /* @__PURE__ */ jsxs("div", { className: "main", children: [
    /* @__PURE__ */ jsxs("div", { className: "widget", children: [
      /* @__PURE__ */ jsx2(
        SocialLoginWidget,
        {
          shop,
          publicAccessToken,
          logout,
          refresh,
          baseUrl
        }
      ),
      /* @__PURE__ */ jsx2(ShowCustomer, { customer })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => {
            if (refreshCallbackRef.current)
              refreshCallbackRef.current();
          },
          children: "Refresh"
        }
      ),
      customer ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            onClick: () => {
              if (logoutCallbackRef.current) {
                logoutCallbackRef.current();
                setCustomer(null);
              }
            },
            children: "Logout"
          }
        ),
        /* @__PURE__ */ jsx2("button", { onClick: () => getCustomerDetail(), children: "Customer detail" })
      ] }) : null
    ] })
  ] });
}
function ShowCustomer({ customer }) {
  if (!customer)
    return /* @__PURE__ */ jsx2(Fragment, {});
  return /* @__PURE__ */ jsx2("ul", { children: Object.keys(customer).map((key) => /* @__PURE__ */ jsxs("li", { children: [
    key,
    ": ",
    customer[key]
  ] }, key)) });
}
export {
  Demo,
  SocialLoginWidget
};
//# sourceMappingURL=index.mjs.map