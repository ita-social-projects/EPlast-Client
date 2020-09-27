import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Input, Button, notification} from "antd";
import Distinction from "../Interfaces/Distinction";
import UserDistinction from "../Interfaces/UserDistinction";
import distinctionApi from "../../../api/distinctionApi";
import adminApi from "../../../api/adminApi";
import notificationLogic from "../../../components/Notifications/Notification";
import formclasses from "./Form.module.css";

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
  const dateFormat = "DD-MM-YYYY";
  const openNotification = (message:string) => {
    notification.error({
      message: `Невдалося створити відзначення` ,
      description:`${message}`,
      placement: "topLeft",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await distinctionApi.getDistinctions().then((response) => {
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
    setVisibleModal(false);
  };

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
    const exist = (await distinctionApi.checkNumberExisting(newDistinction.number)).data;
    console.log(values.number);

    if (
      await distinctionApi
        .checkNumberExisting(values.number)
        .then((response) => response.data == false)
    ) {
      await distinctionApi.addUserDistinction(newDistinction);
      setVisibleModal(false);
      form.resetFields();
      onAdd();
    } else {
      openNotification(`Номер ${values.number} вже зайнятий`);
      form.resetFields(["number"]);
    }
  };
  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Form.Item
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
        rules={[
          {
            required: true,
            message: "Це поле має бути заповненим",
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

      <Form.Item
        className={formclasses.formField}
        label="Ім'я"
        name="user"
        rules={[{ required: true, message: "Це поле має бути заповненим" }]}
      >
        <Select
          className={formclasses.selectField}
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
        rules={[
          {
            max: 100,
            message: "Поле подання не має перевищувати 100 символів!",
          },
        ]}
      >
        <Input allowClear className={formclasses.inputField} maxLength={101} />
      </Form.Item>

      <Form.Item
        className={formclasses.formField}
        name="date"
        label="Дата затвердження"
        rules={[{ required: true, message: "Це поле має бути заповненим" }]}
      >
        <DatePicker format={dateFormat} className={formclasses.selectField} />
      </Form.Item>

      <Form.Item
        className={formclasses.formField}
        label="Обгрунтування"
        name="reason"
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
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddDistinction;
