import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from './SignUp.module.css';
import Switcher from './Switcher/Switcher';
import authorizeApi from '../../api/authorizeApi';
import { checkEmail, checkNameSurName } from './verification';

export default function () {
  const [form] = Form.useForm();

  const validationSchema = {
    email: [{ required: true, message: "Поле електронна пошта є обов'язковим" }, { validator: checkEmail }],
    password: [
      { required: true, message: "Поле пароль є обов'язковим" },
      { min: 6, message: 'Мінімальна допустима довжина - 6 символів' },
    ],
    name: [{ required: true, message: "Поле ім'я є обов'язковим" }, { validator: checkNameSurName }],
    surName: [{ required: true, message: "Поле прізвище є обов'язковим" }, { validator: checkNameSurName }],
    repeatedPassword: [
      { required: true, message: "Дане поле є обов'язковим" },
      { min: 6, message: 'Мінімальна допустима довжина - 6 символів' },
    ],
  };

  const handleSubmit = async (values: any) => {
    await authorizeApi.register(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const initialValues = {
    Email: '',
    Name: '',
    SurName: '',
    Password: '',
    ConfirmPassword: '',
  };

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignUp" />
      <Form
        name="SignUpForm"
        initialValues={initialValues}
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="Email" rules={validationSchema.email}>
          <Input className={styles.MyInput} placeholder="Електронна пошта" />
        </Form.Item>
        <Form.Item name="Password" rules={validationSchema.password}>
          <Input.Password visibilityToggle={false} className={styles.MyInput} placeholder="Пароль" />
        </Form.Item>
        <Form.Item
          name="ConfirmPassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Підтвердіть пароль',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Паролі не співпадають'));
              },
            }),
          ]}
        >
          <Input.Password visibilityToggle={false} className={styles.MyInput} placeholder="Повторіть пароль" />
        </Form.Item>
        <Form.Item name="Name" rules={validationSchema.name}>
          <Input className={styles.MyInput} placeholder="Ім'я" />
        </Form.Item>
        <Form.Item name="SurName" rules={validationSchema.surName}>
          <Input className={styles.MyInput} placeholder="Прізвище" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" id={styles.confirmButton}>
            Зареєструватись
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}