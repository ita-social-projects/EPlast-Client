import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Button,
  notification,
  Row,
  Col,
} from "antd";
import Distinction from "../Interfaces/Distinction";
import UserDistinction from "../Interfaces/UserDistinction";
import distinctionApi from "../../../api/distinctionApi";
import formclasses from "./Form.module.css";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  emptyInput,
  maxLength,
  failCreateAction,
  maxNumber,
  minNumber
} from "../../../components/Notifications/Messages"
import precautionApi from "../../../api/precautionApi";

type FormAddDistinctionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
};

const FormAddDistinction: React.FC<FormAddDistinctionProps> = (props: any) => {
  const { setVisibleModal, onAdd } = props;
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any[]>([
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
  const [distData, setDistData] = useState<Distinction[]>(Array<Distinction>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const dateFormat = "DD.MM.YYYY";
  const openNotification = (message: string) => {
    notification.error({
      message: failCreateAction(`відзначення`),
      description: `${message}`,
      placement: "topLeft",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await distinctionApi.getDistinctions().then((response) => {
        setDistData(response.data);
      });
      setLoadingUserStatus(true);
      await precautionApi.getUsersWithoutPrecautions().then((response) => {
        setUserData(response);
        setLoadingUserStatus(false);
      });
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const backgroundColor = (user: any) => {
    return user.isInLowerRole ? { backgroundColor : '#D3D3D3' } : { backgroundColor : 'white' };
  }

  const createNotifications = async (userDistinction: UserDistinction) => {
    await NotificationBoxApi.createNotifications(
      [userDistinction.userId],
      `Вам було надано нове відзначення: '${userDistinction.distinction.name}' від ${userDistinction.reporter}. `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/distinctions`,
      `Переглянути`
    );

    await NotificationBoxApi.getCitiesForUserAdmins(userDistinction.userId)
      .then(res => {
        res.cityRegionAdmins.length !== 0 &&
          res.cityRegionAdmins.forEach(async (cra) => {
            await NotificationBoxApi.createNotifications(
              [cra.cityAdminId, cra.regionAdminId],
              `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав нове відзначення: '${userDistinction.distinction.name}' від ${userDistinction.reporter}. `,
              NotificationBoxApi.NotificationTypes.UserNotifications,
              `/distinctions`,
              `Переглянути`
            );
          })
      });
  }

  const handleSubmit = async (values: any) => {
    const newDistinction: UserDistinction = {
      id: 0,
      distinctionId: JSON.parse(values.distinction).id,
      distinction: JSON.parse(values.distinction),
      user: JSON.parse(values.user),
      userId: JSON.parse(values.user).id,
      date: values.date,
      reporter: values.reporter,
      reason: values.reason,
      number: values.number,
    };
    if (
      await distinctionApi
        .checkNumberExisting(newDistinction.number)
        .then((response) => response.data === false)
    ) {
      await distinctionApi.addUserDistinction(newDistinction);
      setVisibleModal(false);
      form.resetFields();
      onAdd();
      await createNotifications(newDistinction);
    } else {
      openNotification(`Номер ${values.number} вже зайнятий`);
      form.resetFields(["number"]);
    }
  };
  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Номер в реєстрі"
            labelCol={{ span: 24 }}
            name="number"
            rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
                {
                  max: 5,
                  message: maxNumber(99999),
                },
                {
                    validator: (_ : object, value: number) => 
                        value < 1
                            ? Promise.reject(minNumber(1)) 
                            : Promise.resolve()
                }
              ]}
          >
            <Input
              type="number"
              min={1}
              className={formclasses.inputField}
              max={99999}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Відзначення"
            labelCol={{ span: 24 }}
            name="distinction"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select className={formclasses.selectField} showSearch>
              {distData?.map((o) => (
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
            className={formclasses.formField}
            label="Ім'я"
            name="user"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: emptyInput() }]}
          >
            <Select
              className={formclasses.selectField}
              showSearch
              loading={loadingUserStatus}
            >
              {userData?.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)} style={backgroundColor(o)}>
                  {o.firstName + " " + o.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Подання від"
            labelCol={{ span: 24 }}
            name="reporter"
            rules={[
              {
                max: 100,
                message: maxLength(100),
              },
            ]}
          >
            <Input
              allowClear
              className={formclasses.inputField}
              maxLength={101}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            name="date"
            label="Дата затвердження"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: emptyInput() }]}
          >
            <DatePicker
              format={dateFormat}
              className={formclasses.selectField}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Обгрунтування"
            labelCol={{ span: 24 }}
            name="reason"
            rules={[
              {
                max: 1000,
                message: maxLength(1000),
              },
            ]}
          >
            <Input.TextArea
              allowClear
              autoSize={{
                minRows: 2,
                maxRows: 6,
              }}
              className={formclasses.inputField}
              maxLength={1001}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button key="back" onClick={handleCancel} className={formclasses.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={formclasses.buttons}>
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddDistinction;