import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, Input, DatePicker, AutoComplete, Select, Modal, Button } from "antd";
import adminApi from "../../../api/adminApi";
import notificationLogic from "../../../components/Notifications/Notification";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/clubsApi";
import { ReloadOutlined } from "@ant-design/icons";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import moment from "moment";
import {
  emptyInput,
  successfulEditAction,
} from "../../../components/Notifications/Messages"
import AdminType from "../../../models/Admin/AdminType";
import regionsApi from "../../../api/regionsApi";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import User from "../../Distinction/Interfaces/User";
import "./AddClubsSecretaryForm.less";

type AddClubsNewSecretaryForm = {
  onAdd: () => void;
  onCancel: () => void;
  clubId: number;
  admin?: any;
};
const confirm = Modal.confirm;
const AddClubsNewSecretaryForm = (props: any) => {
  const [head, setHead] = useState<ClubAdmin>();
  const [loading, setLoading] = useState(false);
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [users, setUsers] = useState<User[]>([
    {
        id: "",
        firstName: "",
        lastName: ""
    },
  ]);

  const getClubHead = async () => {
    if (props.clubId !== 0) {
      const responseAdmins = await getAllAdmins(props.clubId);
      setHead(responseAdmins.data.head);
      setLoading(false);
    }
  };

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const showConfirm = (admin: ClubAdmin) => {
    confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {head?.user.firstName} {head?.user.lastName}
          </b>{" "}
          є Головою Куреня, час правління закінчується{" "}
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

  const addClubAdmin = async (admin: ClubAdmin) => {
    await addAdministrator(props.clubId, admin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/clubs/${props.clubId}`,
      `цьому курені`
    );
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };
  const editClubAdmin = async (admin: ClubAdmin) => {
    admin = (await editAdministrator(props.clubId, admin)).data;
    notificationLogic("success", "Адміністратор успішно відредагований");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };


  const handleSubmit = async (values: any) => {
    setLoading(true);

    let admin: ClubAdmin = {
      id: props.admin === undefined ? 0 : props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.AdminType,
      },
      clubId: props.clubId,
      userId: props.admin === undefined
        ? JSON.parse(values.userId).id
        : props.admin.userId,
      user: values.user,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
    };

    try {
      if (values.AdminType === "Голова Куреня" && head !== null) {
        if (head?.userId !== admin.userId) {
          showConfirm(admin);
        } else if (head?.userId === admin.userId) {
        } else {
          editClubAdmin(admin);
        }
      } else {
        if (admin.id === 0) {
          addClubAdmin(admin);
        } else {
          editClubAdmin(admin);
        }
      }
    } finally {
      onAdd();
    }
  };

  useEffect(() => {
    if (!props.visibleModal) {
      form.resetFields();
    }
    getClubHead();
  }, [props]);


  useEffect(() => {
    const fetchData = async () => {
      await adminApi.getUsersForTable().then((response) => {
        setUsers(response.data);
      });
    };
    fetchData();
  }, []);

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
          {users?.map((o) => (
            <Select.Option key={o.id} value={JSON.stringify(o)}>
              {o.firstName + " " + o.lastName}
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
            { value: "Голова Куреня" },
            { value: "Голова СПС" },
            { value: "Фотограф" },
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

export default AddClubsNewSecretaryForm;
