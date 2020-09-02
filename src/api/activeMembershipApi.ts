import Api from './api';

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
    dateFinish: string | null;
    isCurrent: boolean;
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
 };

 const postUserPlastDegree = async (userPlastDegree : UserPlastDegreePost) =>{
     const response = await Api.post(`ActiveMembership/dergee`, userPlastDegree);
        
     return response.data;
 };

 const removeUserPlastDegree = async (userId : string, userPlastDegreeId: number) =>{
    const response = await Api.remove(`ActiveMembership/dergee/${userId}/${userPlastDegreeId}`);
       
    return response.data;
};
const setPlastDegreeAsCurrent = async (userId : string, userPlastDegreeId: number)=>{
    const response = await Api.put(`ActiveMembership/degree/setAsCurrent/${userId}/${userPlastDegreeId}`);
       
    return response.data;
}
export default
{ 
    getAccessLevelById,
    getAllPlastDegrees,
    getUserPlastDegrees,
    postUserPlastDegree,
    removeUserPlastDegree,
    setPlastDegreeAsCurrent
};