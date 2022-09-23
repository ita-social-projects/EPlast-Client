import React from "react";
import { Form, Input, Button } from "antd";
import styles from "../ChangePassword/ChangePassword.module.css";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import { minLength, emptyInput } from "../../components/Notifications/Messages";
import { checkPassword } from "../SignUp/verification";
let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();

  const validationSchema = {
    CurrentPassword: [
      { required: true, message: emptyInput() },
      { validator: checkPassword },
    ],
    NewPassword: [
      { required: true, message: emptyInput() },
      { validator: checkPassword },
    ],
    ConfirmPassword: [
      { required: true, message: emptyInput() },
      { validator: checkPassword },
    ],
  };

  const handleSubmit = async (values: any) => {
    await authService.changePassword(values);
    history.push("/changePassword");
  };

  const initialValues = {
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  };

  return (
    <div className={styles.mainContainerChange}>
      <Form
        name="ChangePasswordForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
      >
        <div className={styles.changePasswordContainer}>
          <p>Зміна пароля</p>
        </div>
        <Form.Item
          name="CurrentPassword"
          rules={validationSchema.CurrentPassword}
        >
          <Input.Password
            visibilityToggle={true}
            className={styles.ChangePasswordInput}
            placeholder="Поточний пароль"
          />
        </Form.Item>

        <Form.Item name="NewPassword" rules={validationSchema.NewPassword}>
          <Input.Password
            visibilityToggle={true}
            className={styles.ChangePasswordInput}
            placeholder="Новий пароль"
          />
        </Form.Item>

        <Form.Item
          name="ConfirmPassword"
          dependencies={["NewPassword"]}
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("NewPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Паролі не співпадають"));
              },
            }),
          ]}
        >
          <Input.Password
            visibilityToggle={true}
            className={styles.ChangePasswordInput}
            placeholder="Введіть новий пароль ще раз"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton}>
            Змінити пароль
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
