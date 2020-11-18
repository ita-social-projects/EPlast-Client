import React, { useState } from 'react';
import { Form, Input, Button} from 'antd';
import styles from './SignUp.module.css';
import Switcher from './Switcher/Switcher';
import { checkEmail, checkNameSurName, checkPassword } from './verification';
import AuthorizeApi from '../../api/authorizeApi';
import { useHistory } from 'react-router-dom';
import{incorrectEmail, emptyInput, incorrectPhone, minLength} from "../../components/Notifications/Messages"

let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();
  const [available, setAvailabe] = useState(true);



  const validationSchema = {
    Email: [
      { required: true, message: emptyInput }, 
      { validator: checkEmail }
    ],
    Password: [
      { required: true, message: emptyInput },
      { validator: checkPassword }
    ],
    Name: [
      { required: true, message: emptyInput }, 
      { validator: checkNameSurName }
    ],
    SurName: [
      { required: true, message: emptyInput }, 
      { validator: checkNameSurName }
    ],
    ConfirmPassword: [
      { required: true, message: emptyInput },
      { min: 8, message: minLength(8) },
    ],
  };

  const handleSubmit = async (values: any) => {
    setAvailabe(false);
    await authService.register(values);
    setAvailabe(true);
    history.push('/signup')
  };

  const initialValues = {
    Email: '',
    Name: '',
    SurName: '',
    Password: '',
    ConfirmPassword: '',
  };

  return (
    <div className={styles.mainContainerSignUp}>
      <Switcher page="SignUp" />
      <Form
        name="SignUpForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input className={styles.MyInput} placeholder="Електронна пошта" />
        </Form.Item>
        <Form.Item name="Password" rules={validationSchema.Password}>
          <Input.Password visibilityToggle={true} className={styles.MyInput} placeholder="Пароль" />
        </Form.Item>
        <Form.Item
          name="ConfirmPassword"
          dependencies={['Password']}
          rules={[
            {
              required: true,
              message: 'Підтвердіть пароль',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('Password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Паролі не співпадають'));
              },
            }),
          ]}
        >
          <Input.Password visibilityToggle={true} className={styles.MyInput} placeholder="Повторіть пароль" />
        </Form.Item>
        <Form.Item name="Name" rules={validationSchema.Name}>
          <Input className={styles.MyInput} placeholder="Ім'я" />
        </Form.Item>
        <Form.Item name="SurName" rules={validationSchema.SurName}>
          <Input className={styles.MyInput} placeholder="Прізвище" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton} disabled={!available} loading={!available}>
            Зареєструватись
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}