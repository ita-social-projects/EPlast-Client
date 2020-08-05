import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';
<<<<<<< HEAD
import AuthStore from '../stores/Auth';
=======
import AuthStore from '../stores/AuthStore';
>>>>>>> origin

export default class AuthorizeApi{

  static isSignedIn(): boolean {
    return !!AuthStore.getToken();
  }

  login = async(data: any) =>{
<<<<<<< HEAD
    const response = await Api.post("Account/signin", data)
=======
    const response = await Api.post("Auth/signin", data)
>>>>>>> origin
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
<<<<<<< HEAD
  const response = await Api.post("Account/signup", data)
=======
  const response = await Api.post("Auth/signup", data)
>>>>>>> origin
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
<<<<<<< HEAD
  const response = await Api.post("Account/forgotPassword", data)
=======
  const response = await Api.post("Auth/forgotPassword", data)
>>>>>>> origin
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
<<<<<<< HEAD
  const response = await Api.post("Account/resetPassword", data)
=======
  const response = await Api.post("Auth/resetPassword", data)
>>>>>>> origin
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

<<<<<<< HEAD
 /*resetPasswordGet = async() =>{
   const response = await Api.getAll("Account/ResetPassword")
   .then(response =>{
     //history.push("/");
   })
 };*/
/*Added some changes for example*/

 changePassword = async(data : any) => {
  const response = await Api.post("Account/changePassword", data)
=======

 changePassword = async(data : any) => {
  const response = await Api.post("Auth/changePassword", data)
>>>>>>> origin
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
<<<<<<< HEAD
  const response = await Api.post("Account/sendQuestion", data)
=======
  const response = await Api.post("Auth/sendQuestion", data)
>>>>>>> origin
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
