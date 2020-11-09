import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Radio,
  AutoComplete,
} from "antd";
import adminApi from "../../api/adminApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import activeMembershipApi from "../../api/activeMembershipApi";
import moment from "moment";

interface Props {
  record: string;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
}

const ChangeUserRoleForm = ({ record, setShowModal, onChange }: Props) => {
  const userId = record;
  const [form] = Form.useForm();

  const [roles, setRoles] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchData = async () => {
      await adminApi.getRolesForEdit(userId)
      .then(response => {
        setRoles(response.data.userRoles);
      });
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    setShowModal(false);
  };

  const addEndDate = async (isEmpty : Boolean) => {
    let currentDates = await activeMembershipApi.getUserDates(userId);
    currentDates.dateEnd = isEmpty ? "0001-01-01T00:00:00" : moment().format();
    await activeMembershipApi.postUserDates(currentDates);
  }

  const handleFinish = async (value: any) => {
    await adminApi.putCurrentRole(userId, value.userRole);
    
    if(value.userRole === "Колишній член пласту"){
      await addEndDate(false);
    }
    else if(roles.includes("Колишній член пласту")){
      await addEndDate(true);
    }

    await NotificationBoxApi.createNotifications(
      [userId],
      `Вам надано нову роль: '${value.userRole}'`,
      NotificationBoxApi.NotificationTypes.UserNotifications
      );
      
    onChange(userId, value.userRole);
    setShowModal(false);
  };

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
        <h4>Оберіть поточну роль користувача</h4>
        <Form.Item
          name="userRole"
          rules={[
            {
              required: true,
              message: "Це поле має бути заповненим",
            },
          ]}
        >
          <AutoComplete
            options={[
              { value: "Прихильник" },
              { value: "Зацікавлений" },
              { value: "Пластун" },
              { value: "Колишній член пласту" },
            ]}
          ></AutoComplete>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button key="back" onClick={handleCancel}>
            Відмінити
          </Button>
          <Button type="primary" htmlType="submit">
            Призначити
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeUserRoleForm;
