import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';
import AuthStore from '../stores/AuthStore';

export default class AuthorizeApi{

  static isSignedIn(): boolean {
    return !!AuthStore.getToken();
  }

  login = async(data: any) =>{
    const response = await Api.post("Auth/signin", data)
     .then(response =>{
       if(response.data.token !== null){
        AuthStore.setToken(response.data.token);
       }
     })
     .catch(error =>{
      if(error.response.status === 400){
        notificationLogic('error', error.response.data.value);
      }
     })
     return response;
  };


  register = async (data: any) => {
  const response = await Api.post("Auth/signup", data)
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

  forgotPassword = async(data : any) => {
  const response = await Api.post("Auth/forgotPassword", data)
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

 resetPassword = async(data : any) => {
  const response = await Api.post("Auth/resetPassword", data)
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


 changePassword = async(data : any) => {
  const response = await Api.post("Auth/changePassword", data)
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

  logout = async() =>{
    window.location.reload(false);
    AuthStore.removeToken();
 };
  
 sendQuestionAdmin = async (data: any) => {
  const response = await Api.post("Auth/sendQuestion", data)
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

}
