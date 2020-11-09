import Cookies from 'js-cookie';
const accessToken = 'access_token';
const refreshToken = 'refresh_token';

export const getAccessToken = () => Cookies.get(accessToken);
export const getRefreshToken = () => Cookies.get(refreshToken);

export const setTokens = tokens => {
    Cookies.set(accessToken, tokens.access_token, { expires: calcOneHour()});
    Cookies.set(refreshToken, tokens.refresh_token);
}

const calcOneHour = () => {
    const expires = (60 * 60) * 1000
    const inOneHour = new Date(new Date().getTime() + expires);
    return inOneHour;
}