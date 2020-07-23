import React from "react";
import { Button, Form, Input, Layout, List, Select } from "antd";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, InfoOutlined} from "@ant-design/icons";
import styles from "./Contacts.module.css";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from 'react-router-dom';
let authService = new AuthorizeApi();

export default function () {
  const [form] = Form.useForm();
  const history = useHistory();

  const data = [
    {
      avatar: (
        <EnvironmentOutlined id={styles.environmentOutlined}/>
      ),
      title: "Україна",
    },
    {
      avatar: (
        <PhoneOutlined id={styles.environmentOutlined}/>
      ),
      title: "+38(099)-99-99-99-9",
    },
    {
      avatar: (
        <MailOutlined id={styles.environmentOutlined}/>
      ),
      title: "info@plast.ua",
    },
  ];

  const handleSubmit = async (values: any) => {
    await authService.sendQuestionAdmin(values);
    history.push("/contacts");
  };

  const validateMessages = {
    required: "Це поле є обов`язковим!",
    types: {
      email: "Невалідний email!",
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
          <InfoOutlined id={styles.InfoOut} />
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
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Email"
          label="Вкажіть Ваш email"
          rules={[{ type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="PhoneNumber" label="Вкажіть Ваш номер телефону">
          <Input addonBefore={prefixSelector} id={styles.addonElement} />
        </Form.Item>
        <Form.Item
          name="FeedBackDescription"
          label="Опишіть Ваше звернення"
          rules={[{ required: true }]}
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
