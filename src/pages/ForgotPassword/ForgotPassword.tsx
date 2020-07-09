import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from '../ForgotPassword/ForgotPassword.module.css';
import authorizeApi from '../../api/authorizeApi';
import { checkEmail, checkNameSurName } from '../SignUp/verification';

export default function () {
    const [form] = Form.useForm();

    const validationSchema = {
        Email: [
            { required: true, message: "Поле електронна пошта є обов'язковим" },
            { validator: checkEmail }
        ]
    };

    const handleSubmit = async (values: any) => {
        //await authorizeApi.register(values);
        console.log(values);
      };

    const initialValues = {
        Email: ''
      };

    return (
        <div className={styles.mainContainer}>
            <Form
                name="ForgotPasswordForm"
                initialValues={initialValues}
                form={form}
                onFinish={handleSubmit}>
            <Form.Item name="Email" rules={validationSchema.Email}>
                <Input
                    className={styles.ForgotPasswordInput}
                    placeholder="Електронна пошта"
                />
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