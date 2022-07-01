import { showUserRenewalModal } from "../pages/UserRenewal/UserRenewalModals";
import notificationLogic from "../components/Notifications/Notification";
import FacebookData from "../pages/SignIn/FacebookDataInterface";
import AuthLocalStorage from "../AuthLocalStorage";
import Api from "./api";

export default class AuthorizeApi {
  static isSignedIn(): boolean {
    return !!AuthLocalStorage.getToken();
  }

  login = async (data: any) => {
    const response = await Api.post("Login/signin", data)
      .then((response) => {
        if (response.data.token !== null) {
          AuthLocalStorage.setToken(response.data.token);
        }
      })
      .catch(async (error) => {
        if (error.response.data.value == "User-FormerMember") {
          showUserRenewalModal();
        }
        switch (error.response.status) {
          case 400:
            notificationLogic("error", 'Щось пішло не так');
            break;
          case 409:
            notificationLogic("error", 'Ваша пошта не підтверджена');
            break;
        }
      });
    return response;
  };

  register = async (data: any) => {
    const response = await Api.post("Auth/signup", data)
      .then((response) => {
        notificationLogic("success", "Вам на пошту прийшов лист з підтвердженням");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", "Щось пішло не так");
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
    AuthLocalStorage.removeToken();
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

  confirmEmail = async (userId: string, token: string) => {
    const encodedToken = encodeURI(token);
    const response = Api.post(`Auth/confirmEmail?userId=${userId}&token=${encodedToken}`)
      .then((response) => {
        notificationLogic("success", 'Пошта підтверджена');
      })
      .catch((error) => {
        switch (error.response.status) {
          case 400:
            notificationLogic("error", "Щось пішло не так")
            break;
          case 404:
            notificationLogic("error", "Данного користувача не існує")
            break;
          case 409:
            notificationLogic("info", "Пошта вже підтверджена")
            break;
          case 410:
            notificationLogic("info", "На вашу пошту надійшов новий лист на підтвердження профіля");
            break;
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
          AuthLocalStorage.setToken(response.data.token);
        }
      })
      .catch((error) => {
        if (error.response.data.value == "User-FormerMember") {
          showUserRenewalModal();
        } else if (error.response.status === 400) {
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
          AuthLocalStorage.setToken(respon.data.token);
        }
      })
      .catch((error) => {
        if (error.response.data.value == "User-FormerMember") {
          showUserRenewalModal();
        } else if (error.response.status === 400) {
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
