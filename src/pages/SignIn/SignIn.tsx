import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Switcher from "../SignUp/Switcher/Switcher";
import googleImg from "../../assets/images/google.png";
import styles from "./SignIn.module.css";
import facebookImg from "../../assets/images/facebook.png";
import { checkEmail } from "../SignUp/verification";
import { Link } from 'react-router-dom';
import AuthorizeApi from '../../api/authorizeApi';
import { useHistory } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthStore from '../../stores/AuthStore';
import GoogleLogin from 'react-google-login';

let authService = new AuthorizeApi();
let user: any;
export default function () {
  const [form] = Form.useForm();
  const history = useHistory();
 
  const responseGoogle = async (response:any) => {
    console.log(response);
    await authService.sendToken(response.tokenId);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    history.push(`/userpage/main/${user.nameid}`);
    window.location.reload();
  }
  const initialValues = {
    Email: "",
    Password: "",
    RememberMe: true,
  };

  const validationSchema = {
    Email: [
      { required: true, message: "Поле електронна пошта є обов'язковим" },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: "Поле пароль є обов'язковим" },
      { min: 6, message: "Мінімальна допустима довжина - 6 символів" },
    ]
  };

  const handleSubmit = async (values: any) => {
    await authService.login(values);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    history.push(`/userpage/main/${user.nameid}`);
    window.location.reload();
  };


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
        <GoogleLogin
         clientId="595575738840-spdo3o49i30fuc39icvrl1n5aiureubv.apps.googleusercontent.com"
          render={renderProps => (
            <Button onClick={renderProps.onClick} disabled={renderProps.disabled} id={styles.googleBtn} className={styles.socialButton}>
            <span id={styles.imgSpanGoogle}>
              <img
                alt="Google icon"
                className={styles.socialImg}
                src={googleImg}
               />
             </span>
              <span className={styles.btnText}>Google</span>
            </Button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            //isSignedIn={true}
            cookiePolicy={'single_host_origin'}
          />
          <Button id={styles.facebookBtn} className={styles.socialButton}>
            <span id={styles.imgSpanFacebook}>
              <img
                alt="Facebook icon"
                className={styles.socialImg}
                src={facebookImg}
              />
            </span>
            <span className={styles.btnText}>Facebook</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}
