import axios from 'axios';
import {getAccessToken} from '../Authentication/Tokens';

const BASE_URL = 'http://localhost:8080';

//axios configuration
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = getAccessToken();
// axios.defaults.headers.common = {'Authorization': getAccessToken()}

export default axios;