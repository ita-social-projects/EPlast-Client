import Api from './api';

export type NotificationType = {
    id: number;
    name : string;
}
export type UserNotification ={
    id: number;
    // notificationType : NotificationType;
    checked : boolean;
    message : string;
    OwneruserId : string;
    userName : string;
    userLink : string;
    date : string;
}

const getAllUserNotifications = async (id : string) : Promise<Array<UserNotification>>=> {
    const response = await Api.get(`Notifications/all/${id}`);

    return response.data;
};

 const getAllNotificationTypes = async () :Promise<Array<NotificationType>>=> {
    const response = await Api.get(`Notifications/all`);

    return response.data;
 };

 const postUserNotification = async (userNotification : UserNotification) =>{
     const response = await Api.post(`Notifications`, userNotification);
        
     return response.data;
 };

 const removeUserNotification = async (userId : string, userNotificationId: number) =>{
    const response = await Api.remove(`Notifications/${userId}/${userNotificationId}`);
       
    return response.data;
};

export default
{ 
    removeUserNotification,
    postUserNotification,
    getAllNotificationTypes,
    getAllUserNotifications
};