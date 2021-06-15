import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, Input, DatePicker, AutoComplete, Select, Modal, Button } from "antd";
import adminApi from "../../../api/adminApi";
import notificationLogic from "../../../components/Notifications/Notification";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
  getAllMembers,
} from "../../../api/citiesApi";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import moment from "moment";
import {
  emptyInput,
  successfulEditAction,
} from "../../../components/Notifications/Messages"
import CityAdmin from "../../../models/City/CityAdmin";
import AdminType from "../../../models/Admin/AdminType";
import CityMember from "../../../models/City/CityMember";
import "./AddCitiesSecretaryForm.less";
import userApi from "../../../api/UserApi";

type AddCitiesNewSecretaryForm = {
  onAdd: () => void;
  onCancel: () => void;
  cityId: number;
  admin?: any;
};
const confirm = Modal.confirm;
const AddCitiesNewSecretaryForm = (props: any) => {
  const [head, setHead] = useState<CityAdmin>();
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [members, setMembers] = useState<CityMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getMembers = async () => {
    setLoading(true);
    const responseMembers = await getAllMembers(props.cityId);
    setMembers(responseMembers.data.members);
    setLoading(false);
  };

  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);


  const getHead = async () => {
    if (props.cityId !== 0) {
      const responseAdmins = await getAllAdmins(props.cityId);
      setHead(responseAdmins.data.head);
    }
  };

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const addClubAdmin = async (admin: CityAdmin) => {
    await addAdministrator(admin.cityId, admin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${props.cityId}`,
      `цій станиці`
    );
  };

  const editClubAdmin = async (admin: CityAdmin) => {
    await editAdministrator(props.cityId, admin);
    notificationLogic("success", successfulEditAction("Адміністратора"));
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була відредагована адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${props.cityId}`,
      `цій станиці`);
  };


  const showConfirm = (admin: CityAdmin) => {
    confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {head?.user.firstName} {head?.user.lastName}
          </b>{" "}
          є Головою Станиці, час правління закінчується{" "}
          <b>
            {moment(head?.endDate).format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment(head?.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() { },
      onOk() {
        if (admin.id === 0) {
          addClubAdmin(admin);
        } else {
          editClubAdmin(admin);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    const newAdmin: CityAdmin = {
      id: props.admin === undefined ? 0 : props.admin.id,
      userId: props.admin === undefined
        ? JSON.parse(values.userId).id
        : props.admin.userId,
      user: values.user,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.AdminType,
      },
      cityId: props.cityId,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    onAdd();
    if (newAdmin.id === 0) {
      try {
        if (values.AdminType === "Голова Станиці" && head !== null) {
          if (head?.userId !== newAdmin.userId) {
            showConfirm(newAdmin);
          } else if (head?.userId === newAdmin.userId) {
          }
          else {
            editClubAdmin(newAdmin);
          }
        } else {
          if (newAdmin.id === 0) {
            addClubAdmin(newAdmin);
          }
          else {
            editClubAdmin(newAdmin);
          }
        }
      } finally {
        onAdd();
      }
    }
  };

  useEffect(() => {
    if (!props.visibleModal) {
      form.resetFields();
    }
    getMembers();
    getHead();
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
  }, [props]);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form} className="formAddSecretaryModal">
      <Form.Item
        className={classes.formField}
        style={{ display: props.admin === undefined ? "flex" : "none" }}
        label="Користувач"
        name="userId"
        rules={[
          {
            required: props.admin === undefined ? true : false,
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <Select showSearch className={classes.inputField}>
          {members?.map((o) => (
            <Select.Option key={o.user.id} value={JSON.stringify(o.user)}>
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
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: "Голова Станиці", disabled: activeUserRoles.includes("Заступник Голови Станиці") },
            { value: "Заступник Голови Станиці"},
            { value: "Голова СПС" },
            { value: "Писар" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член СПР" },
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

export default AddCitiesNewSecretaryForm;
