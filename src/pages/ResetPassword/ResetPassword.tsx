import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "../ResetPassword/ResetPassword.module.css";
import AuthorizeApi from "../../api/authorizeApi";
import { checkEmail } from "../SignUp/verification";
import { useLocation, useHistory } from "react-router-dom";
import {
  emptyInput,
  incorrectEmail,
  minLength,
} from "../../components/Notifications/Messages";

let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();

  const validationSchema = {
    Email: [
      { required: true, message: incorrectEmail },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: emptyInput() },
      { min: 6, message: minLength(6) },
    ],
    ConfirmPassword: [
      { required: true, message: emptyInput() },
      { min: 6, message: minLength(6) },
    ],
  };

  const handleSubmit = async (values: any) => {
    const newPassword = {
      email: values.Email,
      password: values.Password,
      confirmPassword: values.ConfirmPassword,
      code: query.get("token"),
    };
    await authService.resetPassword(newPassword);
    history.push("/signin");
  };

  const initialValues = {
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Code: "",
  };

  return (
    <div className={styles.mainContainerReset}>
      <Form
        name="ResetPasswordForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
      >
        <div className={styles.resetPasswordContainer}>
          <p>Скидування пароля. Введіть електронну пошту</p>
        </div>
        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input
            className={styles.ResetPasswordInput}
            placeholder="Електронна пошта"
          />
        </Form.Item>

        <Form.Item name="Password" rules={validationSchema.Password}>
          <Input.Password
            visibilityToggle={false}
            className={styles.ResetPasswordInput}
            placeholder=" Пароль"
          />
        </Form.Item>

        <Form.Item
          name="ConfirmPassword"
          dependencies={["Password"]}
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("Password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Паролі не співпадають"));
              },
            }),
          ]}
        >
          <Input.Password
            visibilityToggle={false}
            className={styles.ResetPasswordInput}
            placeholder=" Повторіть пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton}>
            Скинути пароль
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
