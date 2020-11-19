import { Button, Col, Form, Modal, Row, Upload } from "antd";
import React, { useEffect, useState } from "react";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import { addDocument } from "../../../../api/blankApi";
import { getBase64 } from "../../EditUserPage/Services";
import notificationLogic from '../../../../components/Notifications/Notification';
import { InboxOutlined } from "@ant-design/icons";
import{
  fileIsUpload,
  fileIsNotUpload, 
  possibleFileExtensions, 
  fileIsTooBig, 
  fileIsDeleted,
} from "../../../../components/Notifications/Messages"

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    document: BlankDocument;
    setDocument: (document: BlankDocument) => void;
    userId: number;
}
  
const AddBiographyModal = (props: Props) => {
    const [form] = Form.useForm();
    const [fileName, setFileName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

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
      const extension = fileName.split(".").reverse()[0];
      const isCorrectExtension =
        extension.indexOf("pdf") !== -1;
      if (!isCorrectExtension) {
        notificationLogic("error", possibleFileExtensions("pdf"));
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
      setLoading(true);
      setButtonLoading(true);
      const newDocument: BlankDocument = {
        id: 0,
        blobName: props.document.blobName,
        fileName: fileName,
        userId: props.userId
      };
      
      await addDocument(props.userId, newDocument);
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
        title="Додати життєпис"
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
              accept=".pdf"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#3c5438" }} />
              </p>
              <p className="ant-upload-hint">
                Клікніть або перетягніть файл для завантаження
                (PDF*)
              </p>
              {props.document.blobName !== null && <div>{fileName}</div>}
            </Upload.Dragger>

            {props.document.blobName ? (
              <div>
                <Button
                  className="cardButton"
                  onClick={() => {
                    removeFile();
                    notificationLogic("success", fileIsDeleted());
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
                <Button type="primary" htmlType="submit" loading={buttonLoading} disabled={disabled}>
                  Опублікувати
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default AddBiographyModal;