import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Radio,
  AutoComplete,
  Row,
  Col,
} from "antd";
import adminApi from "../../api/adminApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import activeMembershipApi from "../../api/activeMembershipApi";
import moment from "moment";
import{ emptyInput } from "../../components/Notifications/Messages";
import { Roles } from "../../models/Roles/Roles";

interface Props {
  record: string;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
  user:any
}

const ChangeUserRoleForm = ({ record, setShowModal, onChange, user }: Props) => {
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
    setShowModal(false);
  };

  const addEndDate = async (isEmpty: Boolean) => {
    let currentDates = await activeMembershipApi.getUserDates(userId);
    currentDates.dateEnd = isEmpty ? "0001-01-01T00:00:00" : moment().format();
    await activeMembershipApi.postUserDates(currentDates);
  };
  const  handleChange = (value:string) => {
    console.log(`selected ${value}`);
  }

  const handleFinish = async (value: any) => {
    await adminApi.putCurrentRole(userId, value.userRole);

    if (value.userRole === Roles.FormerPlastMember) {
      await addEndDate(false);
    } else if (roles.includes(Roles.FormerPlastMember)) {
      await addEndDate(true);
    }

    onChange(userId, value.userRole);
    setShowModal(false);

    await NotificationBoxApi.createNotifications(
      [userId],
      `Вам надано нову роль: '${value.userRole}'`,
      NotificationBoxApi.NotificationTypes.UserNotifications
    );
  };

  const handleDisabled = () => {
    if(user.userRoles === Roles.FormerPlastMember) {
      return true
    }
    return false
  }

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
        <Option value={Roles.Supporter} disabled={handleDisabled()}>Прихильник</Option>
        <Option value={Roles.PlastMember} disabled={handleDisabled()}>
          Дійсний член організації
        </Option>
        <Option value={Roles.FormerPlastMember} disabled={handleDisabled()}>Колишній член Пласту</Option>
        <Option value={Roles.RegisteredUser} disabled={disabled}>Зареєстрований користувач</Option>
        
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
