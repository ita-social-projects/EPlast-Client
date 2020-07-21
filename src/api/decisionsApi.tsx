import Api from './api'

export type Decision = {
  id: number;
  name: string;
  organization: string;
  decisionStatusType: string;
  decisionTarget : string;
  description: string;
  date : string;
}
export type FileWrapper = {
  FileAsBase64: string | null;
  FileName : string | null;
}
export type Organization = {
  id : number;
  organizationName: string;
}
export type decisionTarget ={
  id : number;
  targetName: string;
}

export type decisionStatusType ={
  text: string;
  value: string;
}
export type DecisionOnCreateData = {
  organizations: Organization[];
  decisionStatusTypeListItems :decisionStatusType[];
  decisionTargets : decisionTarget[];
}
export type DecisionWrapper = {
  decision: DecisionPost;
  decisionTargets:  decisionTarget[] | null;
  file: string | null;
}
export type DecisionPost  ={
  id: number;
  name: string;
  decisionStatusType: number;
  organization: Organization ;
  decisionTarget: decisionTarget;
  description: string;
  date: string;
  fileName: string | null;
}
  const getById =  async (id: number)=> {
    const response : DecisionPost = await (await Api.get(`Decisions/${id}`)).data;
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
  const getPdf = async (id: number) => {
    const data = await (await Api.get(`Decisions/createpdf/${id}`)).data;
    const binaryString = window.atob(data);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i += 1) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
      };
    const blob = new Blob([bytes], {type: "application/pdf"});
    const link = window.URL.createObjectURL(blob);
    return  link;
  };
  const post = async (data : any) => {
    const response = await Api.post("Decisions",data);
    return response;
  };

  const put = async (id: number, data : DecisionPost) =>{
    const response = await Api.put(`Decisions/${id}`,data);
    
    return response;
  };
  
  const remove = async (id : number) => {
    const response = await Api.remove(`Decisions/${id}`);
    return response;
  };
    

export default {getById, getAll, getOnCreate,getPdf, post, put, remove};