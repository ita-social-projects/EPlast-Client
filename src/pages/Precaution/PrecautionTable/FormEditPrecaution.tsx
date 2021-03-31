import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Row,
  Col,
} from "antd";
import precautionApi from "../../../api/precautionApi";
import UserPrecaution from "../Interfaces/UserPrecaution";
import formclasses from "./Form.module.css";
import adminApi from "../../../api/adminApi";
import Precaution from "../Interfaces/Precaution";
import {
  emptyInput,
  maxLength,
  failEditAction
} from "../../../components/Notifications/Messages"
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  record: number;
  Precaution: UserPrecaution;
  setShowModal: (showModal: boolean) => void;
  onEdit: (
    id: number,
    Precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => void;
}

const FormEditPrecaution = ({
  record,
  setShowModal,
  onEdit,
  Precaution,
}: Props) => {
  const [loading, setLoading] = useState(false);
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
  const [distValue, setDistValue] = useState<any>();
  const [userValue, setUserValue] = useState<any>();
  const openNotification = (message: string) => {
    notification.error({
      message: failEditAction(`пересторога`),
      description: `${message}`,
      placement: "topLeft",
    });
  };
  const dateFormat = "DD.MM.YYYY";

  useEffect(() => {
    setLoading(true);
    form.resetFields();
    const fetchData = async () => {
      setDistData([]);
      setUserData([]);
      await precautionApi.getPrecautions().then((response) => {
        setDistData(response.data);
      });
      setLoadingUserStatus(true);
      await adminApi.getUsersForTable().then((response) => {
        setUserData(response.data);
      });
      setLoadingUserStatus(false);
    };
    fetchData();
    setLoading(false);
    setDistValue(Precaution.precaution);
    setUserValue(Precaution.user);
  }, [Precaution]);

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const distChange = (dist: any) => {
    dist = JSON.parse(dist);
    setDistValue(dist);
  };
  const userChange = (user: any) => {
    user = JSON.parse(user);
    setUserValue(user);
  };

  const handleFinish = async (dist: any) => {
    const newPrecaution: any = {
      id: record,
      PrecautionId: distValue.id,
      Precaution: distValue,
      user: userValue,
      userId: userValue.id,
      status: dist?.status,
      date: dist?.date,
      endDate: Precaution.endDate,
      isActive: dist?.status === "Скасовано" ? false : true,
      reporter: dist?.reporter,
      reason: dist?.reason,
      number: dist?.number,
    };
    if (
      dist.number === Precaution.number ||
      (await precautionApi
        .checkNumberExisting(newPrecaution.number)
        .then((response) => response.data === false))
    ) {
      await precautionApi.editUserPrecaution(newPrecaution);
      setShowModal(false);
      form.resetFields();
      onEdit(
        newPrecaution.id,
        newPrecaution.Precaution,
        newPrecaution.date,
        newPrecaution.endDate,
        newPrecaution.isActive,
        newPrecaution.reason,
        newPrecaution.status,
        newPrecaution.reporter,
        newPrecaution.number,
        newPrecaution.user,
        newPrecaution.user.id
      );
    } else {
      openNotification(`Номер ${dist.number} вже зайнятий`);
      form.resetFields(["number"]);
    }
  };

  return (
    <div>
      {!loading && (
        <Form name="basic" onFinish={handleFinish} form={form}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                initialValue={Precaution.number}
                className={formclasses.formField}
                label="Номер в реєстрі"
                labelCol={{ span: 24 }}
                name="number"
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
                initialValue={Precaution.precaution.name}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  showSearch
                  onSelect={distChange}
                >
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
                labelCol={{ span: 24 }}
                name="user"
                initialValue={
                  Precaution.user.firstName + " " + Precaution.user.lastName
                }
                rules={[
                  { required: true, message: emptyInput() },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  onSelect={userChange}
                  showSearch
                  loading={loadingUserStatus}
                >
                  {userData?.map((o) => (
                    <Select.Option
                      key={o.user.id}
                      value={JSON.stringify(o.user)}
                    >
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
                className={formclasses.formField}
                label="Подання від"
                labelCol={{ span: 24 }}
                name="reporter"
                initialValue={Precaution.reporter}
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
                initialValue={moment(Precaution.date)}
                rules={[
                  { required: true, message: emptyInput() },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  className={formclasses.selectField}
                  disabled
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
                initialValue={Precaution.reason}
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
                initialValue={Precaution.status}
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
          {Precaution.isActive ? <Form.Item>
            <div className={formclasses.cardButton}>
              <Button key="back" onClick={handleCancel} className={formclasses.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={formclasses.buttons}>
                Зберегти
              </Button>
            </div>
          </Form.Item> : ""}
        </Form>
      )}
    </div>
  );
};

export default FormEditPrecaution;
