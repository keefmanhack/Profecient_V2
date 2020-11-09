import {getAccessToken, getRefreshToken, setTokens} from './Tokens';
import UserVerifier from '../APIRequests/UserVerifier';
const userVer = new UserVerifier();

export const isAuthenticated = () => !!getAccessToken();

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
    console.log('aclled');
    window.location.replace('/login')
  }