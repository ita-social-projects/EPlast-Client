import Api from "./api";

const register = async (data: any) => {
  const response = await Api.post("Account/signup", data);
  return response;
};

/* const getById =  async (id: number) => {const response = await Api.getById("Decisions",id);
return  response;};
    
  const getAll =  async () =>{const response =  await Api.getAll("Decisions");
  return response;}

  const post = async (data : any) => {const response = await Api.post("Decisions",data);
  return response;};

  const put = async (data : any) =>{const response = await Api.put("Decisions",data);
  return response;}
  
  const remove = async (id : number) => {const response = await Api.put("Decisions",id);
  return response;} */

export default { register };
