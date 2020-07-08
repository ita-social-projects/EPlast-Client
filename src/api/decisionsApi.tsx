import Api from './api'

export type Decision = {
  id: number;
  name: string;
  organization: string;
  statusType: string;
  target : string;
  description: string;
}
export type DecisionOnCreateData = {
  organizations: Organization[];
  decisionStatusTypeListItems: decisionStatusType[];
  decisionTargets : decisionTarget[];
}
type Organization ={
  id : number;
  organizationName: string;
}
type decisionTarget ={
  id : number;
  targetName: string;
}
 export type decisionStatusType ={
  text: string;
  value: string;
}
export type DecisionWrapper = {
  decision: DecisionPost;
  decisionTargets: null| decisionTarget[];
  file: null|string;
  filename: null|string;
}
type DecisionPost ={
  id: number;
  name: string;
  decisionStatusType: number;
  organization: Organization;
  decisionTarget: decisionTarget;
  description: string;
  date: string;
  haveFile: boolean;
}
  const getById =  async (id: number) => {
    const response = await Api.get(`Decisions/${id}`);
    return  response;
  };
    
  const getAll =  async() =>{
    const {data} = await Api.get("Decisions");
    console.log(data)
    return data;
  };
  const getOnCreate = async () => {
    const data : DecisionOnCreateData = await (await Api.get(`Decisions/NewDecision`)).data;
    console.log(data);
    return  data;
  };
  const post = async (data : any) => {
    const response = await Api.post("Decisions",data);
    return response;
  };

  const put = async (data : any) =>{
    const response = await Api.put("Decisions",data);
    return response;
  };
  
  const remove = async (id : number, data: any) => {
    const response = await Api.put(`Decisions/${id}`,data);
    return response;
  };
    

export default {getById, getAll, getOnCreate, post, put, remove};