import React from "react";
import { Button } from "antd";
import googleImg from "../../assets/images/google.png";
import { GoogleLogin } from 'react-google-login';
import styles from "./SignIn.module.css";


const GoogleLoginWrapper = (props: any) => {
    return (
        <GoogleLogin
            clientId={props.googleId}
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
            onSuccess={props.handleGoogleResponse}
            onFailure={props.getIdprop}
            cookiePolicy={'single_host_origin'}
        />
    )
}
export default GoogleLoginWrapper;

