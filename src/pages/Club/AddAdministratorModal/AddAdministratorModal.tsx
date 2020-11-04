import React, { useEffect, useState } from "react";
import "./AddAdministrationModal.less";
import { AutoComplete, Button, Col, DatePicker, Form, Modal, Row } from "antd";
import ClubAdmin from "./../../../models/Club/ClubAdmin";
import AdminType from "./../../../models/Admin/AdminType";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/clubsApi";
import notificationLogic from "./../../../components/Notifications/Notification";
import moment from "moment";
import "moment/locale/uk";
import ConfirmHeadAdminModal from "./ConfirmHeadAdminModal";
moment.locale("uk-ua");

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: ClubAdmin;
  setAdmin: (admin: ClubAdmin) => void;
  clubId: number;
  onAdd?: (admin?: ClubAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [head, setHead] = useState<ClubAdmin>();
  const [adminType, setAdminType] = useState<string>();
  const [endDayOld, setEndDayOld] = useState<any>();
  const [oldAdminFirstName, setOldAdminFirstName] = useState<string>();
  const [oldAdminLastName, setOldAdminLastName] = useState<string>();

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const getClubHead = async () => {
    if (props.clubId !== 0) {
      const responseAdmins = await getAllAdmins(props.clubId);
      setHead(responseAdmins.data.head);
      setLoading(false);
    }
  };

  const handleClick = async (value: any) => {
    setAdminType(value);
    setEndDayOld(moment(head?.endDate).format("DD.MM.YYYY"));
    setOldAdminFirstName(head?.user.firstName);
    setOldAdminLastName(head?.user.lastName);
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
      if (admin.id === 0) {
        if (values.adminType === "Голова Куреня" && head !== null) {
          setConfirmModal(true);
          props.setVisibleModal(false);
        } else {
          admin = (await addAdministrator(props.admin.clubId, admin)).data;
          props.onAdd?.(admin);
          props.setVisibleModal(false);
          notificationLogic("success", "Користувач успішно доданий в провід");
          props.onChange?.(props.admin.userId, values.adminType);
        }
      } else {
        admin = (await editAdministrator(props.admin.clubId, admin)).data;
        props.onAdd?.(admin);
        props.setVisibleModal(false);
        notificationLogic("success", "Адміністратор успішно відредагований");
        props.onChange?.(props.admin.userId, values.adminType);
      }
    } finally {
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
    getClubHead();
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? "Додати в провід станиці"
          : "Редагувати адміністратора"
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
          rules={[{ required: true, message: "Це поле є обов'язковим" }]}
        >
          <AutoComplete
            className="adminTypeSelect"
            onChange={handleClick}
            options={[
              { value: "Голова Чату" },
              { value: "Голова Куреня" },
              { value: "Голова СПС" },
              { value: "Фотограф" },
              { value: "Писар" },
              { value: "Скарбник" },
              { value: "Домівкар" },
              { value: "Член СПР" },
            ]}
            filterOption={(inputValue, option) =>
              option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            placeholder={"Тип адміністрування"}
            value={props.admin.adminType.adminTypeName}
          ></AutoComplete>
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
        <ConfirmHeadAdminModal
          onChange={props.onChange}
          visibleModal={confirmModal}
          setVisibleModal={setConfirmModal}
          admin={props.admin}
          clubId={props.clubId}
          adminType={adminType}
          startDate={startDate}
          endDate={endDate}
          endDayOld={endDayOld}
          oldAdminFirstName={oldAdminFirstName}
          oldAdminLastName={oldAdminLastName}
          onAdd={props.onAdd}
        />
      </Form>
    </Modal>
  );
};

export default AddAdministratorModal;
