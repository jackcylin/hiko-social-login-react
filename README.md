# hiko-social-login-react

 - [HIKO Social Login](https://apps.shopify.com/simple-social-login) is a Shopify social login app. 
 - The module provides a React component [SocialLoginWidget](https://github.com/jackcylin/hiko-social-login-react/blob/main/SocialLoginWidget.jsx) and sample codes to integrate with Hydrogen app.
 - Hydrogen app integration is a feature included in the Premium plan of [HIKO Social Login](https://apps.shopify.com/simple-social-login) 

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
    return (<ul>
                {Object.keys(customer).map((key) => (
                    <li key={key}>
                        {key}: {customer[key]}
                    </li>
                ))}
    </ul>);
    
return (<SocialLoginWidget shop={shop} publicAccessToken={publicAccessToken}
    ></SocialLoginWidget>);

```

### Note:
 - full sample [Demo.jsx](https://github.com/jackcylin/hiko-social-login-react/blob/main/Demo.jsx)
 - Install [Headless](https://apps.shopify.com/headless) to generate publicAccessToken

