import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import {
  checkRoleNameExists,
  editAdministrator,
} from "../../api/governingBodiesApi";
import { inputOnlyWhiteSpaces } from "../../components/Notifications/Messages";
import GoverningBodyAdmin from "../../models/GoverningBody/GoverningBodyAdmin";
import notificationLogic from "../../components/Notifications/Notification";
import NotificationBoxApi from "../../api/NotificationBoxApi";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: GoverningBodyAdmin;
}

const EditAdministratorModal = ({
  visibleModal,
  setVisibleModal,
  admin,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const disabledEndDate = (current: any) => {
    return current && current < moment();
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const handleCancel = () => {
    setVisibleModal(false);
  };

  const createNotification = async (userId: Array<string>, message: string) => {
    await NotificationBoxApi.createNotifications(
      userId,
      `${message}: `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regionalBoard/administrations`,
      `Переглянути`
    );
  };

  const checkRoleName = async () => {
    const roleValue = form.getFieldValue("governingBodyAdminRole");
    if (roleValue.trim().length !== 0) {
      checkRoleNameExists(roleValue).then((response) => {
        if (response.data) {
          form.setFields([
            {
              name: "governingBodyAdminRole",
              errors: ["Така роль адміністратора вже існує!"],
            },
          ]);
        }
      });
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const newAdmin = admin;
    newAdmin.startDate = values.startDate;
    newAdmin.endDate = values.endDate;
    newAdmin.governingBodyAdminRole = values.governingBodyAdminRole;
    await editAdministrator(newAdmin.id, newAdmin);
    notificationLogic("success", "Адміністратор успішно відредагований");
    await createNotification(
      [newAdmin.userId],
      `Вам була присвоєна нова роль: '${newAdmin.governingBodyAdminRole}`
    );
    setLoading(false);
    setVisibleModal(false);
  };

  return (
    <Modal
      title="Редагування проводу"
      visible={visibleModal}
      footer={null}
      confirmLoading={loading}
      className="editAdministrationModal"
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>
        <Form.Item
          className="adminTypeFormItem"
          name="governingBodyAdminRole"
          label="Змінити роль адміністратора"
          labelCol={{ span: 24 }}
          initialValue={admin?.governingBodyAdminRole}
          rules={[
            {
              pattern: /^\s*\S.*$/,
              message: inputOnlyWhiteSpaces(),
            },
          ]}
        >
          <Input onChange={checkRoleName} />
        </Form.Item>
        <Row>
          <Col>
            <Form.Item
              name="startDate"
              label="Час початку"
              labelCol={{ span: 24 }}
              initialValue={
                admin.startDate
                  ? moment.utc(admin.startDate).local()
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledStartDate}
                format="DD.MM.YYYY"
                value={
                  admin.startDate
                    ? moment.utc(admin.startDate).local()
                    : undefined
                }
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="endDate"
              label="Час кінця"
              labelCol={{ span: 24 }}
              initialValue={
                admin.endDate ? moment.utc(admin.endDate).local() : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  admin.endDate ? moment.utc(admin.endDate).local() : undefined
                }
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
            <Col className="publishButton">
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
export default EditAdministratorModal;
