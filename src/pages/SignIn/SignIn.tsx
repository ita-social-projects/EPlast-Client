import React, { useEffect, useLayoutEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Switcher from "../SignUp/Switcher/Switcher";
import styles from "./SignIn.module.css";
import { checkEmail } from "../SignUp/verification";
import { Link } from 'react-router-dom';
import AuthorizeApi from '../../api/authorizeApi';
import { useHistory } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthStore from '../../stores/AuthStore';
import GoogleLoginWrapper from '../SignIn/GoogleLoginWrapper';
import FacebookLoginWrapper from '../SignIn/FacebookLoginWrapper';
import FacebookData from '../SignIn/FacebookDataInterface';
import '../SignIn/SignIn.less';
import{emptyInput, minLength} from "../../components/Notifications/Messages"

let authService = new AuthorizeApi();
let user: any;

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();
  const [googleId, setGoogleId] = useState("");
  const [facebookAppId, setFacebookAppId] = useState("");
  const [googleLoading, setGoogleLoading] = useState(true);
  const [facebookLoading, setFacebookLoading] = useState(true);

  const initialValues = {
    Email: "",
    Password: "",
    RememberMe: true,
  };

  const validationSchema = {
    Email: [
      { required: true, message: emptyInput() },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: emptyInput() },
      { min: 6, message: minLength(6) },
    ]
  };

  const handleSubmit = async (values: any) => {
    await authService.login(values);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    var prevPage = localStorage.getItem('pathName');
    if(prevPage){
      history.push(prevPage);
      localStorage.removeItem('pathName');
    }else{
    history.push(`/userpage/main/${user.nameid}`);
  }
  window.location.reload();
  };

  const handleGoogleResponse = async (response: any) => {
    await authService.sendToken(response.tokenId);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    history.push(`/userpage/main/${user.nameid}`);
    window.location.reload();
  }

  const handleFacebookResponse = async (response: FacebookData) => {
    await authService.sendFacebookInfo(response);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    history.push(`/userpage/main/${user.nameid}`);
    window.location.reload();
  }

  const getId = async () => {
    await authService.getGoogleId().then(
      (data) => {
        setGoogleId(data.id);
      }
    ).catch(exc => { console.log(exc) });

    setGoogleLoading(false);
  }

  const getAppId = async () => {
    await authService.getFacebookId().then(
      (data) => {
        setFacebookAppId(data.id);
      }
    ).catch(exc => { console.log(exc) });

    setFacebookLoading(false);
  }

  useEffect(() => {

    getId();
    getAppId();

  }, []);

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignIn" />
      <Form
        name="SignInForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input
            className={styles.SignInInput}
            placeholder="Електронна пошта"
          />
        </Form.Item>
        <Form.Item name="Password" rules={validationSchema.Password} >
          <Input.Password
            visibilityToggle={true}
            className={styles.SignInInput}
            placeholder="Пароль"
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
        <Link className={styles.forgot} to="/forgotPassword">Забули пароль</Link>
        <div className={styles.GoogleFacebookLogin}>
          {googleLoading ? (
            ''
          ) : (
              <GoogleLoginWrapper googleId={googleId} handleGoogleResponse={handleGoogleResponse}></GoogleLoginWrapper>
            )}
          {facebookLoading ? (
            ''
          ) : (
              <FacebookLoginWrapper appId={facebookAppId} handleFacebookResponse={handleFacebookResponse}></FacebookLoginWrapper>
            )}
        </div>
      </Form>
    </div>
  );
}
