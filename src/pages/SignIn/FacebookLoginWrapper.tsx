import React from "react";
import {Button} from "antd";
import facebookImg from "../../assets/images/facebook.png";
 import FacebookLogin from 'react-facebook-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import FacebookLogin from "../../../node_modules/react-facebook-login/dist/facebook-login"
import styles from "./SignIn.module.css";


const FacebookLoginWrapper = (props:any) =>
{
   const responseFacebook = (response:any)=> {
        console.log(response);
        props.handleFacebookResponse(response);
      }
       return(
      
      <FacebookLogin
  appId={props.appId}
  // appId="763821184212782"
  // autoLoad
  // size="small"
  textButton=""
  callback={responseFacebook}
  cssClass={styles.socialButton}
  // onClick={responseFacebook}
  fields="name,email,picture"
  scope="public_profile,email"
  icon={<span id={styles.facebookBtn} className={styles.SignIn_facebookBtn__2od1x}>
            <span id={styles.imgSpanFacebook}>
             <img
                alt="Facebook icon"
                className={styles.socialImg}
                src={facebookImg}
              />
           </span>
            <span className={styles.btnText}>Facebook</span>
         </span>}
  // icon={<img
  //                  alt="Facebook icon"
  //                  className={styles.socialImg}
  //                  src={facebookImg}
  //                />}
  
  // onClick={responseFacebook}
  // render={renderProps => (
  //   <button onClick={renderProps.onClick}>This is my custom FB button</button>
  // )}
  // render={renderProps => (
  //   <Button id={styles.facebookBtn} onClick={renderProps.onClick} className={styles.socialButton}>
  //          <span id={styles.imgSpanFacebook}>
  //           <img
  //               alt="Facebook icon"
  //             className={styles.socialImg}
  //              src={facebookImg}
  //            />
  //         </span>
  //          <span className={styles.btnText}>Facebook</span>
  //       </Button>
  // )}
/>
          )
}
export default FacebookLoginWrapper;

