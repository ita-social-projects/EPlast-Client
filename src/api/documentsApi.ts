import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';
import { successfulCreateAction, successfulEditAction, successfulDeleteAction } from "../components/Notifications/Messages"
import { DocumentOnCreateData, DocumentPost, MethodicDocumentType } from "../models/Documents/DocumentModels";

const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let { length } = bstr;
    const u8arr = new Uint8Array(length);

    while (length !== -1) {
        u8arr[length] = bstr.charCodeAt(length);
        length -= 1;
    }
    return new File([u8arr], filename, { type: mime });
}

const getById = async (id: number) => {
    const response: DocumentPost = await (await Api.get(`MethodicDocuments/${id}`)).data;
    return response;
};

const getAll = async () => {
    const { data } = await Api.get("MethodicDocuments");

    return data;
};
const getOnCreate = async () => {
    const data: DocumentOnCreateData = await (await Api.get(`MethodicDocuments/NewMethodicDocument`)).data;
    console.log(data);
    return data;
};

const getPdf = async (id: number) => {
    const data = await (await Api.get(`MethodicDocuments/createpdf/${id}`)).data;
    const binaryString = window.atob(data);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i += 1) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    };
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = window.URL.createObjectURL(blob);
    return link;
};

const post = async (data: any) => {
    const response = await Api.post("MethodicDocuments", data).then(response => {
        notificationLogic('success', successfulCreateAction("Документ"));
    })
        .catch(error => {
            notificationLogic('error', error.response.data.value);
        });
    return response;
};

const postForCheckFile = async (data: any) => {
    const response = await Api.post("MethodicDocuments/CheckFile", data)
        .catch(error => {
            notificationLogic('error', error.response.data.value);
        });
    return response;
};

const getFileAsBase64 = async (fileName: string) => {
    const response = await (await Api.get(`MethodicDocuments/downloadfile/${fileName}`)).data;
    const file = dataURLtoFile(response, fileName);
    const anchor = window.document.createElement('a');
    anchor.href = response;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
    return response;
}
const put = async (id: number, data: DocumentPost) => {
    const response = await Api.put(`MethodicDocuments/${id}`, data).then(response => {
        notificationLogic('success', successfulEditAction("Документ"));
    })
        .catch(error => {
            notificationLogic('error', error.response.data.value);
        });

    return response;
};

const remove = async (id: number) => {
    const response = await Api.remove(`MethodicDocuments/${id}`).then(response => {
        notificationLogic('success', successfulDeleteAction("Документ"));
    })
        .catch(error => {
            notificationLogic('error', error.response.data.value);
        });
    return response;
};

export const TypePostParser = (Type: MethodicDocumentType): number => {
    if (Type.value === "legislation") return 0;
    if (Type.value === "Methodics") return 1;
    return 2;
};
export const TypeGetParser = (Type: number): string => {
    if (Type === 0) return "Нормативний акт";
    if (Type === 1) return "Методичний документ";
    if (Type === 2) return "Інше";
    return "Не визначено";
};


export default { getById, getAll, getOnCreate, getPdf, getFileAsBase64, post, postForCheckFile, put, remove, TypePostParser, TypeGetParser };
