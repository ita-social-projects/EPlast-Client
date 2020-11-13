import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Upload,
  Button,
  AutoComplete,
  Row,
  Col,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

import decisionsApi, {
  DecisionOnCreateData,
  decisionStatusType,
  DecisionWrapper,
  decisionTarget,
  FileWrapper,
  Organization,
  statusTypePostParser,
} from "../../api/decisionsApi";
import { getBase64 } from "../userPage/EditUserPage/Services";
import notificationLogic from "../../components/Notifications/Notification";
import formclasses from "./FormAddDecision.module.css";
type FormAddDecisionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
};
const FormAddDecision: React.FC<FormAddDecisionProps> = (props: any) => {
  const { setVisibleModal, onAdd } = props;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileData, setFileData] = useState<FileWrapper>({
    FileAsBase64: null,
    FileName: null,
  });
  const [form] = Form.useForm();
  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const handleCancel = () => {
    form.resetFields();
    setFileData({ FileAsBase64: null, FileName: null });
    setVisibleModal(false);
  };
  const handleUpload = (info: any) => {
    if (info.file !== null) {
      if (info.file.size <= 3145728) {
        if (checkFile(info.file.name)) {
          getBase64(info.file, (base64: string) => {
            setFileData({
              FileAsBase64: base64.split(",")[1],
              FileName: info.file.name,
            });
          });
          notificationLogic("success", "Файл завантажено");
        }
      } else {
        notificationLogic("error", "Розмір файлу перевищує 3 Мб");
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням файлу");
    }
  };
  const checkFile = (fileName: string): boolean => {
    const extension = fileName.split(".").reverse()[0];
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
        "Можливі розширення файлів: pdf, docx, doc, txt, csv, xls, xml, jpg, jpeg, png, odt, ods."
      );
    }
    return isCorrectExtension;
  };

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    const newDecision: DecisionWrapper = {
      decision: {
        id: 0,
        name: values.name,
        decisionStatusType: statusTypePostParser(
          JSON.parse(values.decisionStatusType)
        ),
        organization: JSON.parse(values.organization),
        decisionTarget: { id: 0, targetName: values.decisionTarget },
        description: values.description,
        date:
          /* eslint no-underscore-dangle: ["error", { "allow": ["_d"] }] */ values
            .datepicker._d,
        fileName: fileData.FileName,
      },
      fileAsBase64: fileData.FileAsBase64,
    };
    await decisionsApi.post(newDecision);
    setVisibleModal(false);
    onAdd();
    form.resetFields();
    setSubmitLoading(false);
  };

  const [data, setData] = useState<DecisionOnCreateData>({
    organizations: Array<Organization>(),
    decisionStatusTypeListItems: Array<decisionStatusType>(),
    decisionTargets: Array<decisionTarget>(),
  });
  useEffect(() => {
    const fetchData = async () => {
      await decisionsApi
        .getOnCreate()
        .then((d: DecisionOnCreateData) => setData(d));
    };
    fetchData();
  }, []);
  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            labelCol={{ span: 24 }}
            label="Назва рішення"
            name="name"
            rules={[
              {
                required: true,
                message: "Це поле має бути заповненим",
              },
              { 
                max: 60,
                message: 'Назва рішення не має перевищувати 60 символів!' 
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
            label="Рішення органу"
            labelCol={{ span: 24 }}
            name="organization"
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
          >
            <Select
              placeholder="Оберіть орган"
              className={formclasses.selectField}
            >
              {data?.organizations.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)}>
                  {o.organizationName}
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
            label="Тема рішення"
            labelCol={{ span: 24 }}
            name="decisionTarget"
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
          >
            <AutoComplete
              filterOption={true}
              className={formclasses.selectField}
            >
              {data?.decisionTargets.map((dt) => (
                <Select.Option key={dt.id} value={dt.targetName}>
                  {dt.targetName}
                </Select.Option>
              ))}
            </AutoComplete>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            name="datepicker"
            label="Дата рішення"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
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
            label="Текст рішення"
            labelCol={{ span: 24 }}
            name="description"
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
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
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                name="file"
                customRequest={handleUpload}
                className={formclasses.inputField}
                multiple={false}
                showUploadList={false}
                accept=".doc,.docx,.png,.xls,xlsx,.png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                    <div>{fileData.FileName}</div>{" "}
                  </div>
                )}
              </Upload.Dragger>

              {fileData.FileAsBase64 !== null && (
                <div>
                  <Button
                    className={formclasses.cardButton}
                    onClick={() => {
                      setFileData({ FileAsBase64: null, FileName: null });
                      notificationLogic("success", "Файл видалено");
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
            className={formclasses.formField}
            label="Статус рішення"
            labelCol={{ span: 24 }}
            name="decisionStatusType"
            rules={[{ required: true, message: "Це поле має бути заповненим" }]}
          >
            <Select className={formclasses.selectField}>
              {data?.decisionStatusTypeListItems.map((dst) => (
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
          <Form.Item style={{ textAlign: "right" }}>
            <Button
              key="back"
              onClick={handleCancel}
              className={formclasses.buttons}
            >
              Відмінити
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={formclasses.buttons}
              loading={submitLoading}
            >
              Опублікувати
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddDecision;
