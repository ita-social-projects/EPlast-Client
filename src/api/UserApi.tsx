import axios from 'axios';
import BASE_URL from '../config';
import AuthStore from '../stores/AuthStore';
import jwt_decode from 'jwt-decode';
import api from './api';

const getById = async (id: string | undefined) => {
    const response = await axios.get(`${`${BASE_URL}User/`}${id}`);

    return response;
};
const getUserProfileById = async (currentUserId: string | undefined, focusUserId: string | undefined) => {
    const response = await axios.get(`${`${BASE_URL}User/`}${currentUserId}/${focusUserId}`);

    return response;
};
const getImage = async (imageName: string | undefined) => {
    const response = await axios.get(`${`${BASE_URL}User/getImage`}/${imageName}`);

    return response;
};
const edit = async (id: string) => {
    const response = await axios.get(`${`${BASE_URL}User/edit`}/${id}`);

    return response;
};
const put = async (data: any) => {
    const response = await axios.put(`${`${BASE_URL}User/editbase64`}`, data);

    return response;
};

const getUserProfileAccess = async (userid: string, focusUserId: string) => {
    const response = await axios.get(`${`${BASE_URL}UserAccess/GetUserProfileAccess/${userid}/${focusUserId}`}`)
    .catch(error => {
        throw error;
    });
    
    return response;
}

const getUserMenuAccess = async (userid: string) => {
    const response = await api.get(`UserAccess/GetUserMenuAccess/${userid}`)
    .catch(error => {
        throw error;
    });
    
    return response;
}

const getApprovers = async (userId: string, approverId: string) => {
    const response = await axios.get(`${`${BASE_URL}User/approvers/${userId}/${approverId}`}`);

    return response;
};
const deleteApprove = async (confirmedId: number) => {
    const response = await axios.delete(`${`${BASE_URL}User/deleteApprove/${confirmedId}`}`);

    return response;
};
const approveUser = async (userId: string, isClubAdmin: boolean, isCityAdmin: boolean) => {
    const response = await axios.post(`${`${BASE_URL}User/approveUser/${userId}/${isClubAdmin}/${isCityAdmin}`}`);

    return response;
};
const updateProfileImage = async (userid: string, imageName: string) => {
    const response = await axios.put(`${`${BASE_URL}User/photo`}/${userid}`, JSON.stringify(imageName));
    return response;
};

const getActiveUserRoles = (): string[] => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = [].concat(decodedJwt[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ]);

    return roles;
};

const getActiveUserId = () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt_decode(token);

    return user.nameid as string;
};

const getActiveUserProfile = async () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;

    const res = await getById(decodedJwt.nameid);
    return res.data.user;
}

export default {
    getById,
    getUserProfileById,
    getImage,
    edit,
    put,
    getApprovers,
    deleteApprove,
    approveUser,
    getActiveUserRoles,
    getActiveUserId,
    getActiveUserProfile,
    updateProfileImage,
    getUserProfileAccess,
    getUserMenuAccess
};