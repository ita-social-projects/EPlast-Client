import notificationLogic from "../components/Notifications/Notification";
import FacebookData from "../pages/SignIn/FacebookDataInterface";
import AuthStore from "../stores/AuthStore";
import Api from "./api";

export default class AuthorizeApi {
  static isSignedIn(): boolean {
    return !!AuthStore.getToken();
  }

  login = async (data: any) => {
    const response = await Api.post("Login/signin", data)
      .then((response) => {
        if (response.data.token !== null) {
          AuthStore.setToken(response.data.token);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  register = async (data: any) => {
    const response = await Api.post("Auth/signup", data)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  forgotPassword = async (data: any) => {
    const response = await Api.post("Password/forgotPassword", data)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  resetPassword = async (data: any) => {
    const response = await Api.post("Password/resetPassword", data)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  changePassword = async (data: any) => {
    const response = await Api.post("Password/changePassword", data)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  logout = async () => {
    AuthStore.removeToken();
  };

  sendQuestionAdmin = async (data: any) => {
    const response = await Api.post("Auth/sendQuestion", data)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  resendEmailForRegistering = async (userId: string) => {
    const response = await Api.post(`Auth/resendEmailForRegistering/${userId}`)
      .then((response) => {
        notificationLogic("success", response.data.value);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  sendToken = async (token: string) => {
    const response = await Api.post(`Login/signin/google/?googleToken=${token}`)
      .then((response) => {
        if (response.data.token !== null) {
          AuthStore.setToken(response.data.token);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return response;
  };

  getGoogleId = async () => {
    const response = await Api.get("Login/GoogleClientId");
    return response.data;
  };

  sendFacebookInfo = async (response: FacebookData) => {
    const respon = await Api.post(
      `Login/signin/facebook`,
      JSON.stringify(response)
    )
      .then((respon) => {
        if (respon.data.token !== null) {
          AuthStore.setToken(respon.data.token);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", error.response.data.value);
        }
      });
    return respon;
  };

  getFacebookId = async () => {
    const response = await Api.get("Login/FacebookAppId");
    return response.data;
  };
}
