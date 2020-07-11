import Api from "./api";
import notificationLogic from '../components/Notifications/Notification';
import AuthStore from '../stores/Auth';


export default class AuthorizeApi{
  
  static isSignedIn(): boolean {
    return !!AuthStore.getToken();
  }

  login = async(data: any) =>{
    const response = await Api.post("Account/signin", data)
     .then(response =>{
         AuthStore.setToken(response.data.token);
     })
     .catch(error =>{
       notificationLogic('error', error.responce.data.value);
     })
     return response;
  };


  register = async (data: any) => {
  const response = await Api.post("Account/signup", data)
  .then(response =>{
    notificationLogic('success', response.data.value);
  })
  .catch(error => {
    if(error.response.status == 400){
      notificationLogic('error', error.response.data.value);
    }
  });
  return response;
};


  forgotPassword = async(data : any) => {
  const response = await Api.post("Account/forgotPassword", data)
  .then(response =>{
    notificationLogic('success', response.data.value);
  })
  .catch(error => {
    if(error.response.status == 400){
      notificationLogic('error', error.response.data.value);
    }
  });
  return response;
};

 resetPassword = async(data : any) => {
  const response = await Api.post("Account/resetPassword", data)
  .then(response =>{
    notificationLogic('success', response.data.value);
  })
  .catch(error => {
    if(error.response.status == 400){
      notificationLogic('error', error.response.data.value);
    }
  });
  return response;
};


 changePassword = async(data : any) => {
  const response = await Api.post("Account/changePassword", data)
  .then(response =>{
    notificationLogic('success', response.data.value);
  })
  .catch(error => {
    if(error.response.status == 400){
      notificationLogic('error', error.response.data.value);
    }
  });
  return response;
};

  logout = async() =>{
    console.log('hello');
   AuthStore.removeToken();
   const response = await Api.getAll("Account/logout")
   .then(response =>{
       console.log(response);
   })
   .catch(error =>{
     console.log(response);
   })
 };
}