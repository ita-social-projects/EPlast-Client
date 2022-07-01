import { Button, Col, Form, Modal, Row, Upload } from "antd";
import React from "react";
import { useState } from "react";
import notificationLogic from "../../../../components/Notifications/Notification";
import { addAchievementDocuments } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import { getBase64 } from "../../EditUserPage/Services";
import { InboxOutlined } from "@ant-design/icons";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
} from "../../../../components/Notifications/Messages";

const { Dragger } = Upload;

interface Props {
  visibleModal: boolean;
  showModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  setshowModal: (showModal: boolean) => void;
  userId: string;
}
const AddAchievementsModal = (props: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<BlankDocument[]>([]);
  const [disabled, setDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (checkFile(info.file.name, info.file.size)) {
        getBase64(info.file, (base64: string) => {
          const newDocument: BlankDocument = {
            id: 0,
            blobName: base64,
            fileName: info.file.name,
            userId: props.userId,
          };
          files.push(newDocument);
          setFiles([...files]);
        });
        notificationLogic("success", fileIsUpload());
        setDisabled(false);
      }
    } else {
      notificationLogic("error", fileIsNotUpload());
    }
    form.resetFields();
  };

  const checkFile = (fileName: string, fileSize: number): boolean => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("pdf") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("png") !== -1 ||
      extension.indexOf("docx") !== -1 ||
      extension.indexOf("doc") !== -1;
    if (!isCorrectExtension) {
      notificationLogic(
        "error",
        possibleFileExtensions("pdf, docx, doc, jpg, jpeg, png")
      );
      return isCorrectExtension;
    }
    const isSmaller3mb = fileSize < 3145728;
    if (!isSmaller3mb) {
      notificationLogic("error", fileIsTooBig(3));
      return isSmaller3mb;
    }
    return isCorrectExtension && isSmaller3mb;
  };

  const handleSubmit = async () => {
    setButtonLoading(true);
    setLoading(true);
    await addAchievementDocuments(props.userId, files);
    props.setVisibleModal(false);
    props.setshowModal(true);
    form.resetFields();
    removeFile();
    setDisabled(true);
    setLoading(false);
    setButtonLoading(false);

  };

  const removeFile = () => {
    setFiles([]);
    setDisabled(true);
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
    form.resetFields();
    removeFile();
  };

  return (
    <Modal
      title="Додати досягнення"
      visible={props.visibleModal}
      footer={null}
      confirmLoading={loading}
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>
        <Form.Item>
          <Dragger
            name="file"
            customRequest={handleUpload}
            multiple={true}
            showUploadList={false}
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#3c5438" }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження
            </p>
            {files.length !== 0 &&
              files.map((file) => (
                <div style={{ wordBreak: "break-word" }}> {file.fileName} </div>
              ))}
          </Dragger>
          {files.length !== 0 ? (
            <div>
              <Button
                className="cardButton"
                onClick={() => {
                  removeFile();
                  notificationLogic("success", successfulDeleteAction("Файл"));
                }}
              >
                {files.length > 1 && <p>Видалити файли</p>}
                {files.length === 1 && <p>Видалити файл</p>}
              </Button>
            </div>
          ) : null}
        </Form.Item>
        <Row justify="end">
          <Col md={24} xs={24}>
            <Form.Item style={{ textAlign: "right" }}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
              <Button
                style={{ marginLeft: "7px" }}
                type="primary"
                htmlType="submit"
                loading={buttonLoading}
                disabled={disabled}
              >
                Опублікувати
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddAchievementsModal;
