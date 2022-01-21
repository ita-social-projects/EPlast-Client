import Api from './api';

export type PlastDegree = {
    id: number;
    name : string;
}
export type UserPlastDegree ={
    id: number;
    plastDegree : PlastDegree;
    dateStart : string;
}
export type UserPlastDegreePost ={
    plastDegreeId : number;
    dateStart : string;
    userId : string;
}
export type UserPlastDegreePut ={
    userId : string;
    plastDegreeId : number;
}
export type UserEntryAndOathDates ={
    dateOath : string | null;
    dateEntry : string | null;
    userId : string;
}
export type UserDates ={
    dateEntry : string;
    dateOath : string | null;
    dateEnd: string | null;
    userId : string;
}
const getAccessLevelById = async (id : string) => {
    const response = await Api.get(`ActiveMembership/accessLevel/${id}`);

    return response.data;
};

const getAllPlastDegrees = async () => {
    const response = await Api.get(`ActiveMembership/degree`);

    return response.data as PlastDegree[];
};

 const getUserPlastDegree = async (id : string) : Promise<UserPlastDegree> => {
    const response = await Api.get(`ActiveMembership/degree/${id}`);

    return response.data as UserPlastDegree;
 };

 const postUserPlastDegree = async (userPlastDegree : UserPlastDegreePost) =>{
     const response = await Api.post(`ActiveMembership/degree`, userPlastDegree);
        
     return response.data;
 };

 const removeUserPlastDegree = async (userId : string, userPlastDegreeId: number) =>{
    const response = await Api.remove(`ActiveMembership/degree/${userId}/${userPlastDegreeId}`);
       
    return response.data;
};

const getUserDates = async (id : string) :Promise<UserDates>=> {
    const response = await Api.get(`ActiveMembership/dates/${id}`);

    return response.data;
 };
 const postUserEntryAndOathDates = async (userDates : UserEntryAndOathDates) =>{
     const response = await Api.post(`ActiveMembership/dates`, userDates);
     
     return response.data;
 };

export default
{ 
    getAccessLevelById,
    getAllPlastDegrees,
    getUserPlastDegree,
    postUserPlastDegree,
    removeUserPlastDegree,
    getUserDates,
    postUserEntryAndOathDates
};