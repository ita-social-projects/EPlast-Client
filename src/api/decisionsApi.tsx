import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';
export type Decision = {
  id: number;
  name: string;
  organization: string;
  decisionStatusType: string;
  decisionTarget : string;
  description: string;
  date : string;
  fileName: string | null;
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
  fileAsBase64: string | null;
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
};
const dataURLtoFile = (dataurl : string, filename: string)=>{
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let {length} = bstr;
  const u8arr = new Uint8Array(length);

while(length !== 0){
  u8arr[length] = bstr.charCodeAt(length);
  length-=1;
}

return new File([u8arr], filename, {type:mime});
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
    const response = await Api.post("Decisions",data).then(response =>{
      notificationLogic('success', "Рішення успішно додано");
    })
    .catch(error => {
        notificationLogic('error', error.response.data.value);
    });
    return response;
  };
const getFileAsBase64 = async (fileName: string) =>{
  const response = await (await Api.get(`Decisions/downloadfile/${fileName}`)).data;
  const file = dataURLtoFile(response, fileName);
  const anchor = window.document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
}
  const put = async (id: number, data : DecisionPost) =>{
    const response = await Api.put(`Decisions/${id}`,data).then(response =>{
      notificationLogic('success', "Рішення успішно змінено");
    })
    .catch(error => {
        notificationLogic('error', error.response.data.value);
    });
    
    return response;
  };
  
  const remove = async (id : number) => {
    const response = await Api.remove(`Decisions/${id}`).then(response =>{
      notificationLogic('success',  "Рішення успішно видалено");
    })
    .catch(error => {
        notificationLogic('error', error.response.data.value);
    });
    return response;
  };
    

export default {getById, getAll, getOnCreate,getPdf,getFileAsBase64, post, put, remove};