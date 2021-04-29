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
import Precaution from "../Interfaces/Precaution";
import UserPrecaution from "../Interfaces/UserPrecaution";
import precautionApi from "../../../api/precautionApi";
import adminApi from "../../../api/adminApi";
import formclasses from "./Form.module.css";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  emptyInput,
  maxLength,
  failCreateAction,
  maxNumber,
  minNumber
} from "../../../components/Notifications/Messages"

type FormAddPrecautionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
};

const FormAddPrecaution: React.FC<FormAddPrecautionProps> = (props: any) => {
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
  const [distData, setDistData] = useState<Precaution[]>(Array<Precaution>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const dateFormat = "DD.MM.YYYY";
  const openNotification = (message: string) => {
    notification.error({
      message: failCreateAction(`пересторога`),
      description: `${message}`,
      placement: "topLeft",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await precautionApi.getPrecautions().then((response) => {
        setDistData(response.data);
      });
      setLoadingUserStatus(true);
      await adminApi.getUsersForTable().then((response) => {
        setUserData(response.data);
        setLoadingUserStatus(false);
      });
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const createNotifications = async (userPrecaution: UserPrecaution) => {
    await NotificationBoxApi.createNotifications(
      [userPrecaution.userId],
      `Вам було надано нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/Precautions`,
      `Переглянути`
    );

    await NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId)
      .then(res => {
        res.cityRegionAdmins.length !== 0 &&
          res.cityRegionAdmins.forEach(async (cra) => {
            await NotificationBoxApi.createNotifications(
              [cra.cityAdminId, cra.regionAdminId],
              `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
              NotificationBoxApi.NotificationTypes.UserNotifications,
              `/Precautions`,
              `Переглянути`
            );
          })
      });
  }

  const handleSubmit = async (values: any) => {
    const newPrecaution: UserPrecaution = {
      id: 0,
      precautionId: JSON.parse(values.Precaution).id,
      precaution: JSON.parse(values.Precaution),
      user: JSON.parse(values.user),
      userId: JSON.parse(values.user).id,
      status: values.status,
      date: values.date,
      endDate: values.date,
      isActive: true,
      reporter: values.reporter,
      reason: values.reason,
      number: values.number,
    };
    if (
      await precautionApi
        .checkNumberExisting(newPrecaution.number)
        .then((response) => response.data === false)
    ) {
      await precautionApi.addUserPrecaution(newPrecaution);
      setVisibleModal(false);
      form.resetFields();
      onAdd();
      await createNotifications(newPrecaution);
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
            label="Пересторога"
            labelCol={{ span: 24 }}
            name="Precaution"
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
                <Select.Option key={o.id} value={JSON.stringify(o)} >
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
                required: true,
                max: 250,
                message: maxLength(250),
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
              maxLength={251}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Статус"
            labelCol={{ span: 24 }}
            name="status"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select className={formclasses.selectField} showSearch>
              <Select.Option key="9" value="Прийнято">Прийнято</Select.Option>
              <Select.Option key="10" value="Потверджено">Потверджено</Select.Option>
              <Select.Option key="11" value="Скасовано">Скасовано</Select.Option>
            </Select>
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

export default FormAddPrecaution;
