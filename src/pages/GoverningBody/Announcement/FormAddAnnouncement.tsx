import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../components/Notifications/Messages";
import {
  addAnnouncement,
  getAllAnnouncements,
  getAllUserId,
} from "../../../api/governingBodiesApi";
import { Announcement } from "../../../models/GoverningBody/Announcement/Announcement";
import NotificationBoxApi from "../../../api/NotificationBoxApi";

type FormAddAnnouncementProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (arg0: string) => void;
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const { setVisibleModal, onAdd } = props;
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [distData, setDistData] = useState<Announcement[]>(
    Array<Announcement>()
  );
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getAllAnnouncements().then((response) => {
        setDistData(response.data);
      });
     
      setLoadingUserStatus(true);
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const newNotification = async () => {
    await NotificationBoxApi.createNotifications(
      users,
      "Додане нове оголошення.",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/governingBodies/announcements`,
      `Переглянути`
    );
  };

  const handleSubmit = (values: any) => {
    setSubmitLoading(true);
    setVisibleModal(false);
    form.resetFields();
    onAdd(values.text);
    setSubmitLoading(false);
  };

  return (
    <Form
      name="basic"
      onFinish={handleSubmit}
      form={form}
      id="area"
      style={{ position: "relative" }}
    >
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Текст оголошення"
            labelCol={{ span: 24 }}
            name="text"
            rules={[
              { required: true, message: emptyInput() },
              {
                max: 1000,
                message: maxLength(1000),
              },
            ]}
          >
            <Input.TextArea
              allowClear
              autoSize={{
                minRows: 2,
                maxRows: 15,
              }}
              className={formclasses.inputField}
              maxLength={1001}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button
                key="back"
                onClick={handleCancel}
                className={formclasses.buttons}
              >
                Відмінити
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={formclasses.buttons}
              >
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddAnnouncement;
