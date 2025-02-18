"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Demo: () => Demo,
  SocialLoginWidget: () => SocialLoginWidget
});
module.exports = __toCommonJS(index_exports);

// src/SocialLoginWidget.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_PATH = "/js/hiko-auth-headless.js";
function SocialLoginWidget({
  shop,
  publicAccessToken,
  logout,
  refresh,
  baseUrl
}) {
  const container = (0, import_react.useRef)(null);
  const [path, setPath] = (0, import_react.useState)(DEFAULT_PATH);
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: container });
}

// src/Demo.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function Demo({
  shop,
  publicAccessToken,
  baseUrl = "https://apps.hiko.link"
}) {
  const logoutCallbackRef = (0, import_react2.useRef)(null);
  const refreshCallbackRef = (0, import_react2.useRef)(null);
  const [customer, setCustomer] = (0, import_react2.useState)(window.HIKO?.customer);
  const handleCustomEvents = (0, import_react2.useCallback)((event) => {
    console.info(
      `catch event: ${JSON.stringify(event.detail, null, "  ")}`
    );
    if (["login", "activate", "multipass"].includes(event.detail.action))
      setCustomer(event.detail.customer);
    else if (event.detail.action !== "click")
      console.error(`unhandled action ${event.detail.action}`);
  }, []);
  const getCustomerDetail = (0, import_react2.useCallback)(() => {
    fetch(`https://${shop}/api/2023-04/graphql.json`, {
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Storefront-Access-Token": publicAccessToken
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
  (0, import_react2.useEffect)(() => {
    document.addEventListener("hiko", handleCustomEvents);
    return () => document.removeEventListener("hiko", handleCustomEvents);
  }, []);
  const logout = (callback) => {
    logoutCallbackRef.current = callback;
  };
  const refresh = (callback) => {
    refreshCallbackRef.current = callback;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "main", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "widget", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        SocialLoginWidget,
        {
          shop,
          publicAccessToken,
          logout,
          refresh,
          baseUrl
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ShowCustomer, { customer })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          onClick: () => {
            if (refreshCallbackRef.current)
              refreshCallbackRef.current();
          },
          children: "Refresh"
        }
      ),
      customer ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { onClick: () => getCustomerDetail(), children: "Customer detail" })
      ] }) : null
    ] })
  ] });
}
function ShowCustomer({ customer }) {
  if (!customer) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, {});
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { children: Object.keys(customer).map((key) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { children: [
    key,
    ": ",
    customer[key]
  ] }, key)) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Demo,
  SocialLoginWidget
});
//# sourceMappingURL=index.js.map