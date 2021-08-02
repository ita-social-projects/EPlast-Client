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
export type UserPlastDegreePut ={
    userId : string;
    plastDegreeId : number;
    endDate : string;
}
export type UserDates ={
    dateEntry : string;
    dateOath : string | null
    dateEnd: string | null;
    userId : string;
}
const getAccessLevelById = async (id : string): Promise<string[]> => {
    const response = await Api.get(`ActiveMembership/accessLevel/${id}`);

    return response.data;
};

const getAllPlastDegrees = async () => {
    const response = await Api.get(`ActiveMembership/degree`);

    return response.data as PlastDegree[];
};

 const getUserPlastDegrees = async (id : string) : Promise<Array<UserPlastDegree>> => {
    const response = await Api.get(`ActiveMembership/degree/${id}`);

    return response.data;
 };

 const postUserPlastDegree = async (userPlastDegree : UserPlastDegreePost) =>{
     const response = await Api.post(`ActiveMembership/degree`, userPlastDegree);
        
     return response.data;
 };

 const removeUserPlastDegree = async (userId : string, userPlastDegreeId: number) =>{
    const response = await Api.remove(`ActiveMembership/degree/${userId}/${userPlastDegreeId}`);
       
    return response.data;
};
const setPlastDegreeAsCurrent = async (userId : string, userPlastDegreeId: number)=>{
    const response = await Api.put(`ActiveMembership/degree/setAsCurrent/${userId}/${userPlastDegreeId}`);
       
    return response.data;
}
const addEndDateForUserPlastDegree = async (userPlastDegreePut: UserPlastDegreePut) =>{
    const response = await Api.put(`ActiveMembership/degree/endDate`, userPlastDegreePut);
       
    return response.data;
}
const getUserDates = async (id : string) :Promise<UserDates>=> {
    const response = await Api.get(`ActiveMembership/dates/${id}`);

    return response.data;
 };
 const postUserDates = async (userDates : UserDates) =>{
     const response = await Api.post(`ActiveMembership/dates`, userDates);
        
     return response.data;
 };

export default
{ 
    getAccessLevelById,
    getAllPlastDegrees,
    getUserPlastDegrees,
    postUserPlastDegree,
    removeUserPlastDegree,
    setPlastDegreeAsCurrent,
    addEndDateForUserPlastDegree,
    getUserDates,
    postUserDates
};