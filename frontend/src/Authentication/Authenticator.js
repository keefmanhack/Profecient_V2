import {getAccessToken, getRefreshToken, setTokens, clearTokens} from './Tokens';
import UserVerifier from '../APIRequests/User Verifier/UserVerifier';
const userVer = new UserVerifier();

export const isAuthenticated = () => !!getAccessToken();

export const logOut = () => {
  clearTokens();
  redirectToLogin();
}

export const authenticate = async () => {
    if (!getRefreshToken()) {
      try {
        const tokens= await userVer.getTokens(getRefreshToken());
  
        // you will have the exact same setters in your Login page/app too
        setTokens(tokens);
  
        return true
      } catch (error) {
        redirectToLogin()
        return false
      }
    }
  
    redirectToLogin()
    return false
  }

  const redirectToLogin = () => {
    window.location.replace('/login')
  }