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
  roles: string | undefined;
  onChange: (id: string, userRoles: string) => void;
}

const AddNewAdministratorForm = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
  roles,
  onChange,
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

  const handleSubmit = async (values: any) => {
    // перевірка чи голова станиці, а тоді перевірка чи юзер пластун
    if (values.AdminType === "Голова Округу") {
      if (roles?.includes("Пластун")) {
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
        notificationLogic("success", "Користувач успішно доданий в провід");
        form.resetFields();
        onChange(userId, values.AdminType);
        setShowAdministratorModal(false);
      } else if (roles?.includes("Голова Округу")) {
        notificationLogic("error", "Даний користувач уже є головою округу :(");
        form.resetFields();
        setShowAdministratorModal(false);
      } else {
        notificationLogic(
          "error",
          "Даний користувач не може бути головою округу( не має ролі пластуна)"
        );
        form.resetFields();
        setShowAdministratorModal(false);
      }
    } else {
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
      onChange(userId, values.AdminType);
      form.resetFields();
      setShowAdministratorModal(false);
    }
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
