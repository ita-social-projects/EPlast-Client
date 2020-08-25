import Api from "./api";


const getAllKVs = async () => {
    const response = await Api.get("KadraVykhovnykiv/kadras");
    return response;
  };
  

  const getAllKVTypes = async () => {
    const response = await Api.get("KadraVykhovnykiv/kvTypes");
    return response;
  };


  const getAllKVswithGivenTypes = async (id: number) => {
    const response = await Api.get("KadraVykhovnykiv/"+id);
    return response;
  };

  
  const getAllKVsOfGivenUser = async (UserId: string) => {
    const response = await Api.get("KadraVykhovnykiv/UserKV/"+UserId);
    return response;
  };


  const putUpdateKadra = async (data: any) => {
    const response = await Api.put("KadraVykhovnykiv/EditKadra", data);
    return response;
  };


  const deleteKadra = async (ID: number) => {
    const response = await Api.remove("KadraVykhovnykiv/RemoveKadra/"+ID);
    return response;
  };

  

  const createKadra = async (data: any) => {
    const response = await Api.put("KadraVykhovnykiv/CreateKadra", data);
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
  