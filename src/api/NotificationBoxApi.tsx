import Api from './api';

export type NotificationType = {
    id: number;
    name : string;
}
export type UserNotification ={
    id: number;
    notificationTypeId: number; 
    checked : boolean;
    message : string;
    ownerUserId : string;
    senderLink : string;
    senderName : string;
    createdAt : string;
    checkedAt? : string;
}

export type UserNotificationPost ={
    notificationTypeId: number; 
    message : string;
    ownerUserId : string;
    senderLink : string;
    senderName : string;
}

const getAllUserNotifications = async (id : string) : Promise<Array<UserNotification>>=> {
    const response = await Api.get(`NotificationBox/getNotifications/${id}`);

    return response.data;
};

const getAllNotificationTypes = async () :Promise<Array<NotificationType>>=> {
    const response = await Api.get(`NotificationBox/getTypes`);

    return response.data;
};

const postUserNotifications = async (userNotifications : Array<UserNotificationPost>) =>{
     const response = await Api.post(`NotificationBox/addNotifications`, userNotifications);
     
     return response.data;
 };

const SetCheckedAllUserNotification = async (notificationIds : Array<number>) =>{
    const response = await Api.post(`NotificationBox/setCheckNotifications/setChecked`, notificationIds);
       
    return response.data;
};

const removeUserNotifications = async (userId : string) =>{
    const response = await Api.remove(`NotificationBox/removeAllNotifications/${userId}`);
       
    return response.data;
};

const removeNotification = async (notificationId : number) =>{
    const response = await Api.remove(`NotificationBox/removeNotification/${notificationId}`);
    return response.data;
};

const createNotifications = async (userIds : Array<string>, 
                                   message : string, 
                                   NotifiType : number, 
                                   senderLink? : string,
                                   senderName? : string
                                   ) => 
{
    let notifications : UserNotificationPost[] = [];
    
    for (let i = 0; i < userIds.length; i++) {
        notifications.push(
           {
               notificationTypeId: NotifiType,
               message: message,
               ownerUserId: userIds[i],
               senderLink: senderLink? senderLink : "",
               senderName: senderName? senderName : ""
           }
        ); 
    }

    await postUserNotifications(notifications);
}

export default
{ 
    createNotifications,
    removeUserNotifications,
    removeNotification,
    postUserNotifications,
    SetCheckedAllUserNotification,
    getAllNotificationTypes,
    getAllUserNotifications
};