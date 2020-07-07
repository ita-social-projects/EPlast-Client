import Api from './api'

export type Decision = {
  id: number;
  name: string;
  organization: string;
  statusType: string;
  target : string;
  description: string;
}
  const getById =  async (id: number) => {const response = await Api.get(`Decisions/${id}`);
return  response;};
    
  const getAll =  async() =>{
    const {data} = await Api.get("Decisions");
    console.log(data)
    return data;}

  const post = async (data : any) => {const response = await Api.post("Decisions",data);
  return response;};

  const put = async (data : any) =>{const response = await Api.put("Decisions",data);
  return response;}
  
  const remove = async (id : number, data: any) => {const response = await Api.put(`Decisions/${id}`,data);
  return response;}

export default {getById, getAll, post, put, remove};