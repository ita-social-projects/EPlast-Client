import axios from 'axios';
import Api from './api'
import BASE_URL from '../config';

    const getById =  async (id: string|undefined) => {const response = await Api.getById("User",id);
        return  response;};
    const getImage =  async (imageName : string|undefined) => {const response = await axios.get(`${`${BASE_URL  }User/getImage`}/${imageName}`);
        return response ;};
    const edit=async (id:string)=>{const response=await axios.get(`${`${BASE_URL  }User/edit`}/${id}`);
        return response;};
    const put=async(data:any)=>{const response=await axios.put(`${`${BASE_URL  }User/editbase64`}`,data);
        return response;};

export default {getById,getImage,edit,put};