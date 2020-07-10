import axios from 'axios';
import Api from './api'
import BASE_URL from '../config';

    const getById =  async (id: number | string|undefined) => {const response = await Api.getById("User", id);
return  response;};
    const getImage =  async (imageName : string|undefined) => {const response = await axios.get(`${`${BASE_URL  }User/getImage`}/${imageName}`);
return response ;};
    

export default {getById,getImage};