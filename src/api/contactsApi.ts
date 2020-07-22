import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';

const sendQuestionAdmin = async (data: any) => {
    const response = await Api.post("Home/sendFeedback", data)
    .then(response =>{
      notificationLogic('success', response.data.value);
    })
    .catch(error => {
      if(error.response.status === 400){
        notificationLogic('error', error.response.data.value);
      }
    });
    return response;
  };


  export default {sendQuestionAdmin};