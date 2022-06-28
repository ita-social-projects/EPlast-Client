import { Button, Col, Form, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { addFollowerWithId, getCities } from "../../api/citiesApi";
import { emptyInput } from "../../components/Notifications/Messages";
import CityProfile from "../../models/City/CityProfile";
import notificationLogic from "../../components/Notifications/Notification";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  record: string;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
}

const AcceptUserToCityForm = ({ record, setShowModal, showModal }: Props) => {
  const [cities, setCities] = useState<CityProfile[]>([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const response = await getCities();
    setCities(response.data);
  };

  const handleFinish = async (values: any) => {
    try {
      await addFollowerWithId(values.userCity, record);
      notificationLogic("success", "Користувача успішно додано в станицю");
    } catch {
      notificationLogic("success", "Щось пішло не так");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchData();
  }, [showModal]);

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item
        name="userCity"
        rules={[{ required: true, message: emptyInput() }]}
      >
        <Select placeholder="Оберіть станицю">
          {cities.map((apd) => {
            return (
              <Select.Option key={apd.id} value={apd.id}>
                {apd.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item className="cancelConfirmButtons">
        <Row justify="end" align="middle">
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
  );
};

export default AcceptUserToCityForm;
