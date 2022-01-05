import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Drawer } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../components/Notifications/Messages";
import {
  getAnnouncementsById
} from "../../../api/governingBodiesApi";
import { Announcement } from "../../../models/GoverningBody/Announcement/Announcement";

interface Props {
  visibleModal: boolean;
  id: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onEdit: (id: number, text: string) => void;
}  

const EditAnnouncementModal = ({visibleModal, setVisibleModal, onEdit, id}: Props) => {
  const [form] = Form.useForm();
  const [announcement, setAnnouncement] = useState<any>()
  const [text, setText] = useState<string>("");
  useEffect(() => {
    getAnnouncement(id);
  }, [id])

  const getAnnouncement = async(id: number) => {
    await getAnnouncementsById(id)
    .then(response => {
      setAnnouncement(response.data)
      setText(response.data.text)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handleCancel = () => {
    setVisibleModal(false);
  };

  const handleSubmit = (values: any) => {
    setVisibleModal(false);
    form.resetFields();
    console.log(text);
    onEdit(id,text);
  };
  
  return (
    <Drawer
      title="Редагувати оголошення"
      placement="right"
      width="auto"
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
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
             initialValue={text}
          >
            <p></p>
            <Input.TextArea
              name="text-area"
              value = {text}
              onChange={(e) => {setText(e.target.value)}}
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
                Зберегти
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Drawer>
  );
};

export default EditAnnouncementModal;
