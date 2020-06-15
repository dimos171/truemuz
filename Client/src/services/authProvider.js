import "regenerator-runtime/runtime.js";
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
 
// Msal Configurations
const config = {
  auth: {
    authority: 'https://truemuz.b2clogin.com/truemuz.onmicrosoft.com/B2C_1_spa-react',
    clientId: '4696c1b9-b3b3-4b66-850e-4a8466ab7bc5',
    validateAuthority: false,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};
 
// Authentication Parameters
const authenticationParameters = {
  scopes: [
    'https://truemuz.onmicrosoft.com/4696c1b9-b3b3-4b66-850e-4a8466ab7bc5/truemuz-scope',
  ],
};
 
// Options
const options = {
  loginType: LoginType.Redirect,
  //tokenRefreshUri: window.location.origin + '/auth.html',
};
 
export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);