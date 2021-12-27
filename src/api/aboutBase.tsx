import Section from "../models/AboutBase/SectionModel";
import Subsection from "../models/AboutBase/SubsectionModel";
import api from "./api";

const getAboutBaseSectionById = async (id:number)=>{
    return await api.get(`AboutBase/AboutBaseSection/${id}`,id);
};

const getAboutBaseSubsectionById = async (id: number)=>{
    return await api.get(`AboutBase/AboutBaseSubsection/${id}`,id);
};

const getAboutBaseSections = async () =>{
    return await api.get(`AboutBase/AboutBaseSections`);
};

const getAboutBaseSubsections = async () =>{
    return await api.get(`AboutBase/AboutBaseSubsections`);
};

const getSubsectionPictures = async (subsectionId: number) =>{
    return await api.get(`AboutBase/${subsectionId}/pictures`, subsectionId)
}

const deleteAboutBaseSection = async (id:number) =>{
    return await api.remove(`AboutBase/DeleteSection/${id}`,id);
};

const deleteAboutBaseSubsection = async(id:number)=>{
    return await api.remove(`AboutBase/DeleteSubsection/${id}`,id);
};

const removeSubsectionPicture = async(id: number) => {
    return await api.remove(`AboutBase/pictures/${id}`, id)
}

const addAboutBaseSection = async (data: Section)=>{
    return await api.post(`AboutBase/AboutBaseSection/Create`,data);
};

const addAboutBaseSubsection = async (data:Subsection)=>{
    return await api.post(`AboutBase/AboutBaseSubsection/Create`,data);
};

const uploadSubsectionPictures = async (subsectionId: number, data: any) => {
    debugger;
    return await api.post(`AboutBase/${subsectionId}/subsectionPictures`, data)
}

const editAboutBaseSection = async (data:Section)=>{
    return await api.put(`AboutBase/EditSection/${data.id}`,data);
};

const editAboutBaseSubsection = async (data:Subsection)=>{
    return await api.put(`AboutBase/EditSubsection/${data.id}`,data);
};

export default {
    getAboutBaseSectionById,
    getAboutBaseSubsectionById,
    getAboutBaseSections,
    getAboutBaseSubsections,
    getSubsectionPictures,
    deleteAboutBaseSection,
    deleteAboutBaseSubsection,
    removeSubsectionPicture,
    editAboutBaseSection,
    editAboutBaseSubsection,
    addAboutBaseSection,
    addAboutBaseSubsection,
    uploadSubsectionPictures
};