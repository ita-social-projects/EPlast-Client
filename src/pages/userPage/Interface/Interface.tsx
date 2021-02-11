export type Gender={
    id:number;
    name:string;
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
export type UpuDegree={
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
    birthday: Date;
    phoneNumber: string;
    gender: Gender;
    nationality: Nationality;
    religion: Religion;
    education: Education;
    degree: Degree;
    work: Work;
    pseudo: string;
    email: string;
    city: string;
    club: string;
    publicPoliticalActivity: string;
    upuDegree: UpuDegree;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
}

export type ShortUser ={
    id:any;
    userProfileID:any;
    firstName: string;
    lastName: string;
    fatherName:string;
    imagePath:string;
    pseudo: string;
    city: string;
    club: string;
    upuDegree: UpuDegree;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
}

export  interface Data {
    isUserPlastun:boolean;
    timeToJoinPlast:number;
    user:User;
    shortUser:ShortUser;
  }
  export interface Approver{
    id:number;
    user:User;
    userID:string;
    confirmedUser:ConfirmedUser;
}
  export interface ConfirmedUser{
    id:number;
    user:User;
    userID:string;
    approverId:string
    approver:Approver;
    confirmDate:Date;
    isClubAdmin:boolean;
    isCityAdmin:boolean;
}
  export interface ApproversData{
      user:User;
      confirmedUsers:ConfirmedUser[];
      canApprove:boolean;
      timeToJoinPlast:number;
      clubApprover:ConfirmedUser;
      cityApprover:ConfirmedUser;
      isUserPlastun:boolean;
      isUserHeadOfClub:boolean;
      isUserHeadOfRegion:boolean;
      isUserHeadOfCity:boolean;
      currentUserId:string;
  }