import React from "react";
import facebookImg from "../../assets/images/facebook.png";
import FacebookLogin from 'react-facebook-login';
import styles from "./SignIn.module.css";


const FacebookLoginWrapper = (props: any) => {
   const responseFacebook = (response: any) => {
      console.log(response)
      debugger
      if (response.status !== "unknown") {
         props.handleFacebookResponse(response);
      }
   }
   return (

      <FacebookLogin
         appId={props.appId}
         callback={responseFacebook}
         cssClass={styles.btnFacebook}
         fields="name,email,picture,birthday,address,education,gender,religion"
         scope="public_profile,email,user_gender,user_hometown,user_location,user_age_range"
         icon={<span id={styles.imgSpanFacebook}>
            <img
               alt="Facebook icon"
               className={styles.socialImg}
               src={facebookImg}
            />
         </span>}
         textButton="&nbsp;Facebook"

      />
   )
}
export default FacebookLoginWrapper;

