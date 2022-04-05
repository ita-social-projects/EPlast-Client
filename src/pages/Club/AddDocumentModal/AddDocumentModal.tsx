import React, { useEffect, useState } from "react";
import classes from "../../Regions/Form.module.css"; 
import "./AddDocumentModal.less";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import { getBase64 } from "../../userPage/EditUserPage/Services";
import notificationLogic from "../../../components/Notifications/Notification";
import ClubDocument from "../../../models/Club/ClubDocument";
import { addDocument, getDocumentTypes } from "../../../api/clubsApi";
import ClubDocumentType from "../../../models/Club/ClubDocumentType";
import { InboxOutlined } from "@ant-design/icons";
import {
  emptyInput,
  fileIsUpload,
  fileIsAdded,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
  fileIsEmpty,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  document: ClubDocument;
  setDocument: (document: ClubDocument) => void;
  ClubId: number;
  onAdd: (document: ClubDocument) => void;
}

const nameMaxLength = 40;
const AddDocumentModal = (props: Props) => {
  const [form] = Form.useForm();
  const [documentTypes, setDocumentTypes] = useState<ClubDocumentType[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const getAllDocumenTypes = async () => {
    const response = await getDocumentTypes();

    setDocumentTypes(response.data);
  };

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

    const isEmptyFile = fileSize !== 0;
    if (!isEmptyFile) notificationLogic("error", fileIsEmpty());

    const isSmaller3mb = fileSize < 3145728;
    if (!isSmaller3mb) {
      notificationLogic("error", fileIsTooBig(3));
      setDisabled(true);
    }

    return isSmaller3mb && isEmptyFile && isCorrectExtension;
  };

  const handleSubmit = async (values: any) => {
    setButtonLoading(true);
    setLoading(true);
    const newDocument: ClubDocument = {
      id: 0,
      blobName: props.document.blobName,
      fileName: fileName,
      clubDocumentType: {
        ...new ClubDocumentType(),
        name: values.documentType,
      },
      submitDate: values.datepicker?._d,
      ClubId: props.ClubId,
    };

    await addDocument(props.ClubId, newDocument);
    props.onAdd(newDocument);
    notificationLogic("success", fileIsAdded());
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

  const onSearch = (val: any) => {};

  useEffect(() => {
    getAllDocumenTypes();
  }, []);

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
            className={classes.formSelectAlignCenter}
            label="Тип документу"
            name="documentType"
            rules={[{ required: true, message: emptyInput() }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
              className="formSelect"
              placeholder="Оберіть тип документу"
            >
              {documentTypes.map((dt) => (
                <Select.Option key={dt.id} value={dt.name}>
                  {dt.name}
                </Select.Option>
              ))}
            </Select>
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
              <div style={{ wordBreak: "break-word" }}> {fileName} </div>
            )}
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

export default AddDocumentModal;
