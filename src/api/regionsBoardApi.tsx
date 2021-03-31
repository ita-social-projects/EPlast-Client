import api from "./api";

export const getUserAccess = async (userId: string) => {
    return await api.get(`RegionsBoard/GetUserAccesses/${userId}`, userId)
    .catch( error => {
         throw error;
         } 
    );
}  
