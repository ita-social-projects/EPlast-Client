<<<<<<< HEAD
=======

>>>>>>> origin
import axios from 'axios';
import Api from './api'
import BASE_URL from '../config';

<<<<<<< HEAD
    const getById =  async (id: string|undefined) => {const response = await Api.get(`User/${id}`);
=======
    const getById =  async (id: string|undefined) => {const response = await axios.get(`${`${BASE_URL  }User/`}${id}`);
>>>>>>> origin
        return  response;};
    const getImage =  async (imageName : string|undefined) => {const response = await axios.get(`${`${BASE_URL  }User/getImage`}/${imageName}`);
        return response ;};
    const edit=async (id:string)=>{const response=await axios.get(`${`${BASE_URL  }User/edit`}/${id}`);
        return response;};
    const put=async(data:any)=>{const response=await axios.put(`${`${BASE_URL  }User/editbase64`}`,data);
        return response;};
<<<<<<< HEAD

export default {getById,getImage,edit,put};
=======
    const getApprovers =  async (userId: string,approverId: string) => {const response = await axios.get(`${`${BASE_URL}User/approvers/${userId}/${approverId}`}`);
        return  response;};
    const deleteApprove =  async (confirmedId: number) => {const response = await axios.delete(`${`${BASE_URL}User/deleteApprove/${confirmedId}`}`);
        return  response;};
    const approveUser =  async (userId: string, isClubAdmin:boolean, isCityAdmin:boolean ) => {const response = await axios.post(`${`${BASE_URL}User/approveUser/${userId}/${isClubAdmin}/${isCityAdmin}`}`);
        return  response;};

export default {getById,getImage,edit,put,getApprovers,deleteApprove,approveUser};
>>>>>>> origin
