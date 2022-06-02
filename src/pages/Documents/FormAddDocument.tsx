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
import documentsApi, { TypePostParser } from "../../api/documentsApi";
import { getBase64 } from "../userPage/EditUserPage/Services";
import notificationLogic from "../../components/Notifications/Notification";
import formclasses from "../DecisionTable/FormAddDecision.module.css";
import {
  emptyInput,
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
  fileIsEmpty,
} from "../../components/Notifications/Messages";
import { DocumentOnCreateData } from "../../models/Documents/DocumentOnCreateData";
import { MethodicDocumentType } from "../../models/Documents/MethodicDocumentType";
import { FileWrapper, GoverningBody } from "../../api/decisionsApi";
import { DocumentWrapper } from "../../models/Documents/DocumentWraper";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import moment from "moment";

const checkFile = (fileSize: number, fileName: string): boolean => {
  const extension = fileName.split(".").reverse()[0].toLowerCase();
  const isCorrectExtension =
    extension.indexOf("pdf") !== -1 ||
    extension.indexOf("jpg") !== -1 ||
    extension.indexOf("jpeg") !== -1 ||
    extension.indexOf("png") !== -1 ||
    extension.indexOf("docx") !== -1 ||
    extension.indexOf("doc") !== -1 ||
    extension.indexOf("txt") !== -1 ||
    extension.indexOf("csv") !== -1 ||
    extension.indexOf("xls") !== -1 ||
    extension.indexOf("xml") !== -1 ||
    extension.indexOf("odt") !== -1 ||
    extension.indexOf("ods") !== -1;
  if (!isCorrectExtension) {
    notificationLogic(
      "error",
      possibleFileExtensions(
        "pdf, docx, doc, txt, csv, xls, xml, jpg, jpeg, png, odt, ods."
      )
    );
  }

  const isEmptyFile = fileSize !== 0;
  if (!isEmptyFile) notificationLogic("error", fileIsEmpty());

  return isCorrectExtension && isEmptyFile;
};

interface FormAddDocumentsProps {
  setVisibleModal: (visibleModal: boolean) => void
  onAdd: () => void
};

const FormAddDocument: React.FC<FormAddDocumentsProps> = ({ setVisibleModal, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<FileWrapper>({
    FileAsBase64: null,
    FileName: null,
  });
  const [data, setData] = useState<DocumentOnCreateData>({
    governingBodies: Array<GoverningBody>(),
    methodicDocumentTypesItems: Array<MethodicDocumentType>(),
  });
  const [form] = Form.useForm();

  const handler = {
    normFileEvent: (e: { fileList: any }) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    click: {
      cancelBtn: () => {
        form.resetFields();
        setFileData({ FileAsBase64: null, FileName: null });
        setVisibleModal(false);
      }
    },
    requestUpload: (info: any) => {
      if (info.file === null) {
        notificationLogic("error", fileIsNotUpload());
        return;
      }
      if (info.file.size > 3145728) {
        notificationLogic("error", fileIsTooBig(3));
        return;
      }
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          setFileData({
            FileAsBase64: base64.split(",")[1],
            FileName: info.file.name,
          });
        });
        notificationLogic("success", fileIsUpload());
      }
    },
    finish: {
      form: async (values: any) => {
        setLoading(true);
        const newDocument: DocumentWrapper = {
          MethodicDocument: {
            id: 0,
            name: values.name,
            type: TypePostParser(JSON.parse(values.methodicDocumentType)),
            governingBody: JSON.parse(values.governingBody),
            description: values.description,
            date: moment(values.datepicker).format("YYYY-MM-DD HH:mm:ss"),
            fileName: fileData.FileName,
          },
          fileAsBase64: fileData.FileAsBase64,
        };
        await documentsApi.post(newDocument);
        setVisibleModal(false);
        onAdd();
        form.resetFields();
        setFileData({ FileAsBase64: null, FileName: null });
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    (async () => {
      await documentsApi
        .getOnCreate()
        .then((d: DocumentOnCreateData) => setData(d));
    })()
  }, []);

  return (
    <Form
      name="basic"
      onFinish={handler.finish.form}
      form={form}
      id="area"
      style={{ position: "relative" }}
    >
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Тип документу"
            labelCol={{ span: 24 }}
            name="methodicDocumentType"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select
              className={formclasses.selectField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {data?.methodicDocumentTypesItems.map((dst) => (
                <Select.Option key={dst.value} value={JSON.stringify(dst)}>
                  {dst.text}
                </Select.Option>
              ))}
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
            rules={descriptionValidation.DecisionAndDocumentName}
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
            labelCol={{ span: 24 }}
            name="governingBody"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Оберіть орган"
              className={formclasses.selectField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {data?.governingBodies.map((g) => (
                <Select.Option key={g.id} value={JSON.stringify(g)}>
                  {g.governingBodyName}
                </Select.Option>
              ))}
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
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              className={formclasses.selectField}
              getPopupContainer={() =>
                document.getElementById("area")! as HTMLElement
              }
              popupStyle={{ position: "absolute" }}
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
            rules={descriptionValidation.DescriptionAndQuestions}
          >
            <Input.TextArea
              allowClear
              className={formclasses.inputField}
              maxLength={201}
            />
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
              getValueFromEvent={handler.normFileEvent}
              noStyle
            >
              <Upload.Dragger
                name="file"
                customRequest={handler.requestUpload}
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

                {fileData.FileAsBase64 !== null && (
                  <div>
                    <div style={{ wordBreak: "break-word" }}>
                      {" "}
                      {fileData.FileName}{" "}
                    </div>{" "}
                  </div>
                )}
              </Upload.Dragger>

              {fileData.FileAsBase64 !== null && (
                <div>
                  <Button
                    className={formclasses.cardButtonDocuments}
                    onClick={() => {
                      setFileData({ FileAsBase64: null, FileName: null });
                      notificationLogic(
                        "success",
                        successfulDeleteAction("Файл")
                      );
                    }}
                  >
                    {" "}
                    Видалити файл
                  </Button>{" "}
                </div>
              )}
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            style={{ textAlign: "right" }}
            className={formclasses.formField}
          >
            <Button
              key="back"
              onClick={handler.click.cancelBtn}
              className={formclasses.buttons}
            >
              Відмінити
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={formclasses.buttons}
              loading={loading}
            >
              Опублікувати
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddDocument;
