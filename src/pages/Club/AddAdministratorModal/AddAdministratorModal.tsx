import React, { useEffect, useState } from "react";
import "./AddAdministrationModal.less";
import { AutoComplete, Button, Col, DatePicker, Form, Modal, Row } from "antd";
import { ExclamationCircleOutlined} from '@ant-design/icons';
import ClubAdmin from "./../../../models/Club/ClubAdmin";
import AdminType from "./../../../models/Admin/AdminType";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/clubsApi";
import{
  emptyInput,
} from "../../../components/Notifications/Messages"
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
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [head, setHead] = useState<ClubAdmin>();
  const [headDeputy, setHeadDeputy] = useState<ClubAdmin>();
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

  const disabledEndDate = (current: any) => {
    return current && current < moment();
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  function showEditConfirmModal(admin: ClubAdmin) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете змінити роль даного користувача?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, Змінити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
         editClubAdmin(admin);
      },
    });
  }

  const showDiseableModal = async (admin: ClubAdmin) => {
    return Modal.warning({
      title: "Ви не можете змінити роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
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
      onOk() {}
    });
  };

  const showConfirm = (admin: ClubAdmin) => {
    return Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (admin.adminType.adminTypeName.toString() === Roles.KurinHead ?
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
        :
        <div style={{ margin: 10 }}>
        <b>
          {headDeputy?.user.firstName} {headDeputy?.user.lastName}
        </b>{" "}
        є Заступником Голови Куреня, час правління закінчується{" "}
        <b>
          {moment(headDeputy?.endDate).format("DD.MM.YYYY") === "Invalid date"
            ? "ще не скоро"
            : moment(headDeputy?.endDate).format("DD.MM.YYYY")}
        </b>
        .
      </div>
      ),
      onCancel() {},
      async onOk() {
        if (admin.id === 0) {
          addClubAdmin(admin);
        } else {
          editClubAdmin(admin);
        }
      },
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
    if (props.clubId !== 0) {
      const responseAdmins = await getAllAdmins(props.clubId);
      setHead(responseAdmins.data.head);
      setHeadDeputy(responseAdmins.data.headDeputy);
      setLoading(false);
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
      if (values.adminType === Roles.KurinHead) {
        if (head !== null && head?.userId !== admin.userId) {
          console.log(admin);
          showConfirm(admin);
        } else {
          await editClubAdmin(admin);
        }
      } else if (values.adminType === Roles.KurinHeadDeputy ) {
        if (admin.userId == head?.userId) {
            showDiseableModal(admin);
        } else if (headDeputy !== null && headDeputy?.userId !== admin.userId) {
          console.log(admin);
          showConfirm(admin);
        } else {
          await editClubAdmin(admin);
        }
      } else {
        if (admin.userId === head?.userId || admin.userId === headDeputy?.userId) {
            showEditConfirmModal(admin);
        } else {
          await editClubAdmin(admin);
        }
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
    }
    getClubAdmins();
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? `Додати в провід ${props.clubName}`
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
          rules={[{ required: true, message: emptyInput() }]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              { value: Roles.KurinHead, disabled: (activeUserRoles.includes(Roles.KurinHeadDeputy) 
               && !activeUserRoles.includes(Roles.Admin)) },
              { value: Roles.KurinHeadDeputy },
              { value: "Голова СПС" },
              { value: "Фотограф" },
              { value: "Писар" },
              { value: "Скарбник" },
              { value: "Домівкар" },
              { value: "Член СПР" },
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
                  ? moment(props.admin.startDate)
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledStartDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.startDate
                    ? moment(props.admin.startDate)
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
                props.admin.endDate ? moment(props.admin.endDate) : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.endDate ? moment(props.admin.endDate) : undefined
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
              <Button type="primary" htmlType="submit">
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
