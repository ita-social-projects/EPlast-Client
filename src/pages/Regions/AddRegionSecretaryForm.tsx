import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import { Form, Input, DatePicker, AutoComplete, Select, Button } from "antd";
import adminApi from "../../api/adminApi";
import notificationLogic from "../../components/Notifications/Notification";
import regionsApi from "../../api/regionsApi";
import { ReloadOutlined } from "@ant-design/icons";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import moment from "moment";
import{
  emptyInput,
  successfulEditAction,
} from "../../components/Notifications/Messages"

type AddNewSecretaryForm = {
  onAdd: () => void;
  onCancel: () => void;
  admin?: any;
};

const AddNewSecretaryForm = (props: any) => {
  const [currentRegion, setCurrentRegion] = useState<number>();
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [users, setUsers] = useState<any[]>([
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

  const [types, setTypes] = useState<any[]>([
    {
      id: "",
      adminTypeName: "",
    },
  ]);

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const handleSubmit = async (values: any) => {
    const newAdmin: any = {
      id: props.admin === undefined ? 0 : props.admin.id,

      userId:
        props.admin === undefined
          ? JSON.parse(values.userId).user.id
          : props.admin.userId,

      AdminTypeId: await (
        await regionsApi.getAdminTypeIdByName(values.AdminType)
      ).data,

      startDate: values.startDate,

      endDate: values.endDate,

      regionId: currentRegion,
    };
    if (newAdmin.id === 0) {
      await regionsApi.AddAdmin(newAdmin);

      notificationLogic("success", "Користувач успішно доданий в провід");

      form.resetFields();

      await NotificationBoxApi.createNotifications(
        [newAdmin.userId],
        `Вам була присвоєна адміністративна роль: '${values.AdminType}' в `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/regions/${currentRegion}`,
        `цьому окрузі`
      );

      onAdd();
    } else {
      await regionsApi.EditAdmin(newAdmin);

      notificationLogic("success", successfulEditAction("Адміністратора"));

      form.resetFields();

      await NotificationBoxApi.createNotifications(
        [newAdmin.userId],
        `Вам була відредагована адміністративна роль: '${values.AdminType}' в `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/regions/${currentRegion}`,
        `цьому окрузі`
      );
      onAdd();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await regionsApi.getAdminTypes().then((response) => {
        setTypes(response.data);
      });
      await adminApi.getUsersForTable().then((response) => {
        setUsers(response.data);
      });
    };
    setCurrentRegion(
      Number(
        window.location.hash.substring(1) ||
          window.location.pathname.split("/").pop()
      )
    );
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Form.Item
        className={classes.formField}
        style={{ display: props.admin === undefined ? "flex" : "none" }}
        label="Користувач"
        name="userId"
        rules={[
          {
            required: props.admin === undefined ? true : false,
            message: emptyInput(),
          },
        ]}
      >
        <Select showSearch className={classes.inputField}>
          {users?.map((o) => (
            <Select.Option key={o.user.id} value={JSON.stringify(o)}>
              {o.user.firstName + " " + o.user.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Тип адміністрування"
        initialValue={
          props.admin === undefined ? "" : props.admin.adminType.adminTypeName
        }
        name="AdminType"
        rules={[
          {
            required: true,
            message: emptyInput(),
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
        initialValue={
          props.admin === undefined ? undefined : moment(props.admin.startDate)
        }
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledStartDate}
          onChange={(e) => setStartDate(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата кінця"
        name="endDate"
        initialValue={
          props.admin === undefined
            ? undefined
            : props.admin.endDate === null
            ? undefined
            : moment(props.admin.endDate)
        }
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

export default AddNewSecretaryForm;
