import React, { useState, useEffect } from "react";
import {
  Form,
  DatePicker,
  AutoComplete,
  Select,
  Modal,
  Button,
  Input,
  Tooltip,
  Row,
} from "antd";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import classes from "../../Regions/Form.module.css";
import adminApi from "../../../api/adminApi";
import notificationLogic from "../../../components/Notifications/Notification";
import {
  addAdministrator,
  editAdministrator,
} from "../../../api/governingBodiesApi";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import userApi from "../../../api/UserApi";
import {
  emptyInput,
  incorrectEmail,
  maxLength,
  successfulEditAction,
} from "../../../components/Notifications/Messages";
import GoverningBodyAdmin from "../../../models/GoverningBody/GoverningBodyAdmin";
import AdminType from "../../../models/Admin/AdminType";
import { Roles } from "../../../models/Roles/Roles";
import "./AddAdministrationModal.less";
import ShortUserInfo from "../../../models/UserTable/ShortUserInfo";
import Spinner from "../../Spinner/Spinner";
import GoverningBodyAdminTypes from "../GoverningBodyAdminTypes";
import { minAvailableDate } from "../../../constants/TimeConstants";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";

const { confirm } = Modal;

const AddGoverningBodiesSecretaryForm = (props: any) => {
  const { onAdd, setAdmins, admins, setGoverningBodyHead } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<ShortUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [workEmail, setWorkEmail] = useState<string>("");

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && (current > moment() || !current.isAfter(minAvailableDate));
  };

  const addGoverningBodyAdmin = async (admin: GoverningBodyAdmin) => {
    const { data: newAdministrator } = await addAdministrator(admin.governingBodyId, admin);
    if (admin.adminType.adminTypeName == Roles.GoverningBodyHead) {
      setGoverningBodyHead(admin);
    }

    if (Date.now() < new Date(newAdministrator.endDate).getTime() || newAdministrator.endDate === null) {
      notificationLogic("success", "Користувач успішно доданий в провід");
      setAdmins((old: GoverningBodyAdmin[]) => [...old, newAdministrator]);
    } else {
      notificationLogic("info", "Колишні діловодства краю були змінені");
    }

    form.resetFields();
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regionalBoard/governingBodies/${props.governingBodyId}`,
      `цьому керівному органі`,
      true
    );
  };

  const editGoverningBodyAdmin = async (admin: GoverningBodyAdmin) => {
    await editAdministrator(props.governingBodyId, admin);
    notificationLogic("success", successfulEditAction("Адміністратора"));
    form.resetFields();
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була відредагована адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regionalBoard/governingBodies/${props.governingBodyId}`,
      `цьому керівному органі`,
      true
    );
  };

  const showConfirm = (
    newAdmin: GoverningBodyAdmin,
    existingAdmin: GoverningBodyAdmin
  ) => {
    confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління
          закінчується{" "}
          <b>
            {existingAdmin.endDate === null ||
              existingAdmin.endDate === undefined
              ? "ще не скоро"
              : moment(existingAdmin.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() { },
      onOk() {
        if (newAdmin.id === 0) {
          addGoverningBodyAdmin(newAdmin);
          setAdmins(
            (admins as GoverningBodyAdmin[]).map((x) =>
              x.userId === existingAdmin?.userId ? newAdmin : x
            )
          );
        } else {
          editGoverningBodyAdmin(newAdmin);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    if (loading) return;
    setLoading(true);
    const newAdmin: GoverningBodyAdmin = {
      id: props.admin === undefined ? 0 : props.admin.id,
      userId:
        props.admin === undefined
          ? JSON.parse(values.userId).id
          : props.admin.userId,
      user: JSON.parse(values.userId),
      adminType: {
        ...new AdminType(),
        adminTypeName: values.AdminType,
      },
      governingBodyId: props.governingBodyId,
      startDate: values.startDate,
      endDate: values.endDate,
      workEmail,
    };
    newAdmin.user.imagePath = (
      await userApi.getImage(newAdmin.user.imagePath)
    ).data;
    if (newAdmin.id === 0) {
      try {
        const existingAdmin = (admins as GoverningBodyAdmin[]).find(
          (x) => x.adminType.adminTypeName === newAdmin.adminType.adminTypeName
        );
        if (existingAdmin !== undefined) {
          showConfirm(newAdmin, existingAdmin);
        } else {
          addGoverningBodyAdmin(newAdmin);
        }
      } catch (e) {
        if (typeof e == 'string')
          throw new Error(e);
        else if (e instanceof Error)
          throw new Error(e.message);
      }
    } else {
      editGoverningBodyAdmin(newAdmin);
    }
    setLoading(false);
  };

  const onUserSelect = (value: any) => {
    const email: string = JSON.parse(value.toString()).email;
    setWorkEmail(email);
    form.setFieldsValue({ workEmail: email });
  };

  const fetchData = async () => {
    setUsersLoading(true);
    try {
      const responseUsers = await adminApi.getUsersForGoverningBodies();
      setUsers(responseUsers.data);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
    }
  }, [props]);

  return loading ? (
    <Spinner />
  ) : (
    <Form
      name="basic"
      onFinish={handleSubmit}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
    >
      <Form.Item
        className={classes.formSelectAlignCenter}
        label="Користувач"
        name="userId"
        rules={[
          {
            required: props.admin === undefined,
            message: emptyInput(),
          },
        ]}
      >
        <Select
          showSearch
          loading={usersLoading}
          onChange={(value) => onUserSelect(value)}
        >
          {users?.map((o) =>
            o.isInDeputyRole ? (
              <Select.Option key={o.id} value={JSON.stringify(o)}>
                <div className={classes.formOption}>
                  {o.firstName + " " + o.lastName}
                  <Tooltip title="Уже є адміністратором">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              </Select.Option>
            ) : (
              <Select.Option key={o.id} value={JSON.stringify(o)}>
                {o.firstName + " " + o.lastName}
              </Select.Option>
            )
          )}
        </Select>
      </Form.Item>

      <Form.Item
        className={classes.formSelectAlignCenter}
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
          options={[
            { value: GoverningBodyAdminTypes.Head },
            { value: GoverningBodyAdminTypes.Secretar },
            { value: GoverningBodyAdminTypes.Progress },
            { value: GoverningBodyAdminTypes.Social },
            { value: GoverningBodyAdminTypes.Сommunication },
          ]}
          placeholder="Тип адміністрування"
        />
      </Form.Item>

      <Form.Item
        className={classes.formSelectAlignCenter}
        name="workEmail"
        label="Електронна пошта"
        rules={[
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
            message: <div className="">{incorrectEmail}</div>,
          },
          {
            max: 50,
            message: <div className="">{maxLength(50)}</div>,
          },
          {
            required: true,
            message: emptyInput(),
          },
        ]}
      >
        <Input
          placeholder="Електронна пошта"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Дата початку"
        name="startDate"
        rules={[descriptionValidation.Required]}
        initialValue={
          props.admin === undefined
            ? undefined
            : moment.utc(props.admin.startDate).local()
        }
      >
        <DatePicker
          className={classes.datePicker}
          disabledDate={disabledStartDate}
          onChange={(e) => setStartDate(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        label="Дата кінця"
        name="endDate"
        rules={[descriptionValidation.Required]}
        initialValue={
          props.admin === undefined
            ? undefined
            : props.admin.endDate === null
              ? undefined
              : moment.utc(props.admin.endDate).local()
        }
      >
        <DatePicker
          className={classes.datePicker}
          disabledDate={disabledEndDate}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Row className={classes.submitRow}>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Row>
    </Form>
  );
};

export default AddGoverningBodiesSecretaryForm;
