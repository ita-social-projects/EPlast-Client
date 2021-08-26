import React from 'react';
import { Button, Col, Form, Input, Row } from "antd";

import styles from './FormAskQuestion.css';
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from 'react-router-dom';
import ReactInputMask from "react-input-mask";
import {
  emptyInput,
  incorrectEmail,
  incorrectPhone,
} from "../../components/Notifications/Messages"
import { descriptionValidation } from '../../models/GllobalValidations/DescriptionValidation';
import TextArea from 'antd/lib/input/TextArea';

type FormAskQuestionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
};

let authService = new AuthorizeApi();

const FormAskQuestion: React.FC<FormAskQuestionProps> = (props: any) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const handleSubmit = async (values: any) => {
    if (values.PhoneNumber === "") {
      values.PhoneNumber = undefined;
    }

    await authService.sendQuestionAdmin(values);
    history.push("/aboutBase");
    form.resetFields();
  };

  const validateMessages = {
    required: emptyInput(),
    types: {
      email: incorrectEmail,
      string: incorrectPhone,
    },
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ prefix: "+380" }}
      form={form}
      validateMessages={validateMessages}
      onFinish={handleSubmit}
    >
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={styles.formField}
            name="Name"
            label="Вкажіть Ваше ім'я"
            rules={descriptionValidation.Inputs}
          >
            <Input className={styles.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={styles.formField}
            name="Email"
            label="Вкажіть Вашу електронну пошту"
            rules={[{ type: "email", required: true }]}
          >
            <Input className={styles.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={styles.formField}
            name="PhoneNumber"
            label="Вкажіть Ваш номер телефону"
            rules={[{ min: 18, message: incorrectPhone }]}
          >
            <ReactInputMask
              mask="+380(99)-999-99-99"
              maskChar={null}
            >
              {(inputProps: any) => <Input  {...inputProps} type="tel" className={styles.inputField} />}
            </ReactInputMask>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={styles.formField}
            name="FeedBackDescription"
            label="Опишіть Ваше звернення"
            rules={descriptionValidation.DescriptionAndQuestions}
          >
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} className={styles.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item style={{ textAlign: "right" }} className={styles.formField}>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.buttons}
            >
              Відправити
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAskQuestion;