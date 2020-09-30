import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, notification } from "antd";
import distinctionApi from "../../../api/distinctionApi";
import UserDistinction from "../Interfaces/UserDistinction";
import formclasses from "./Form.module.css";
import adminApi from "../../../api/adminApi";
import Distinction from "../Interfaces/Distinction";
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
      message: `Невдалося редагувати відзначення`,
      description: `${message}`,
      placement: "topLeft",
    });
  };
  const dateFormat = "DD-MM-YYYY";

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
      dist.number == distinction.number ||
      (await distinctionApi
        .checkNumberExisting(newDistinction.number)
        .then((response) => response.data == false))
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
          <Form.Item
            initialValue={distinction.number}
            className={formclasses.formField}
            label="Номер в реєстрі"
            name="number"
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              className={formclasses.inputField}
              max={1000}
            />
          </Form.Item>
          <Form.Item
            className={formclasses.formField}
            label="Відзначення"
            name="distinction"
            initialValue={distinction.distinction.name}
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
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

          <Form.Item
            className={formclasses.formField}
            label="Ім'я"
            name="user"
            initialValue={
              distinction.user.firstName + " " + distinction.user.lastName
            }
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
          >
            <Select
              className={formclasses.selectField}
              onSelect={userChange}
              showSearch
              loading={loadingUserStatus}
            >
              {userData?.map((o) => (
                <Select.Option key={o.user.id} value={JSON.stringify(o.user)}>
                  {o.user.firstName + " " + o.user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className={formclasses.formField}
            label="Подання від"
            name="reporter"
            initialValue={distinction.reporter}
            rules={[
              {
                max: 100,
                message: "Поле подання не має перевищувати 100 символів!",
              },
            ]}
          >
            <Input
              allowClear
              className={formclasses.inputField}
              maxLength={101}
            />
          </Form.Item>

          <Form.Item
            className={formclasses.formField}
            name="date"
            label="Дата затвердження"
            initialValue={moment(distinction.date)}
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
          >
            <DatePicker
              format={dateFormat}
              className={formclasses.selectField}
            />
          </Form.Item>

          <Form.Item
            className={formclasses.formField}
            label="Обгрунтування"
            name="reason"
            initialValue={distinction.reason}
            rules={[
              {
                max: 250,
                message: "Поле обгрунтування не має перевищувати 250 символів!",
              },
            ]}
          >
            <Input.TextArea
              allowClear
              className={formclasses.inputField}
              maxLength={251}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button key="back" onClick={handleCancel}>
              Відмінити
            </Button>
            <Button type="primary" htmlType="submit">
              Зберегти
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default FormEditDistinction;
