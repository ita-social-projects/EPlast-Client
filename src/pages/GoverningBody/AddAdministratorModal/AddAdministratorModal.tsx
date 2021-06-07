import React, { useEffect, useState } from "react";
import "./AddAdministrationModal.less";
import { AutoComplete, Button, Col, DatePicker, Form, Modal, Row } from "antd";
import GoverningBodyAdmin from "../../../models/GoverningBody/GoverningBodyAdmin";
import AdminType from "../../../models/Admin/AdminType";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/governingBodiesApi";
import notificationLogic from "../../../components/Notifications/Notification";
import moment from "moment";
import{emptyInput} from "../../../components/Notifications/Messages"

const confirm = Modal.confirm;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: GoverningBodyAdmin;
  setAdmin: (admin: GoverningBodyAdmin) => void;
  governingBodyId: number;
  onAdd?: (admin?: GoverningBodyAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [head, setHead] = useState<GoverningBodyAdmin>();

  const getGoverningBodyHead = async () => {
    if (props.governingBodyId !== 0) {
      await getAllAdmins(props.governingBodyId).then((response) => {
        setHead(response.data.head);
      });
      setLoading(false);
    }
  };

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const showConfirm = (admin: GoverningBodyAdmin) => {
    confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {head?.user.firstName} {head?.user.lastName}
          </b>{" "}
          є Головою Керівного Органу, час правління закінчується{" "}
          <b>
            {moment(head?.endDate).format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment(head?.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        if (admin.id === 0) {
          addGoverningBodyAdmin(admin);
        } else {
          editGoverningBodyAdmin(admin);
        }
      },
    });
  };

  const addGoverningBodyAdmin = async (admin: GoverningBodyAdmin) => {
    admin = (await addAdministrator(props.admin.governingBodyId, admin)).data;
    notificationLogic("success", "Користувач успішно доданий в провід");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };
  const editGoverningBodyAdmin = async (admin: GoverningBodyAdmin) => {
    admin = (await editAdministrator(props.admin.governingBodyId, admin)).data;
    notificationLogic("success", "Адміністратор успішно відредагований");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    let admin: GoverningBodyAdmin = {
      id: props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.adminType,
      },
      governingBodyId: props.governingBodyId,
      user: props.admin.user,
      userId: props.admin.userId,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
    };

    try {
      if (values.adminType === "Голова Керівного Органу" && head !== null) {
        if (head?.userId !== admin.userId) {
          showConfirm(admin);
        } else {
          editGoverningBodyAdmin(admin);
        }
      } else {
        if (admin.id === 0) {
          addGoverningBodyAdmin(admin);
        } else {
          editGoverningBodyAdmin(admin);
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
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? "Додати в провід керівного органу"
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
          rules={[{ required: true, message: emptyInput() }]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              { value: "Голова Керівного Органу" },
              { value: "Голова СПС" },
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
            onChange={getGoverningBodyHead}
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
      </Form>
    </Modal>
  );
};

export default AddAdministratorModal;
