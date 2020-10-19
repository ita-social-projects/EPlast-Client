import { Button, Col, Form, Modal, Row, Upload } from "antd";
import React from "react";
import {useState } from "react";
import notificationLogic from '../../../../components/Notifications/Notification';
import { addAchievementDocuments } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import { getBase64 } from "../../EditUserPage/Services";
import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  userId: number;
}
const AddAchievementsModal = (props: Props) => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<BlankDocument[]>([]);
  const [disabled, setDisabled] = useState(true);


  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (checkFile(info.file.name)) {
        getBase64(info.file, (base64: string) => {
          const newDocument: BlankDocument = {
            id: 0,
            blobName: base64,
            fileName: info.file.name,
            userId: props.userId
          };
          files.push(newDocument);
          setFiles([...files]);
        });
        notificationLogic("success", `Файл "${info.file.name}" завантажено`);
        setDisabled(false);
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням файлу");
    }
    form.resetFields();
  };

  const checkFile = (fileName: string): boolean => {
    const extension = fileName.split(".").reverse()[0];
    const isCorrectExtension =
      extension.indexOf("pdf") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("png") !== -1
    if (!isCorrectExtension) {
      notificationLogic("error", "Можливі розширення файлів: pdf,jpg,jpeg,png");
      setDisabled(true);
    }
    return isCorrectExtension;
  }

  const handleSubmit = async () => {
    setLoading(true);
    await addAchievementDocuments(props.userId, files);
    props.setVisibleModal(false);
    form.resetFields();
    removeFile();
    setDisabled(true);
    setLoading(false);
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
            accept=".png,.jpg,.jpeg,.pdf"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#3c5438" }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження (PDF*,PNG*,JPG*,JPEG*)
                </p>
            {files.length !== 0 && files.map(file => (
              <div>{file.fileName};</div>
            ))}
          </Dragger>
          {files.length !== 0 ? (
            <div>
              <Button
                className="cardButton"
                onClick={() => {
                  removeFile();
                  notificationLogic("success", "Файли видалено");
                }}
              >
                {files.length > 1 &&
                  <p>Видалити файли</p>
                }
                {files.length === 1 &&
                  <p>Видалити файл</p>
                }
              </Button>
            </div>
          ) : null}
        </Form.Item>
        <Form.Item>
          <Row justify="end">
            <Col xs={11} sm={5}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
                  </Button>
            </Col>
            <Col
              xs={{ span: 11, offset: 2 }}
              sm={{ span: 6, offset: 1 }}
            >
              <Button type="primary" htmlType="submit" disabled={disabled}>
                Опублікувати
                  </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default AddAchievementsModal;