import React, { useState, useEffect } from "react";
import { Form, Button, Select, DatePicker } from "antd";
import classes from "../../pages/Regions/Form.module.css";
import regionsApi from "../../api/regionsApi";
import notificationLogic from "../../components/Notifications/Notification";
import Modal from "antd/lib/modal/Modal";

interface Props {
  userId: string;
  showAdministratorModal: boolean;
  regionId: number;
  setShowAdministratorModal: (showModal: boolean) => void;
}

const AddNewAdministratorForm = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
}: Props) => {
  const [currentRegion, setCurrentRegion] = useState<number>();
  const [form] = Form.useForm();

  const [types, setTypes] = useState<any[]>([
    {
      id: "",
      adminTypeName: "",
    },
  ]);

  const handleSubmit = async (values: any) => {
    const newAdmin: any = {
      id: 0,
      userId: userId,
      AdminTypeId: JSON.parse(values.AdminType).id,
      startDate: values.startDate,
      endDate: values.endDate,
      regionId: regionId,
    };
    await regionsApi.AddAdmin(newAdmin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    form.resetFields();
    setShowAdministratorModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await regionsApi.getAdminTypes().then((response) => {
        setTypes(response.data);
      });
    };
    setCurrentRegion(regionId);
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Form.Item
        className={classes.formField}
        label="Тип адміністрування"
        name="AdminType"
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
              {o.adminTypeName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата початку"
        name="startDate"
      >
        <DatePicker className={classes.inputField} />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата кінця"
        name="endDate"
      >
        <DatePicker className={classes.inputField} />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddNewAdministratorForm;
