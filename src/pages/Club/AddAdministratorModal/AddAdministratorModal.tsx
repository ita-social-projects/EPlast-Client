import React, { useEffect, useState } from "react";
import "./AddAdministrationModal.less";
import { AutoComplete, Button, Col, DatePicker, Form, Modal, Row } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ClubAdmin from "./../../../models/Club/ClubAdmin";
import AdminType from "./../../../models/Admin/AdminType";
import { getCheckPlastMember } from "../../../api/citiesApi";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/clubsApi";
import {
  emptyInput,
  inputOnlyWhiteSpaces,
} from "../../../components/Notifications/Messages";
import notificationLogic from "./../../../components/Notifications/Notification";
import moment from "moment";
import userApi from "../../../api/UserApi";
import "moment/locale/uk";
import { Roles } from "../../../models/Roles/Roles";
moment.locale("uk-ua");

const confirm = Modal.confirm;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: ClubAdmin;
  setAdmin: (admin: ClubAdmin) => void;
  clubId: number;
  clubName: string;
  onAdd?: (admin?: ClubAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [head, setHead] = useState<ClubAdmin>();
  const [headDeputy, setHeadDeputy] = useState<ClubAdmin>();
  const [admins, setAdmins] = useState<ClubAdmin[]>([]);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const classes = require("../Club/Modal.module.css");

  const disabledEndDate = (current: any) => {
    return current && current < moment();
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const showConfirm = (newAdmin: ClubAdmin, existingAdmin: ClubAdmin) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div className={classes.Style}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління
          закінчується{" "}
          <b>
            {moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        if (newAdmin.id === 0) {
          addClubAdmin(newAdmin);
        } else {
          editClubAdmin(newAdmin);
        }
      },
    });
  };

  const showDisableModal = async (admin: ClubAdmin) => {
    return Modal.warning({
      title: "Ви не можете призначити роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          є Головою Куреня, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {},
    });
  };

  const showDisable = async (admin: ClubAdmin) => {
    return Modal.warning({
      title: "Ви не можете призначити роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          вже має таку роль, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {},
    });
  };

  const showPlastMemberDisable = async (admin: ClubAdmin) => {
    return Modal.warning({
      title: "Ви не можете призначити роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          не є членом Пласту.
        </div>
      ),
      onOk() {},
    });
  };

  const addClubAdmin = async (admin: ClubAdmin) => {
    admin = (await addAdministrator(props.admin.clubId, admin)).data;
    notificationLogic("success", "Користувач успішно доданий в провід");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const editClubAdmin = async (admin: ClubAdmin) => {
    admin = (await editAdministrator(props.admin.clubId, admin)).data;
    notificationLogic("success", "Адміністратор успішно відредагований");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const getClubAdmins = async () => {
    setLoading(true);
    if (props.clubId !== 0) {
      const responseAdmins = await getAllAdmins(props.clubId);
      setAdmins(responseAdmins.data.administration);
      setHead(responseAdmins.data.head);
      setHeadDeputy(responseAdmins.data.headDeputy);
      setLoading(false);
    }
  };

  const checkAdminId = async (admin: ClubAdmin) => {
    if (admin.id === 0) {
      await addClubAdmin(admin);
    } else {
      await editClubAdmin(admin);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    let admin: ClubAdmin = {
      id: props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.adminType,
      },
      clubId: props.clubId,
      user: props.admin.user,
      userId: props.admin.userId,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
    };
    try {
      const head = (admins as ClubAdmin[]).find(
        (x) => x.adminType.adminTypeName === Roles.KurinHead
      );
      if (admin !== undefined) {
        admin.adminType.adminTypeName =
          admin.adminType.adminTypeName[0].toUpperCase() +
          admin.adminType.adminTypeName.slice(1);
      }
      const existingAdmin = (admins as ClubAdmin[]).find(
        (x) => x.adminType.adminTypeName === admin.adminType.adminTypeName
      );
      if (head?.userId === admin.userId) {
        showConfirm(admin,head);
      } else if (
        existingAdmin?.userId === admin.userId &&
        existingAdmin?.endDate === admin.endDate
      ) {
        showDisable(admin);
      } else if (
        admin.adminType.adminTypeName === "Голова КПР" ||
        admin.adminType.adminTypeName === "Член КПР" ||
        admin.adminType.adminTypeName === Roles.KurinHead ||
        admin.adminType.adminTypeName === Roles.KurinHeadDeputy
      ) {
        const check = await getCheckPlastMember(admin.userId);
        if (check.data) {
          await checkAdminId(admin);
        } else {
          showPlastMemberDisable(admin);
        }
      } else if (existingAdmin !== undefined) {
        showConfirm(admin, existingAdmin);
      } else {
        await checkAdminId(admin);
      }
    } finally {
      props.setVisibleModal(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
      setLoadingButton(false);
    }
    getClubAdmins();
    const userRoles = userApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? `Додати в провід куреня ${props.clubName}`
          : "Редагування проводу"
      }
      visible={props.visibleModal}
      footer={null}
      confirmLoading={loading}
      className="addAdministrationModal"
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>
        <Form.Item
          className="adminTypeFormItem"
          name="adminType"
          label="Виберіть тип адміністрування"
          labelCol={{ span: 24 }}
          initialValue={props.admin.adminType.adminTypeName}
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
            {
              pattern: /^\s*\S.*$/,
              message: inputOnlyWhiteSpaces(),
            },
          ]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              {
                value: Roles.KurinHead,
                disabled:
                  activeUserRoles.includes(Roles.KurinHeadDeputy) &&
                  !activeUserRoles.includes(Roles.Admin),
              },
              { value: Roles.KurinHeadDeputy },
              { value: "Голова КПР" },
              { value: "Фотограф" },
              { value: "Писар" },
              { value: "Скарбник" },
              { value: "Домівкар" },
              { value: "Член КПР" },
            ]}
            placeholder={"Тип адміністрування"}
            value={props.admin.adminType.adminTypeName}
          />
        </Form.Item>
        <Row>
          <Col span={11}>
            <Form.Item
              name="startDate"
              label="Час початку"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.startDate
                  ? moment.utc(props.admin.startDate).local()
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledStartDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.startDate
                    ? moment.utc(props.admin.startDate).local()
                    : undefined
                }
                onChange={(e) => setStartDate(e)}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="endDate"
              label="Час кінця"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.endDate
                  ? moment.utc(props.admin.endDate).local()
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.endDate
                    ? moment.utc(props.admin.endDate).local()
                    : undefined
                }
                onChange={(e) => setEndDate(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="cancelConfirmButtons">
          <Row justify="end">
            <Col xs={11} sm={5}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
            </Col>
            <Col
              className="publishButton"
              xs={{ span: 11, offset: 2 }}
              sm={{ span: 6, offset: 1 }}
            >
              <Button
                type="primary"
                loading={loadingButton}
                onClick={() => {
                  setLoadingButton(true);
                  handleSubmit(form.getFieldsValue());
                }}
              >
                Опублікувати
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdministratorModal;
