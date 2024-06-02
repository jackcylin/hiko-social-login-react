import * as react_jsx_runtime from 'react/jsx-runtime';

declare function SocialLoginWidget({ shop, publicAccessToken, logout, refresh, baseUrl, }: {
    shop: string;
    publicAccessToken: string;
    logout: Function;
    refresh: Function;
    baseUrl: string;
}): react_jsx_runtime.JSX.Element;

declare function Demo({ shop, publicAccessToken, baseUrl, }: {
    shop: string;
    publicAccessToken: string;
    baseUrl: string;
}): react_jsx_runtime.JSX.Element;

export { Demo, SocialLoginWidget };
