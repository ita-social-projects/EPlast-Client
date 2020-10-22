import React, { useEffect, useLayoutEffect, useState } from "react";
import {Button} from "antd";
import googleImg from "../../assets/images/google.png";
import {GoogleLogin,GoogleLoginResponse} from 'react-google-login';
import styles from "./SignIn.module.css";




 
const GoogleLoginWrapper = (props:any) =>
{
    // setTimeout(()=>{}, 500)
    // console.log(props);
    function waitForElement(){
        if(props.googleIdProp == ""){
            // props.getIdprop();
            setTimeout(waitForElement, 700);
        }
      }
      useEffect(() => {
           waitForElement();
          //  setTimeout(() => {  console.log("World!"); }, 2000);
        //  debugger;
        //  getNotificationTypes().then(()=>{ console.log(googleId[0])});
          
        },[props.googleIdProp]);
    
      return(
        <GoogleLogin
            clientId= {props.googleIdProp} 
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
            onSuccess={props.handleGoogleResponseProp}
            // isSignedIn={true}
            onFailure={props.getIdprop}
            // onRequest={() => {
            //   googleId().then(res=>{setId(res.id)})}}
            // onAutoLoadFinished={googleId}
            cookiePolicy={'single_host_origin'}
          />
          )
}
export default GoogleLoginWrapper;

