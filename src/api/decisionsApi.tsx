import Api from './api'

  const getById =  async (id: number) => {
    const response = await Api.get("Decisions",id);
  return  response;};
    
  const getAll =  async () =>{
  const response =  await Api.get("Decisions");
  console.log(response.data.item2);
  const  res = response.data.item2.map((d: { decisionWrapper: { decision: any; }; }) => d.decisionWrapper.decision);
  console.log("-------------------------");
  console.log(res);
  return response;}
  const getOnCreate = async () => {
    const response = await Api.get("Decisions/NewDecision");
    return response;};

  const post = async (data : any) => {
    const response = await Api.post("Decisions",data);
    return response;};

  const put = async (data : any) =>{
    const response = await Api.put("Decisions",data);
    return response;}
  
  const remove = async (id : number) => {
    const response = await Api.put("Decisions",id);
    return response;}

export default {getById, getAll, post, put, remove, getOnCreate};