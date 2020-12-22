import axios from 'axios';
import {getAccessToken} from '../Authentication/Tokens';

//axios configuration
axios.defaults.headers.common['Authorization'] = getAccessToken();

export default axios;