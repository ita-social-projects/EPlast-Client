import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "../ForgotPassword/ForgotPassword.module.css";
import { checkEmail } from "../SignUp/verification";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import { loadingNotification } from "../Actions/ActionEvent/EventInfo/GalleryNotifications";
import { emptyInput } from "../../components/Notifications/Messages";
let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const validationSchema = {
    Email: [
      { required: true, message: emptyInput("електронна пошта") },
      { validator: checkEmail },
    ],
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    await authService.forgotPassword(values);
    history.push("/signin");
  };

  const initialValues = {
    Email: "",
  };

  return (
    <div className={styles.mainContainerForgot}>
      <Form
        name="ForgotPasswordForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
      >
        <div className={styles.forgotPasswordContainer}>
          <p>Забули пароль? Введіть електронну пошту</p>
        </div>
        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input
            className={styles.ForgotPasswordInput}
            placeholder="Електронна пошта"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton} loading={loading}>
            Надіслати
          </Button>
          <Button
            htmlType="submit"
            id={styles.confirmButton}
            onClick={() => history.push("/signin")}
          >
            Скасувати
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
