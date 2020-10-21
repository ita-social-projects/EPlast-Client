import React, { useEffect, useState } from "react";
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
import { ApiFilled } from "@ant-design/icons";
import api from "../../api/api";
import { string } from "yup";

let authService = new AuthorizeApi();
let user: any;
const googleId = "710369145500-ur2qfp5292p16458pfvg4oieu7eqmca7.apps.googleusercontent.com";
// let googleId:string; 
// const getId = async()=>{ 
// const id = await authService.getGoogleId()
// googleId=id.id;
//   console.log(googleId);
// };
// let id:string ;
//   // let id='';
// const googleId = ()=> authService.getGoogleId().then(res=>{console.log(res); setTimeout(() => {  console.log("World!"); }, 2000); id=res.data.id});
// googleId();
  // useEffect(() => {
  //   googleId().then(res=>{id=res.id})
    
  // });
export default function () {
  const [form] = Form.useForm();
  const history = useHistory();
  // const [googleId, setGoogleId] = useState("") ;

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

  const handleGoogleResponse = async (response:any) => {
    await authService.sendToken(response.tokenId);
    const token = AuthStore.getToken() as string;
    user = jwt(token);
    history.push(`/userpage/main/${user.nameid}`);
    window.location.reload();
  }
  const getNotificationTypes = () => {
    // await  authService.getGoogleId()
    // .then((response) => {
    //   console.log(response.id)
    //   googleId.push(response.id)
    // })
    // console.log(googleId[0])
    return "710369145500-ur2qfp5292p16458pfvg4oieu7eqmca7.apps.googleusercontent.com";
  }

//   const getId =  ():string=>
//   {
//     const id =  authService.getGoogleId();
//  debugger;
//     return id;
//   }
  useEffect(() => {
    // getId()
    //  setTimeout(() => {  console.log("World!"); }, 2000);
  //  debugger;
  //  getNotificationTypes().then(()=>{ console.log(googleId[0])});
    
  });
  // const retryGoogleRequest = async (request:any) => {
    
  // }
  // const [id, setId] = useState('') ;
  // // let id='';
  // const googleId = async()=> authService.getGoogleId();
  
  // useEffect(() => {
  //   googleId().then(res=>{setId(res.id)})
    
  // });

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
  <p>{getNotificationTypes()}</p>
        <GoogleLogin
         clientId= {googleId} 
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
            onSuccess={handleGoogleResponse}
            // onFailure={getNotificationTypes}
            // onRequest={() => {
            //   googleId().then(res=>{setId(res.id)})}}
            // onAutoLoadFinished={googleId}
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
