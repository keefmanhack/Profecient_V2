import axios from 'axios';


const BASE_URL = 'http://localhost:8080';

//axios configuration
axios.defaults.baseURL = BASE_URL;



export default axios;