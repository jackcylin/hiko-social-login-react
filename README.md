# hiko-social-login-react

-   [HIKO Social Login](https://apps.shopify.com/simple-social-login) is a Shopify social login app.
-   The module provides a React component [SocialLoginWidget](https://github.com/jackcylin/hiko-social-login-react/blob/main/SocialLoginWidget.jsx) and sample codes to integrate with Hydrogen app.

## Installation

```shell
$ npm i hiko-social-login-react --save
or
$ yarn add hiko-social-login-react
```

## Sample code

```js
const shop = "xxxx.myshopify.com";

const [customer, setCustomer] = useState(window.HIKO?.customer);

const handleCustomEvents = useCallback((event) => {
    if (["login", "activate", "multipass"].includes(event.detail.action))
        setCustomer(event.detail.customer);
}, []);

useEffect(() => {
    document.addEventListener("hiko", handleCustomEvents);
    return () => document.removeEventListener("hiko", handleCustomEvents);
}, []);

if (customer)
    return (
        <ul>
            {Object.keys(customer).map((key) => (
                <li key={key}>
                    {key}: {customer[key]}
                </li>
            ))}
        </ul>
    );

return <SocialLoginWidget shop={shop} publicAccessToken={publicAccessToken}></SocialLoginWidget>;
```

### Note:

-   full sample [Demo.jsx](https://github.com/jackcylin/hiko-social-login-react/blob/main/src/Demo.tsx)
-   Install [Headless](https://apps.shopify.com/headless) to generate publicAccessToken

## REST API

Headless storefronts can call the app's REST endpoints directly under
`/apps/authapp/:action`.

### Authentication

Every request is authenticated with an **HMAC-SHA256 signature over the query
string**, keyed by your shop's Hydrogen `publicAccessToken`:

1. Collect all query params **except** `signature`.
2. Sort the keys alphabetically.
3. Join them as `key=value` pairs with `&` — plain string, no URL-encoding, no leading `?`.
4. `HMAC-SHA256(message, publicAccessToken)`, hex-encoded, sent as the `signature` param.

> Sign on the server — the `publicAccessToken` is a signing secret and must never
> be exposed in browser code. Have your storefront call your own server route,
> which signs and forwards the request.

### `DELETE /apps/authapp/disconnect`

Remove **one** social-provider connection from a customer. The customer profile is
kept; only the link to the named provider is deleted. Idempotent — safe to retry.

| Query param   | Required | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| `customer_id` | yes      | Shopify customer id or GID.                                  |
| `social`      | yes      | Provider name, e.g. `google`, `facebook`, `apple`, `line`.   |
| `shop`        | yes      | Shop domain, e.g. `xxxx.myshopify.com`.                      |
| `signature`   | yes      | HMAC-SHA256 hex of the other params (see Authentication).    |

Response `200`:

```json
{ "customer_id": "gid://shopify/Customer/123", "social": "facebook", "removed": true }
```

`removed` is `false` when the customer had no such connection. Errors use
`{ "error": string }` with `400` (bad param), `401` (signature mismatch),
`404` (customer not found), or `500`.

```js
import { createHmac } from "crypto";

async function disconnectSocial(shop, publicAccessToken, customerId, social) {
    const params = { customer_id: customerId, shop, social };
    const message = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&");
    const signature = createHmac("sha256", publicAccessToken)
        .update(message)
        .digest("hex");

    const query = new URLSearchParams({ ...params, signature });
    const res = await fetch(`https://${shop}/apps/authapp/disconnect?${query}`, {
        method: "DELETE",
    });
    return res.json(); // { customer_id, social, removed }
}
```
