import { Button, Col, Form, Modal, Row, Upload } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import notificationLogic from '../../../../components/Notifications/Notification';
import { addAchievementDocuments } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import { getBase64 } from "../../EditUserPage/Services";
import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  documents: BlankDocument[];
  setDocuments: (documents: BlankDocument[]) => void;
  userId: number;
}
const AddAchievementsModal = (props: Props) => {

  const [form] = Form.useForm();
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<BlankDocument[]>([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
  }, []);

  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
            props.setDocuments({ ...props.documents, });
            setFileName(info.file.name);
        });
        notificationLogic("success", "Файли завантажено");
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням файлу");
    }
    setDisabled(false);
  };

  const checkFile = (fileSize: number, fileName: string): boolean => {
    const extension = fileName.split(".").reverse()[0];
    const isCorrectExtension =
      extension.indexOf("pdf") !== -1 ||
      extension.indexOf("doc") !== -1 ||
      extension.indexOf("docx") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", "Можливі розширення файлів: pdf, doc, docx");
    }
    return isCorrectExtension;
  }

  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    props.documents.forEach((document:BlankDocument)=>{  
      const newDocument: BlankDocument[] = [{
        id: 0,
        blobName: document.blobName,
        fileName: fileName,
        userId: props.userId
      }];
      setFiles(newDocument);
    })
      
    await addAchievementDocuments(props.userId, files);
    props.setVisibleModal(false);
    form.resetFields();
    removeFile();
    setDisabled(true);
    setLoading(false);
  };


  const removeFile = () => {
    props.documents.map((document:BlankDocument)=>{
      props.setDocuments({ ...props.documents, });
      setFileName("");
      setDisabled(true);
    })
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
    form.resetFields();
    removeFile();
  };

  return (
    <Modal
      title="Додати життєпис"
      visible={props.visibleModal}
      footer={null}
      confirmLoading={loading}
      className="addDocumentModal"
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>

        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            name="file"
            customRequest={handleUpload}
            multiple={true}
            showUploadList={false}
            accept=".pdf"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#3c5438" }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження
                </p>
            {props.documents.forEach((document:BlankDocument)=>{
              document.blobName !== null && <div>{fileName}</div>
            })
            }
          </Upload.Dragger>

          {props.documents.length !==0 ? (
            <div>
              <Button
                className="cardButton"
                onClick={() => {
                  removeFile();
                  notificationLogic("success", "Файл видалено");
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