import { Button, Col, Form, Modal, Row, Upload } from "antd";
import React, { useState } from "react";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import { addExtractFromUPU } from "../../../../api/blankApi";
import { getBase64 } from "../../EditUserPage/Services";
import notificationLogic from '../../../../components/Notifications/Notification';
import { InboxOutlined } from "@ant-design/icons";
import{
  fileIsUpload,
  fileIsNotUpload, 
  possibleFileExtensions, 
  fileIsTooBig, 
  successfulDeleteAction,
} from "../../../../components/Notifications/Messages"

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    document: BlankDocument;
    setDocument: (document: BlankDocument) => void;
    userId: number;
}
  
const AddExtractFromUPUModal = (props: Props) => {
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
              props.setDocument({...props.document, blobName: base64});
              setFileName(info.file.name);
            });
            notificationLogic("success", fileIsUpload());    
            setDisabled(false);
        }
      } else {
        notificationLogic("error", fileIsNotUpload());
      }
    };

    const checkFile = (fileSize: number, fileName: string): boolean => {
      const extension = fileName.split(".").reverse()[0].toLowerCase();
      const isCorrectExtension =
      extension.indexOf("pdf") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("png") !== -1 ||
      extension.indexOf("docx") !== -1 ||
      extension.indexOf("doc") !== -1;
      if (!isCorrectExtension) {
        notificationLogic("error", possibleFileExtensions("pdf, docx, doc, jpg, jpeg, png"));
        setDisabled(true);
        return isCorrectExtension;
      }
      
      const isSmaller3mb = fileSize < 3145728;
      if (!isSmaller3mb) {
        notificationLogic("error", fileIsTooBig(3));
        setDisabled(true);
        return isSmaller3mb;
      }

      return isSmaller3mb && isCorrectExtension;
    };

    const handleSubmit = async (values: any) => {
      setButtonLoading(true);
      setLoading(true);
      const newDocument: BlankDocument = {
        id: 0,
        blobName: props.document.blobName,
        fileName: fileName,
        userId: props.userId
      };
      
      await addExtractFromUPU(props.userId, newDocument);
      props.setVisibleModal(false);
      form.resetFields();
      removeFile();
      setDisabled(true);
      setLoading(false);
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
        title="Додати виписку"
        visible={props.visibleModal}
        footer={null}
        confirmLoading={loading}
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
              multiple={false}
              showUploadList={false}
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
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

          <Row justify="end">
            <Col md={24} xs={24}>
              <Form.Item style={{ textAlign: "right" }}>
                <Button key="back" onClick={handleCancel}>
                  Відмінити
                </Button>
                <Button  style={{ marginLeft: "7px" }} type="primary" htmlType="submit" loading={buttonLoading} disabled={disabled}>
                  Опублікувати
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
}

export default AddExtractFromUPUModal;