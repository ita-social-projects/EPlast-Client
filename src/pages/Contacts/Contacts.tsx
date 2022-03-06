import React, { useState } from "react";
import { Button, Form, Input, Layout, List, Select } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./Contacts.module.css";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import ReactInputMask from "react-input-mask";
import {
  emptyInput,
  incorrectEmail,
  incorrectPhone,
} from "../../components/Notifications/Messages";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";

let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();

  const data = [
    {
      avatar: <EnvironmentOutlined id={styles.environmentOutlined} />,
      title: "Україна",
    },
    {
      avatar: <PhoneOutlined id={styles.environmentOutlined} />,
      title: "+38 (099)-999-99-99",
    },
    {
      avatar: <MailOutlined id={styles.environmentOutlined} />,
      title: "info@plast.org.ua",
    },
  ];

  const handleSubmit = async (values: any) => {
    if (values.PhoneNumber === "") {
      values.PhoneNumber = undefined;
    }

    await authService.sendQuestionAdmin(values);
    history.push("/contacts");
    form.resetFields();
  };

  const validateMessages = {
    required: emptyInput(),
    types: {
      email: incorrectEmail,
      string: incorrectPhone,
    },
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 80 }}>
        <Select.Option value="+380">+380</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <Layout.Content className={styles.contacts}>
      <section className={styles.contactsList}>
        <h1>
          <InfoCircleOutlined id={styles.InfoOut} />
          Контакти
        </h1>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={item.avatar} title={item.title} />
            </List.Item>
          )}
        />
      </section>
      <Form
        className={styles.contactsForm}
        layout="vertical"
        initialValues={{ prefix: "+380" }}
        form={form}
        validateMessages={validateMessages}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="Name"
          label="Вкажіть Ваше ім'я"
          rules={descriptionValidation.Inputs}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Email"
          label="Вкажіть Вашу електронну пошту"
          rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="PhoneNumber"
          label="Вкажіть Ваш номер телефону"
          rules={[{ min: 18, message: incorrectPhone }]}
        >
          <ReactInputMask mask="+380(99)-999-99-99" maskChar={null}>
            {(inputProps: any) => <Input {...inputProps} type="tel" />}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          name="FeedBackDescription"
          label="Опишіть Ваше звернення"
          rules={descriptionValidation.DescriptionAndQuestions}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Відправити
          </Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}
