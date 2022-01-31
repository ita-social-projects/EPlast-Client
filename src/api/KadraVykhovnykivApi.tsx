import Api from "./api";
import { KadraTableSettings } from '../pages/KadraVykhovnykiv/Interfaces/KadraTableSettings';

const getAllKVs = async () => {
    const response = await Api.get("EducatorsStaff/kadras");
    return response;
  };
  

  const getAllKVTypes = async () => {
    const response = await Api.get("EducatorsStaff/kvTypes");
    return response;
  };


  const getAllKVswithGivenTypes = async (id: number) => {
    const response = await Api.get("EducatorsStaff/"+id);
    return response;
  };

  
  const getAllKVsOfGivenUser = async (UserId: string) => {
    const response = await Api.get("EducatorsStaff/UserKV/"+UserId);
    return response;
  };


  const putUpdateKadra = async (data: any) => {
    const response = await Api.put("EducatorsStaff/EditKadra", data);
    return response;
  };


  const deleteKadra = async (ID: number) => {
    const response = await Api.remove("EducatorsStaff/RemoveKadra/"+ID);
    return response;
  };

  

  const createKadra = async (data: any) => {
    const response = await Api.post("EducatorsStaff/CreateKadra", data);
    return response;
  };


  const doesUserHaveStaff = async (UserId:any, kadraId:number)=>{
    const response = await Api.get(`EducatorsStaff/${UserId}/${kadraId}`);
    return response;
  }
  
  
const doesRegisterNumberExist = async (numberInRegister:number)=>{
  const response = await Api.get(`EducatorsStaff/registerexist/${numberInRegister}`);
  return response;
}



const doesUserHaveStaffEdit = async (UserId:any, kadraId:number)=>{
  const response = await Api.get(`EducatorsStaff/edit/${UserId}/${kadraId}`);
  return response;
}


const doesRegisterNumberExistEdit = async (numberInRegister:number, kadraId:number)=>{
const response = await Api.get(`EducatorsStaff/edit/registerexist/${kadraId}/${numberInRegister}`);
return response;
}
 


const findUserByEduStaff = async (EduStaffId:number)=>{
  const response = await Api.get(`EducatorsStaff/findUserForRedirect/${EduStaffId}`);
  return response;
  }


  const GetStaffById = async (kadraId:number)=>{
    const response = await Api.get(`EducatorsStaff/GetEduStaffById/${kadraId}`);
    return response;
    }

    const getEducatorsStaffForTable = async (newTableSettings: KadraTableSettings) => {
      return (await Api.get(`EducatorsStaff/EducatorsStaffForTable`,newTableSettings, (params:any) =>{
        return Object.entries(params).map(([key, value])=>{
          if(Array.isArray(value) && value){
            return value.map(it => `${key}=${it}`).join('&');
          }
          return `${key}=${value}`;
        }).join('&');
      })
      .catch((error)=>{
        throw new Error(error);
      })).data;
  }

  export default {
    GetStaffById,
    findUserByEduStaff,
    doesRegisterNumberExistEdit,
    doesUserHaveStaffEdit,
    doesRegisterNumberExist,
    doesUserHaveStaff,
    createKadra,
    deleteKadra,
    putUpdateKadra,
    getAllKVsOfGivenUser,
    getAllKVswithGivenTypes,
    getAllKVTypes,
    getAllKVs,
    getEducatorsStaffForTable
  };
  