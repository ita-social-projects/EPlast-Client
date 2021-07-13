import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Upload,
  Button,
  Row,
  Col,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Modal, Drawer } from 'antd';
import documentsApi, {
  TypePostParser
} from "../../api/documentsApi";
import { getBase64 } from "../userPage/EditUserPage/Services";
import notificationLogic from "../../components/Notifications/Notification";
import formclasses from "../DecisionTable/FormAddDecision.module.css";
import {
  emptyInput,
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  maxLength,
  successfulDeleteAction,
} from "../../components/Notifications/Messages"
import { DocumentOnCreateData } from "../../models/Documents/DocumentOnCreateData";
import { MethodicDocumentType } from "../../models/Documents/MethodicDocumentType"
import { FileWrapper, GoverningBody } from "../../api/decisionsApi";
import { DocumentWrapper } from "../../models/Documents/DocumentWraper";
interface Props {
  id:Number;
  setVisibleModal: (visibleModal: boolean) => void;
  visibleModal: boolean;
   record :any 
 
}

const EditDocumentsModal = ({id,setVisibleModal,visibleModal,record}: Props) => {
  const [form] = Form.useForm();
  
console.log(record);
const handleCancel = () => {
  setVisibleModal(false);
  form.resetFields();
}






  return (
    <Drawer
    width="auto"
    title="Додати документ"
    visible={visibleModal}
    onClose={handleCancel}
    footer={null}
  >
    <Form name="basic">
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Тип документу"
            labelCol={{ span: 24 }}
            name="methodicDocumentType"
            rules={[{ required: true, message: emptyInput() }]}
          >
            <Select className={formclasses.selectField}>
             
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            labelCol={{ span: 24 }}
            label="Назва документу"
            name="name"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
              {
                max: 60,
                message: maxLength(60)
              },
            ]}
          >
            <Input className={formclasses.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Орган, що видав документ"
            initialValue = {record.dateOfGranting}
            labelCol={{ span: 24 }}
            name="governingBody"
            rules={[{ required: true, message: emptyInput() }]}
          >
            <Select
              showSearch
              placeholder="Оберіть орган"
              className={formclasses.selectField}
            >
             
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            name="datepicker"
            label="Дата документу"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: emptyInput() }]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              className={formclasses.selectField}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Короткий зміст (опис) документу"
            labelCol={{ span: 24 }}
            name="description"
            rules={[{ required: true, message: emptyInput() }]}
          >
            <Input.TextArea allowClear className={formclasses.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Прикріпити" labelCol={{ span: 24 }}>
            <Form.Item
              className={formclasses.formField}
              name="dragger"
              valuePropName="fileList"
              noStyle
            >
              <Upload.Dragger
                name="file"
                className={formclasses.formField}
                multiple={false}
                showUploadList={false}
                accept=".doc,.docx,.png,.xls,xlsx,.png,.pdf,.jpg,.jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                headers={{ authorization: "authorization-text" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#3c5438" }} />
                </p>
                <p className="ant-upload-hint">
                  Клікніть або перетягніть файл для завантаження
                </p>

              </Upload.Dragger>

             
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item style={{ textAlign: "right" }} className={formclasses.formField}>
            <Button
              key="back"
              onClick={alert}
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
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </Drawer>
  );
  
};

export default EditDocumentsModal;
