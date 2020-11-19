import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import {
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Select,
  Button,
  Layout,
  Row,
  Col,
} from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import notificationLogic from "../../components/Notifications/Notification";
import Spinner from "../Spinner/Spinner";
import moment from "moment";
import{
  emptyInput,
  maxLength,
  successfulEditAction
} from "../../components/Notifications/Messages"

type FormUpdateKadraProps = {
  showModal: (visibleModal: boolean) => void;
  onAdd: () => void;
  record: number;
  onEdit: () => void;
};

const UpdateKadraForm: React.FC<FormUpdateKadraProps> = (props: any) => {
  const { onAdd, record, onEdit, showModal } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  const [currentKadra, setCurrentKadra] = useState<any>({
    dateOfGranting: "",

    numberInRegister: "",

    basisOfGranting: "",

    link: "",
  });

  const handleSubmit = async (values: any) => {
    const newKadra: any = {
      id: record,

      dateOfGranting: values.dateOfGranting,

      numberInRegister: values.numberInRegister,

      basisOfGranting: values.basisOfGranting,

      link: values.link,
    };
    await kadrasApi
      .doesRegisterNumberExistEdit(newKadra.numberInRegister, newKadra.id)
      .then(async (responce) => {
        if (responce.data == false) {
          await kadrasApi.putUpdateKadra(newKadra);
          form.resetFields();
          onAdd();
          onEdit();
          notificationLogic("success", successfulEditAction("Відзнаку"));
        } else {
          notificationLogic("error", "Номер реєстру вже зайнятий");
          form.resetFields();
          onAdd();
        }
      });
  };

  const setCurrent = async () => {
    try {
      const response = await kadrasApi.GetStaffById(record);
      setCurrentKadra(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrent();
  }, []);
  const handleCancel = () => {
    form.resetFields();
    showModal(false);
  };

  return (
    <div>
      {currentKadra.numberInRegister === "" ? (
        <Spinner />
      ) : (
        <Form name="basic" onFinish={handleSubmit} form={form}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Дата вручення"
                labelCol={{ span: 24 }}
                name="dateOfGranting"
                initialValue={moment(currentKadra.dateOfGranting)}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <DatePicker className={classes.selectField} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Номер в реєстрі"
                labelCol={{ span: 24 }}
                name="numberInRegister"
                initialValue={currentKadra.numberInRegister}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Input
                  type="number"
                  min={1}
                  max={999999}
                  value={currentKadra.numberInRegister}
                  className={classes.inputField}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Причина надання"
                labelCol={{ span: 24 }}
                name="basisOfGranting"
                initialValue={currentKadra.basisOfGranting}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                  {
                    max: 100,
                    message: maxLength(100),
                  },
                ]}
              >
                <Input
                  value={currentKadra.basisOfGranting}
                  className={classes.inputField}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Лінк"
                labelCol={{ span: 24 }}
                name="link"
                initialValue={currentKadra.link}
                rules={[
                  {
                    max: 500,
                    message: maxLength(500),
                  },
                ]}
              >
                <Input
                  value={currentKadra.link}
                  className={classes.inputField}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item>
                <div className={classes.cardButton}>
                  <Button key="back" onClick={handleCancel} className={classes.buttons}>
                    Відмінити
                  </Button>
                  <Button type="primary" htmlType="submit" className={classes.buttons}>
                    Опублікувати
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default UpdateKadraForm;
