import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import {
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import adminApi from "../../api/adminApi";
import notificationLogic from "../../components/Notifications/Notification";

type FormAddKadraProps = {
    showModal: (visibleModal: boolean) => void;  
    onAdd: () => void;
};

const AddNewKadraForm: React.FC<FormAddKadraProps> = (props: any) => {
  const { showModal, onAdd } = props;
  const [form] = Form.useForm();
  const dateFormat = "DD-MM-YYYY";
  const [users, setUsers] = useState<any[]>([
    {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        birthday: "",
      },
      regionName: "",
      cityName: "",
      clubName: "",
      userPlastDegreeName: "",
      userRoles: "",
    },
  ]);

  const [types, setTypes] = useState<any[]>([
    {
      id: "",
      name: "",
    },
  ]);

  const handleSubmit = async (values: any) => {
    const newKadra: any = {
      id: 0,

      userId: JSON.parse(values.userId).user.id,

      KadraVykhovnykivTypeId: JSON.parse(values.KadraVykhovnykivType).id,

      dateOfGranting: values.dateOfGranting,

      numberInRegister: values.numberInRegister,

      basisOfGranting: values.basisOfGranting,

      link: values.link,
    };

    kadrasApi
      .doesRegisterNumberExist(newKadra.numberInRegister)
      .then((responce) => {
        if (responce.data == false) {
          kadrasApi
            .doesUserHaveStaff(newKadra.userId, newKadra.KadraVykhovnykivTypeId)
            .then(async (response) => {
              if (response.data == false) {
                await kadrasApi.createKadra(newKadra);
                form.resetFields();
                onAdd();

                notificationLogic(
                  "success",
                  "Користувач успішно отримав відзнаку"
                );
              } else {
                notificationLogic(
                  "error",
                  "Користувач вже отримував цю відзнаку"
                );
                form.resetFields();
                onAdd();
              }
            });
        } else {
          notificationLogic("error", "Номер реєстру вже зайнятий");
          form.resetFields();
          onAdd();
        }
      });
  };


  const handleCancel = () => {
    form.resetFields();
    showModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await kadrasApi.getAllKVTypes().then((response) => {
        setTypes(response.data);
      });
      await adminApi.getUsersForTable().then((response) => {
        setUsers(response.data);
      });
    };
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Користувач"
            labelCol={{ span: 24 }}
            name="userId"
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
            ]}
          >
            <Select showSearch className={classes.inputField}>
              {users?.map((o) => (
                <Select.Option key={o.user.id} value={JSON.stringify(o)}>
                  {o.user.firstName + " " + o.user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Тип кадри"
            labelCol={{ span: 24 }}
            name="KadraVykhovnykivType"
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
            ]}
          >
            <Select filterOption={false} className={classes.inputField}>
              {types?.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Дата вручення"
            labelCol={{ span: 24 }}
            name="dateOfGranting"
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
            ]}
          >
            <DatePicker 
                format={dateFormat}
                className={classes.selectField}/>
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
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
              {
                max: 6,
                message: "Поле не може перевищувати 6 символів!",
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              max={999999}
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
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
              { max: 100, message: "Поле не може перевищувати 100 символів" },
            ]}
          >
            <Input className={classes.inputField} />
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
            rules={[
              { max: 500, message: "Поле не може перевищувати 500 символів" },
            ]}
          >
            <Input className={classes.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={classes.cardButton}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit">
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewKadraForm;
