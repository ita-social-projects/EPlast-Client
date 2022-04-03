import React, { useEffect, useState } from "react";
import "../Regions/AddDocumentModal.less";
import { Button, Col, DatePicker, Form, Modal, Row, Upload, Input } from "antd";
import { getBase64 } from "../userPage/EditUserPage/Services";
import notificationLogic from "../../components/Notifications/Notification";
import { addDocument } from "../../api/regionsApi";
import { InboxOutlined } from "@ant-design/icons";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import moment from "moment";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
  fileIsEmpty,
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
  const [disabled, setDisabled] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const maxNameLength: number = 50;

  useEffect(() => {
    setFileUploaded(false);
  }, [props.visibleModal]);

  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const getExtension = (fileName: string) => {
    let splittedFileName = fileName.split(".");
    return "." + splittedFileName[splittedFileName.length - 1];
  };

  const onFileNameChange = (e: any) => {
    let input = e.target.value.slice(0, maxNameLength);

    if (fileName == "") {
      setFileName(input);
    } else {
      let extension: string = getExtension(fileName);
      setFileName(input + extension);

      if (fileUploaded) {
        setDisabled(false);
      }
    }
  };

  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          props.setDocument({ ...props.document, blobName: base64 });
          let extension: string = getExtension(fileName);
          let fileNameWithoutExtension: string = fileName.replace(
            extension,
            ""
          );
          let newExtension: string = getExtension(info.file.name);
          setFileName(fileNameWithoutExtension + newExtension);
          setDisabled(false);
          setFileUploaded(true);
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

    const isFileEmpty = fileSize === 0;
    if (isFileEmpty) {
      notificationLogic("error", fileIsEmpty());
    }
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("pdf, doc, docx"));
      setDisabled(true);
    }
    const maxFileSize = 3145728;
    const isSmaller3mb = fileSize < maxFileSize;
    if (!isSmaller3mb) {
      notificationLogic("error", fileIsTooBig(3));
      setDisabled(true);
    }
    return isSmaller3mb && isCorrectExtension && !isFileEmpty;
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
          <Form.Item
            name="documentName"
            label="Назва документу"
            rules={descriptionValidation.Name}
          >
            <Input
              placeholder="Введіть назву документу"
              onChange={onFileNameChange}
            />
          </Form.Item>
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
            {props.document.blobName !== null && (
              <div style={{ wordBreak: "break-word" }}>
                {" "}
                {fileUploaded ? fileName : null}{" "}
              </div>
            )}
          </Upload.Dragger>

          {props.document.blobName ? (
            <div>
              <Button
                className="cardButton"
                onClick={() => {
                  removeFile();
                  notificationLogic("success", successfulDeleteAction("Файл"));
                  setFileUploaded(false);
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
