import React, { useState } from "react";
import "../Regions/AddDocumentModal.less";
import { Button, Col, DatePicker, Form, Modal, Row, Upload } from "antd";
import { getBase64 } from "../userPage/EditUserPage/Services";
import notificationLogic from "../../components/Notifications/Notification";
import { addDocument } from "../../api/regionsApi";
import { InboxOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
} from "../../components/Notifications/Messages";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  document: any;
  setDocument: (document: any) => void;
  regionId: number;
  onAdd: (document: any) => void;
}

const AddDocumentModal = (props: Props) => {
  const [form] = Form.useForm();
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          props.setDocument({ ...props.document, blobName: base64 });
          setFileName(info.file.name);
        });
        notificationLogic("success", fileIsUpload());
        setDisabled(false);
      }
    } else {
      notificationLogic("error", fileIsNotUpload());
      setDisabled(true);
    }
  };

  const checkFile = (fileSize: number, fileName: string): boolean => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("pdf") !== -1 ||
      extension.indexOf("doc") !== -1 ||
      extension.indexOf("docx") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("pdf, doc, docx"));
      setDisabled(true);
    }

    const isSmaller3mb = fileSize < 3145728;
    if (!isSmaller3mb) {
      notificationLogic("error", fileIsTooBig(3));
      setDisabled(true);
    }
    return isSmaller3mb && isCorrectExtension;
  };

  const handleSubmit = async (values: any) => {
    setButtonLoading(true);
    setLoading(true);
    const newDocument: any = {
      id: 0,
      blobName: props.document.blobName,
      fileName: fileName,
      submitDate: values.datepicker?._d,
      regionId: props.regionId,
    };
    await addDocument(newDocument);
    props.onAdd(newDocument);
    props.setVisibleModal(false);
    form.resetFields();
    setLoading(false);
    removeFile();
    setButtonLoading(false);
  };

  const removeFile = () => {
    props.setDocument({ ...props.document, blobName: "" });
    setFileName("");
    setDisabled(true);
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
    form.resetFields();
    removeFile();
  };

  return (
    <Modal
      title="Додати документ"
      visible={props.visibleModal}
      footer={null}
      confirmLoading={loading}
      className="addDocumentModal"
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>
        <div className="formFields">
          <Form.Item name="datepicker" label="Дата документу">
            <DatePicker format="DD.MM.YYYY" className="formSelect" />
          </Form.Item>
        </div>

        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            name="file"
            customRequest={handleUpload}
            multiple={false}
            showUploadList={false}
            accept=".doc,.docx,.pdf"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#3c5438" }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження
            </p>
            {props.document.blobName !== null && <div>{fileName}</div>}
          </Upload.Dragger>

          {props.document.blobName ? (
            <div>
              <Button
                className="cardButton"
                onClick={() => {
                  removeFile();
                  notificationLogic("success", successfulDeleteAction("Файл"));
                }}
              >
                Видалити файл
              </Button>
            </div>
          ) : null}
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
              <Button
                type="primary"
                loading={buttonLoading}
                disabled={disabled}
                htmlType="submit"
              >
                Опублікувати
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDocumentModal;
