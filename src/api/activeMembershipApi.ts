import Api from './api';
import { type } from 'os';

export type PlastDegree = {
    id: number;
    name : string;
}
export type UserPlastDegree ={
    id: number;
    plastDegree : PlastDegree;
    dateStart : string;
    dateFinish: string;
    isCurrent: boolean;
}
export type UserPlastDegreePost ={
    plastDegreeId : number;
    dateStart : string;
    dateFinish: string;
    userId : string;
}
const getAccessLevelById = async (id : string) => {
    const response = await Api.get(`ActiveMembership/accessLevel/${id}`);

    return response.data;
};

const getAllPlastDegrees = async () : Promise<Array<PlastDegree>>=> {
    const response = await Api.get(`ActiveMembership/dergee`);

    return response.data;
};
 const getUserPlastDegrees = async (id : string) :Promise<Array<UserPlastDegree>>=> {
    const response = await Api.get(`ActiveMembership/dergee/${id}`);

    return response.data;
 }
export default{ getAccessLevelById, getAllPlastDegrees, getUserPlastDegrees };