import React, { useState, useEffect } from "react";
import { Form, Button, Select, DatePicker, AutoComplete } from "antd";
import classes from "../../pages/Regions/Form.module.css";
import regionsApi from "../../api/regionsApi";
import notificationLogic from "../../components/Notifications/Notification";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

interface Props {
  userId: string;
  showAdministratorModal: boolean;
  regionId: number;
  setShowAdministratorModal: (showAdministratorModal: boolean) => void;
}

const AddNewAdministratorForm = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
}: Props) => {
  const [currentRegion, setCurrentRegion] = useState<number>();
  const [form] = Form.useForm();
  const [date, setDate] = useState<any>();

  const [types, setTypes] = useState<any[]>([
    {
      id: "",
      adminTypeName: "",
    },
  ]);

  const disabledEndDate = (current: any) => {
    return current && current < date;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const handleSubmit = async (values: any) => {
    const newAdmin: any = {
      id: 0,
      userId: userId,
      AdminTypeId: await (
        await regionsApi.getAdminTypeIdByName(values.AdminType)
      ).data,
      startDate: values.startDate,
      endDate: values.endDate,
      regionId: regionId,
    };
    await regionsApi.AddAdmin(newAdmin);
    form.resetFields();

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
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: "Голова Округу" },
            { value: "Писар" },
            { value: "Бунчужний" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член ОПР" },
            { value: "Голова ОПС" },
            { value: "Голова ОПР" },
          ]}
          placeholder={"Тип адміністрування"}
        ></AutoComplete>
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата початку"
        name="startDate"
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledStartDate}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата кінця"
        name="endDate"
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledEndDate}
          format="DD.MM.YYYY"
        />
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
