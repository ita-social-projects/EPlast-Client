import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Switcher from "../SignUp/Switcher/Switcher";
import googleImg from "../../assets/images/google.png";
import styles from "./SignIn.module.css";
import facebookImg from "../../assets/images/facebook.png";
import { checkEmail } from "../SignUp/verification";

export default function () {
  const [form] = Form.useForm();

  const initialValues = {
    email: "",
    password: "",
    remember: true,
  };

   const validationSchema = {
     Email: [
       { required: true, message: "Поле електронна пошта є обов'язковим" },
       { validator: checkEmail },
     ],
     Password: [
       { required: true, message: "Поле пароль є обов'язковим" },
       { min: 6, message: "Мінімальна допустима довжина - 6 символів" },
     ],
   };

  const handleSubmit = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignIn" />
      <Form
        name="SignInForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input
            className={styles.SignInInput}
            placeholder="Електронна пошта"
          />
        </Form.Item>
        <Form.Item name="Password" rules={validationSchema.Password} >
          <Input.Password
            visibilityToggle={false}
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
        <p className={styles.forgot}>Забули пароль?</p>
        <div className={styles.GoogleFacebookLogin}>
          <Button id={styles.googleBtn} className={styles.socialButton}>
            <span id={styles.imgSpanGoogle}>
              <img
                alt="Google icon"
                className={styles.socialImg}
                src={googleImg}
              />
            </span>
            <span className={styles.btnText}>Google</span>
          </Button>
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
