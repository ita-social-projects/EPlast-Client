import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import GoverningBodyAdmin from "../../../models/GoverningBody/GoverningBodyAdmin";
import AdminType from "../../../models/Admin/AdminType";
import { useState } from "react";
import {
  addMainAdmin,
  checkRoleNameExists,
} from "../../../api/governingBodiesApi";
import {
  dataCantBeFetched,
  emptyInput,
  inputOnlyWhiteSpaces,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import User from "../../../models/UserTable/User";
import GoverningBodyUser from "../../../models/GoverningBody/GoverningBodyUser";
import { getUsersForGoverningBodies } from "../../../api/adminApi";
import notificationLogic from "../../../components/Notifications/Notification";
import { getUsersForGoverningBodyAdminForm } from "../../../api/governingBodiesApi";

type Props = {
  setVisibleModal: (visibleModal: boolean) => void;
  visibleModal: boolean;
  handleAddGoverningBodyAdmin: (values: any) => void;
};

const AddRegionBoardMainAdminForm = ({
  visibleModal,
  setVisibleModal,
  handleAddGoverningBodyAdmin,
}: Props) => {
  const [form] = Form.useForm();

  const [members, setMembers] = useState<GoverningBodyUser[]>([]);

  const [loadingUsersStatus, setLoadingUsersStatus] = useState(true);

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const disabledEndDate = (current: any) => {
    return current && current < moment();
  };

  const handleCancel = () => {
    setVisibleModal(false);
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

  const fetchData = async () => {
    getUsersForGoverningBodyAdminForm()
      .then((response) => {
        setMembers(response.data);
      })
      .catch(() => {
        notificationLogic(
          "error",
          dataCantBeFetched("користувачів. Спробуйте пізніше")
        );
      })
      .finally(() => {
        setLoadingUsersStatus(false);
      });
  };

  useEffect(() => {
    if (visibleModal) {
      setLoadingUsersStatus(true);
      form.resetFields();
      fetchData();
    }
  }, [visibleModal]);

  return (
    <Form name="basic" onFinish={handleAddGoverningBodyAdmin} form={form}>
      <Form.Item
        style={{ display: "flex" }}
        label="Користувач"
        name="user"
        rules={[
          {
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <Select showSearch loading={loadingUsersStatus}>
          {members.map((o) => (
            <Select.Option
              disabled={o.isInLowerRole || o.isInDeputyRole}
              key={o.id}
              value={JSON.stringify(o)}
            >
              {`${o.firstName} ${o.lastName} (${o.email})`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        className="adminTypeFormItem"
        name="governingBodyAdminRole"
        label="Роль адміністратора"
        labelCol={{ span: 24 }}
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
          >
            <DatePicker
              className="formSelect"
              disabledDate={disabledStartDate}
              format="DD.MM.YYYY"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="endDate" label="Час кінця" labelCol={{ span: 24 }}>
            <DatePicker
              className="formSelect"
              disabledDate={disabledEndDate}
              format="DD.MM.YYYY"
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
  );
};

export default AddRegionBoardMainAdminForm;
