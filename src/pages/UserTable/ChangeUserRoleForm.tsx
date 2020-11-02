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

interface Props {
  record: string;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
}

const ChangeUserRoleForm = ({ record, setShowModal, onChange }: Props) => {
  const userId = record;
  const [form] = Form.useForm();

  const [role, setRole] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  const handleCancel = () => {
    setShowModal(false);
  };
  const handleFinish = async (value: any) => {
    await adminApi.putCurrentRole(userId, value.userRole);
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
            Змінити
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeUserRoleForm;
