import Api from "./api";


const getAllKVs = async () => {
    const response = await Api.get("kadras");
    return response;
  };
  

  const getAllKVTypes = async () => {
    const response = await Api.get("kvTypes");
    return response;
  };


  const getAllKVswithGivenTypes = async (id: number) => {
    const response = await Api.get(""+id);
    return response;
  };

  
  const getAllKVsOfGivenUser = async (UserId: string) => {
    const response = await Api.get("UserKV/"+UserId);
    return response;
  };


  const putUpdateKadra = async (data: any) => {
    const response = await Api.put("EditKadra", data);
    return response;
  };


  const deleteKadra = async (ID: number) => {
    const response = await Api.remove("RemoveKadra/"+ID);
    return response;
  };

  

  const createKadra = async (data: any) => {
    const response = await Api.put("CreateKadra", data);
    return response;
  };

  
  
  export default {
    createKadra,
    deleteKadra,
    putUpdateKadra,
    getAllKVsOfGivenUser,
    getAllKVswithGivenTypes,
    getAllKVTypes,
     getAllKVs
  };
  