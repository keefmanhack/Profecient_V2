import axios from 'axios';

class LogoRequester{
    async findLogos(searchString){
        try{
            const endPoint = 'https://autocomplete.clearbit.com/v1/companies/suggest?query=' + searchString;
            const res = await axios.get(endPoint);
            return res.data;
        }catch(err){
            return [];
        }
    }
}

export default LogoRequester;