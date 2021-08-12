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
import distinctionApi from "../../../api/distinctionApi";
import UserDistinction from "../Interfaces/UserDistinction";
import formclasses from "./Form.module.css";
import adminApi from "../../../api/adminApi";
import Distinction from "../Interfaces/Distinction";
import{
  emptyInput,
  maxLength,
  failEditAction,
  maxNumber,
  minNumber
} from "../../../components/Notifications/Messages"
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  record: number;
  distinction: UserDistinction;
  setShowModal: (showModal: boolean) => void;
  onEdit: (
    id: number,
    distinction: Distinction,
    date: Date,
    reason: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => void;
}

const FormEditDistinction = ({
  record,
  setShowModal,
  onEdit,
  distinction,
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
  const [distData, setDistData] = useState<Distinction[]>(Array<Distinction>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [distValue, setDistValue] = useState<any>();
  const [userValue, setUserValue] = useState<any>();
  const openNotification = (message: string) => {
    notification.error({
      message: failEditAction(`відзначення`),
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
      await distinctionApi.getDistinctions().then((response) => {
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
    setDistValue(distinction.distinction);
    setUserValue(distinction.user);
  }, [distinction]);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole ? { backgroundColor : '#D3D3D3' } : { backgroundColor : 'white' };
  }    

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
    const newDistinction: any = {
      id: record,
      distinctionId: distValue.id,
      date: dist?.date,
      distinction: distValue,
      user: userValue,
      userId: userValue.id,
      reason: dist?.reason,
      reporter: dist?.reporter,
      number: dist?.number,
    };
    if (
      dist.number === distinction.number ||
      (await distinctionApi
        .checkNumberExisting(newDistinction.number)
        .then((response) => response.data === false))
    ) {
      await distinctionApi.editUserDistinction(newDistinction);
      setShowModal(false);
      form.resetFields();
      onEdit(
        newDistinction.id,
        newDistinction.distinction,
        newDistinction.date,
        newDistinction.reason,
        newDistinction.reporter,
        newDistinction.number,
        newDistinction.user,
        newDistinction.user.id
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
                initialValue={distinction.number}
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
                      validator: (_ : object, value: number) => 
                          value > 99999
                              ? Promise.reject(maxNumber(99999)) 
                              : Promise.resolve()
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
                initialValue={distinction.distinction.name}
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
                  distinction.user.firstName + " " + distinction.user.lastName
                }
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
                  },
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
                          key={o.id} 
                          value={JSON.stringify(o)} 
                          style={backgroundColor(o)}
                          disabled={o.isInLowerRole}
                          >
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
                initialValue={distinction.reporter}
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
                  },
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
                initialValue={moment(distinction.date)}
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
                  },
                ]}
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
                initialValue={distinction.reason}
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
                  },
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
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button key="back" onClick={handleCancel} className={formclasses.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={formclasses.buttons}>
                Зберегти
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default FormEditDistinction;
