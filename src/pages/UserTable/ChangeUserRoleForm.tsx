import React, { useState, useEffect } from "react";
import { Form, Button, Select, Row, Col } from "antd";
import adminApi from "../../api/adminApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import activeMembershipApi from "../../api/activeMembershipApi";
import moment from "moment";
import { emptyInput } from "../../components/Notifications/Messages";
import { Roles } from "../../models/Roles/Roles";
import { displayPartsToString } from "typescript";

interface Props {
  record: string;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any;
}

const ChangeUserRoleForm = ({
  record,
  setShowModal,
  onChange,
  user,
}: Props) => {
  const userId = record;
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Array<string>>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { Option } = Select;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await adminApi.getRolesForEdit(userId).then((response) => {
      setRoles(response.data.userRoles);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const addEndDate = async (isEmpty: Boolean) => {
    let currentDates = await activeMembershipApi.getUserDates(userId);
    currentDates.dateEnd = isEmpty ? "0001-01-01T00:00:00" : moment().format();
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleFinish = async (value: any) => {
    if (
      value.userRole == Roles.Supporter &&
      !(await adminApi.isCityMember(userId))
    ) {
      notificationLogic("error", "Користувач не є членом станиці!");
    } else {
      await adminApi.putCurrentRole(userId, value.userRole);

      if (value.userRole === Roles.FormerPlastMember) {
        await addEndDate(false);
      } else if (roles.includes(Roles.FormerPlastMember)) {
        await addEndDate(true);
      }

      onChange(userId, value.userRole);
      form.resetFields();
      setShowModal(false);

      await NotificationBoxApi.createNotifications(
        [userId],
        `Вам надано нову роль: '${value.userRole}'`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
    }
  };

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
        <h4>Оберіть поточну роль користувача</h4>
        <Form.Item
          name="userRole"
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
          ]}
        >
          <Select onChange={handleChange}>
            {roles.includes(Roles.RegisteredUser) ? (
              <Option value={Roles.Supporter}>Прихильник</Option>
            ) : null}
            {roles.includes(Roles.Supporter) ? (
              <Option value={Roles.PlastMember}>
                Дійсний член організації
              </Option>
            ) : null}
            {roles.includes(Roles.Supporter) ||
            roles.includes(Roles.PlastMember) ? (
              <Option value={Roles.FormerPlastMember}>
                Колишній член Пласту
              </Option>
            ) : null}
            {roles.includes(Roles.FormerPlastMember) ? (
              <Option value={Roles.RegisteredUser}>
                Зареєстрований користувач
              </Option>
            ) : null}
          </Select>
        </Form.Item>
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
                Призначити
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeUserRoleForm;
