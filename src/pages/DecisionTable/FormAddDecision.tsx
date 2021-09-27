import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Upload,
  Button,
  Row,
  Col,
  Mentions
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import AuthStore from "../../stores/AuthStore";
import jwt from "jwt-decode";
import decisionsApi, {
  DecisionOnCreateData,
  decisionStatusType,
  DecisionWrapper,
  decisionTarget,
  FileWrapper,
  GoverningBody,
  statusTypePostParser,
} from "../../api/decisionsApi";
import { getBase64 } from "../userPage/EditUserPage/Services";
import adminApi from "../../api/adminApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import formclasses from "./FormAddDecision.module.css";
import {
  emptyInput,
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
} from "../../components/Notifications/Messages"
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";

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
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const { Option } = Mentions;
  const [form] = Form.useForm();
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);

  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onSearch = async (search: string) => {
    if (search !== "" && search !== null) {
      await adminApi.getShortUserInfo(search).then((response) => {
        setUserData(response.data);
        setLoadingUserStatus(false);
      });
    }
  };

  const onSelect = async (select: any) => {
    var user: any = userData.find(u => u.firstName + ' ' + u.lastName === select.value);
    setMentionedUsers(old => [...old, user]);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => [onSearch(search), setLoadingUserStatus(true)], 1000);
    return () => clearTimeout(timeoutId);
  }, [search]);


  const notifyMentionedUsers = async (description: string, title: string) => {
    let usersToNotify = (mentionedUsers.filter(u => description.includes(u.firstName + ' ' + u.lastName)));
    let uniqueUsersIds = Array.from(new Set(usersToNotify.map(u => u.id)));
    await NotificationBoxApi.createNotifications(
      uniqueUsersIds,
      `Тебе позначили в рішенні: ${title}.`,
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/decisions`,
      'Перейти до рішень'
    );
  }

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
          notificationLogic("success", fileIsUpload());
        }
      } else {
        notificationLogic("error", fileIsTooBig(3));
      }
    } else {
      notificationLogic("error", fileIsNotUpload());
    }
  };
  const checkFile = (fileName: string): boolean => {
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
        possibleFileExtensions("pdf, docx, doc, txt, csv, xls, xml, jpg, jpeg, png, odt, ods.")
      );
    }
    return isCorrectExtension;
  };

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    let user: any;
    let curToken = AuthStore.getToken() as string;
    user = jwt(curToken);
    const newDecision: DecisionWrapper = {
      decision: {
        id: 0,
        name: values.name,
        decisionStatusType: statusTypePostParser(
          JSON.parse(values.decisionStatusType)
        ),
        governingBody: JSON.parse(values.governingBody),
        decisionTarget: { id: 0, targetName: values.decisionTarget },
        description: values.description,
        date:
          /* eslint no-underscore-dangle: ["error", { "allow": ["_d"] }] */ values
            .datepicker._d,
        fileName: fileData.FileName,
        userId: user.nameid,
      },
      fileAsBase64: fileData.FileAsBase64,
    };
    await decisionsApi.post(newDecision);
    setVisibleModal(false);
    onAdd();
    form.resetFields();
    setFileData({ FileAsBase64: null, FileName: null });
    setSubmitLoading(false);
    await notifyMentionedUsers(values.description, values.name);
  };

  const [data, setData] = useState<DecisionOnCreateData>({
    governingBodies: Array<GoverningBody>(),
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
    <Form name="basic" onFinish={handleSubmit} form={form} id='area' style={{ position: 'relative' }}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            labelCol={{ span: 24 }}
            label="Назва рішення"
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
            label="Рішення органу"
            labelCol={{ span: 24 }}
            name="governingBody"
            rules={[
              {
                required: true,
                message: emptyInput()
              }
            ]}
          >
            <Select
              placeholder="Оберіть орган"
              className={formclasses.selectField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
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
            label="Тема рішення"
            labelCol={{ span: 24 }}
            name="decisionTarget"
            rules={descriptionValidation.DecisionTarget}
          >
            <Select
              className={formclasses.selectField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
            >
              {data?.decisionTargets.slice(0, 9).map((dt) => (
                <Select.Option key={dt.id} value={dt.targetName} >
                  {dt.targetName}
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
            label="Дата рішення"
            labelCol={{ span: 24 }}
            rules={[
              { 
                required: true, 
                message: emptyInput() 
              }
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              className={formclasses.selectField}
              getPopupContainer={() => document.getElementById('area')! as HTMLElement}
              popupStyle={{ position: 'absolute' }}
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
            rules={descriptionValidation.Description}
          >
            <Mentions
              loading={loadingUserStatus}
              onSearch={(s => setSearch(s))}
              rows={5}
              onSelect={onSelect}
              className={formclasses.formField}
            >
              {userData?.map((u) =>
                <Option
                  key={u.id}
                  value={u.firstName + ' ' + u.lastName}
                >
                  {u.firstName + ' ' + u.lastName}
                </Option>)}
            </Mentions>
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
                    <div style={{ wordBreak: 'break-word' }}> {fileData.FileName} </div>{" "}
                  </div>
                )}
              </Upload.Dragger>

              {fileData.FileAsBase64 !== null && (
                <div>
                  <Button
                    className={formclasses.cardButtonDocuments}
                    onClick={() => {
                      setFileData({ FileAsBase64: null, FileName: null });
                      notificationLogic("success", successfulDeleteAction("Файл"));
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
            rules={[
              { 
                required: true, 
                message: emptyInput() 
              }
            ]}
          >
            <Select
              placeholder="Оберіть статус"
              className={formclasses.selectField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
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
          <Form.Item style={{ textAlign: "right" }} className={formclasses.formField}>
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
