export type Gender={
    id:number;
    name:string;
}
export type UserWork={
    placeOfWorkID:number|undefined;
    placeOfWorkList:Work[];
    positionID:number|undefined;
    positionList:Work[];
}
export type UserEducation={
    placeOfStudyID:number|undefined;
    placeOfStudyList:Education[];
    specialityID:number|undefined;
    specialityList:Education[];
}
export type Work={
    id:number;
    placeOfwork: string;
    position: string;
}
export type Education={
    id:number;
    placeOfStudy: string;
    speciality: string;
}
export type Degree={
    id:number;
    name:string;
}
export type Religion={
    id:number;
    name:string;
}
  export type Nationality={
    id:number;
    name:string;
}
export type User ={
    id:any;
    userProfileID:any;
    firstName: string;
    lastName: string;
    fatherName:string;
    imagePath:string;
    address: string;
    birthday: string;
    phoneNumber: string;
    gender: Gender;
    nationality: Nationality;
    religion: Religion;
    education: Education;
    degree: Degree;
    work: Work;
}
  
export type Data={
    user:User;
    educationView:UserEducation;
    workView:UserWork;
    nationalities:Nationality[];
    genders:Gender[];
    religions:Religion[];
    degrees:Degree[];
    imageBase64:string;
}