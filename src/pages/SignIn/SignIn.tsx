import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Switcher from "../SignUp/Switcher/Switcher";
import styles from "./SignIn.module.css";
import { checkEmail } from "../SignUp/verification";
import { Link, useLocation } from "react-router-dom";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import jwt from "jwt-decode";
import AuthLocalStorage from "../../AuthLocalStorage";
import GoogleLoginWrapper from "../SignIn/GoogleLoginWrapper";
import FacebookLoginWrapper from "../SignIn/FacebookLoginWrapper";
import FacebookData from "../SignIn/FacebookDataInterface";
import "../SignIn/SignIn.less";
import { emptyInput, minLength } from "../../components/Notifications/Messages";
import openNotificationWithIcon from "../../components/Notifications/Notification";

let authService = new AuthorizeApi();
let user: any;

const useSignInParams = () => {
  const queryString = useLocation().search;
  const userId = new URLSearchParams(queryString).get('userId');
  const token = new URLSearchParams(queryString).get('token');
  return {
    userId: userId,
    token: token,
  }
}

const SignIn: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [googleId, setGoogleId] = useState("");
  const [facebookAppId, setFacebookAppId] = useState("");
  const [googleLoading, setGoogleLoading] = useState(true);
  const [facebookLoading, setFacebookLoading] = useState(true);
  const params = useSignInParams();


  const validator = {
    Email: [
      { required: true, message: emptyInput() },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: emptyInput() },
      { min: 8, message: minLength(8) },
    ],
  };

  const handler = {
    form: {
      submit: async (values: any) => {
        await authService.login(values);
        const token = AuthLocalStorage.getToken() as string;
        user = jwt(token);
        history.push(`/userpage/main/${user.nameid}`);
        window.location.reload();
      }
    },
    googleBtn: {
      click: async (response: any) => {
        await authService.sendToken(response.tokenId);
        const token = AuthLocalStorage.getToken() as string;
        user = jwt(token);
        history.push(`/userpage/main/${user.nameid}`);
        window.location.reload();
      },
    },
    facebookBtn: {
      click: async (response: FacebookData) => {
        await authService.sendFacebookInfo(response);
        const token = AuthLocalStorage.getToken() as string;
        user = jwt(token);
        history.push(`/userpage/main/${user.nameid}`);
        window.location.reload();
      }
    }
  }

  const confirmationEmail = async () => {
    const { userId, token } = params;
    if (userId !== null && token !== null) {
      await authService.confirmEmail(userId, token);
    }
  }

  const getGoogleId = async () => {
    await authService.getGoogleId()
      .then((data) => {
        setGoogleId(data.id);
      })
      .catch((exc) => {
        console.log(exc);
      });

    setGoogleLoading(false);
  };

  const getFacebookId = async () => {
    await authService.getFacebookId()
      .then((data) => {
        setFacebookAppId(data.id);
      })
      .catch((exc) => {
        console.log(exc);
      });

    setFacebookLoading(false);
  };

  useEffect(() => {
    confirmationEmail();
    getGoogleId();
    getFacebookId();
  }, []);


  const initialValues = {
    Email: "",
    Password: "",
    RememberMe: true,
  };

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignIn" />
      <Form
        layout="vertical"
        name="SignInForm"
        initialValues={initialValues}
        form={form}
        onFinish={handler.form.submit}
        hideRequiredMark={true}
      >
        <Form.Item label="Пошта" name="Email" rules={validator.Email}>
          <Input
            placeholder="Введіть електронну пошту"
          />
        </Form.Item>
        <Form.Item label="Пароль" name="Password" rules={validator.Password}>
          <Input.Password
            visibilityToggle={true}
            placeholder="Введіть пароль"
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className={styles.rememberMe}>Запам`ятати мене</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton}>
            Увійти
          </Button>
        </Form.Item>
        <Link className={styles.forgot} to="/forgotPassword">
          Забули пароль?
        </Link>
        <div className={styles.GoogleFacebookLogin}>
          {googleLoading ? (
            ""
          ) : (
            <GoogleLoginWrapper
              googleId={googleId}
              handleGoogleResponse={handler.googleBtn.click}
            ></GoogleLoginWrapper>
          )}
          {facebookLoading ? (
            ""
          ) : (
            <FacebookLoginWrapper
              appId={facebookAppId}
              handleFacebookResponse={handler.facebookBtn.click}
            ></FacebookLoginWrapper>
          )}
        </div>
      </Form>
    </div>
  );
}

export default SignIn