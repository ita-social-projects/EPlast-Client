import React, { useEffect, useState } from "react";
import { AutoComplete, Button, DatePicker, Drawer, Form, Input, Mentions, Row, Select, Upload } from "antd";
import jwt from "jwt-decode";
import moment from "moment";
import { UploadOutlined } from '@ant-design/icons';
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import debounce from 'lodash/debounce';
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import { emptyInput, fileIsEmpty, fileIsTooBig, fileIsUpload, possibleFileExtensions, successfulDeleteAction } from "../../components/Notifications/Messages";
import decisionsApi, { DecisionOnCreateData, DecisionWrapper, FileWrapper, statusTypePostParser } from "../../api/decisionsApi";
import { getShortUserInfo } from "../../api/adminApi";
import AuthLocalStorage from "../../AuthLocalStorage";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import { getBase64 } from "../userPage/EditUserPage/Services";


interface FormAddDecisionProps {
  modalVisible: boolean;
  setModalVisible: (visibleModal: boolean) => void;
  onSubmit: () => void;
}

const FormAddDecision: React.FC<FormAddDecisionProps> = (props) => {
  // eslint-disable-next-line react/prop-types
  const { modalVisible, setModalVisible, onSubmit } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileData, setFileData] = useState<FileWrapper>({
    FileAsBase64: null,
    FileName: null
  });
  const [userMentionsLoading, setUserMentionsLoading] = useState<boolean>(true);
  const [userMentions, setUserMentions] = useState<{ id: number, firstName: string, lastName: string, email: string }[]>([]);
  const [decisionTargetAutocompletion, setDecisionTargetAutocompletion] = useState<{ id: number, targetName: string }[]>([]);
  const [form] = Form.useForm();
  const [data, setData] = useState<DecisionOnCreateData>({ governingBodies: [], decisionStatusTypeListItems: [] });
  const allowedFileExtensions: string[] = ["pdf", "docx", "doc", "txt", "csv", "xls", "xml", "jpg", "jpeg", "png", "odt", "ods"];

  const updateUserMentions = async (searchString: string) => {
    setUserMentions([]);

    if (searchString.trim()) {
      setUserMentionsLoading(true);
      const response = await getShortUserInfo(searchString); // DEBOUNCE IT !!!
      setUserMentions(response.data);
    }
    setUserMentionsLoading(false);
  };

  const debouncedUpdateUserMentions = debounce(updateUserMentions, 600);

  const updateDecisionTargetAutocompletion = async (searchString: string) => {
    setDecisionTargetAutocompletion([]);

    if (searchString.trim()) {
      const response = await decisionsApi.getTargetList(searchString); // DEBOUNCE IT !!!
      setDecisionTargetAutocompletion(response);
    }
  };

  const debouncedUpdateDecisionTargetAutocompletion = debounce(updateDecisionTargetAutocompletion, 600);

  const notifyMentionedUsers = async (description: string, title: string) => {
    const usersToNotify = userMentions.filter((u) =>
      description.includes(`@${u.firstName} ${u.lastName}`)
    );
    const uniqueUsersIds = Array.from(new Set(usersToNotify.map((u) => u.id.toString())));
    await NotificationBoxApi.createNotifications(
      uniqueUsersIds,
      `Тебе позначили в рішенні: ${title}.`,
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/decisions`,
      "Перейти до рішень"
    );
  };

  const handleFileUpload = (fileInfo: RcCustomRequestOptions) => {
    const fileExtension = fileInfo.file.name.split(".").reverse()[0].toLowerCase();
    if (!allowedFileExtensions.some(e => e === fileExtension)) {
      notificationLogic("error", possibleFileExtensions(allowedFileExtensions.join(", ")));
      return;
    }

    if (fileInfo.file.size === 0) {
      notificationLogic("error", fileIsEmpty());
      return;
    }

    if (fileInfo.file.size > 3 * 1024 * 1024) {
      notificationLogic("error", fileIsTooBig(3));
      return;
    }

    getBase64(fileInfo.file, (base64: string) => {
      setFileData({
        FileAsBase64: base64.split(",")[1],
        FileName: fileInfo.file.name,
      });
    });
    notificationLogic("success", fileIsUpload());
  }

  useEffect(() => {
    decisionsApi.getOnCreate()
      .then(response => setData(response));
  }, []);

  const submitForm = async (values: any) => {
    setSubmitting(true);

    const curToken = AuthLocalStorage.getToken() as string;
    const user: any = jwt(curToken);

    const newDecision: DecisionWrapper = {
      decision: {
        id: 0,
        name: values.name,
        decisionStatusType: statusTypePostParser(values.decisionStatusType),
        governingBody: JSON.parse(values.governingBody),
        decisionTarget: { id: 0, targetName: values.decisionTarget },
        description: values.description,
        date: moment(values.datepicker).format("YYYY-MM-DD HH:mm:ss"),
        fileName: fileData.FileName,
        userId: user.nameid,
      },
      fileAsBase64: fileData.FileAsBase64,
    };

    await decisionsApi.post(newDecision);
    setModalVisible(false);
    onSubmit();

    form.resetFields();
    setFileData({ FileAsBase64: null, FileName: null });
    await notifyMentionedUsers(values.description, values.name);

    setSubmitting(false);
  };

  return <Drawer
    visible={modalVisible}
    title="Додати рішення Пластового проводу"
    onClose={() => setModalVisible(false)}
    width="600px"
  >
    <Form
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={submitForm}
      form={form}
    >

      <Form.Item
        label='Назва рішення'
        name='name'
        rules={descriptionValidation.DecisionAndDocumentName}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Рішення органу"
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
          showSearch
        >
          {data?.governingBodies.map((g) =>
            <Select.Option key={g.id} value={JSON.stringify(g)}>
              {g.governingBodyName}
            </Select.Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item
        label="Тема рішення"
        name="decisionTarget"
        rules={descriptionValidation.DecisionTarget}
      >
        <AutoComplete
          onSearch={(s) => {
            if (s) {
              debouncedUpdateDecisionTargetAutocompletion(s);
            }
            else {
              setUserMentions([]);
            }
          }}
        >
          {decisionTargetAutocompletion?.map(v =>
            <AutoComplete.Option key={`decisionTarget${v.id}`} value={v.targetName}>
              {v.targetName}
            </AutoComplete.Option>
          )}
        </AutoComplete>
      </Form.Item>

      <Form.Item
        name="datepicker"
        label="Дата рішення"
        rules={[
          {
            required: true,
            message: emptyInput(),
          },
        ]}
      >
        <DatePicker
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        label="Текст рішення"
        name="description"
        rules={descriptionValidation.Description}
      >
        <Mentions
          notFoundContent="Користувачів не знайдено"
          loading={userMentionsLoading}
          onSearch={debouncedUpdateUserMentions}
          prefix=" @"
        >
          {userMentions?.map((u) => (
            <Mentions.Option
              className="mentionOption"
              key={`userMention${u.id}`}
              value={`${u.firstName} ${u.lastName}`}
            >
              {`${u.firstName} ${u.lastName} (${u.email})`}
            </Mentions.Option>
          ))}
        </Mentions>
      </Form.Item>

      <Form.Item
        label="Прикріпити файл"
        name="fileUpload"
      >
        <Row
          gutter={4}
          justify="space-between"
        >
          <Upload
            accept={allowedFileExtensions.map(e => `.${e}`).join(",")}
            customRequest={handleFileUpload}
            multiple={false}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Натисніть, щоб завантажити файл</Button>
          </Upload>

          {fileData.FileAsBase64
            ? <Button
              danger
              onClick={() => {
                setFileData({ FileAsBase64: null, FileName: null });
                notificationLogic("success", successfulDeleteAction("Файл"));
              }}
            >
              Видалити файл {fileData.FileName}
            </Button>
            : null}
        </Row>
      </Form.Item>

      < Form.Item
        label="Статус рішення"
        name="decisionStatusType"
        rules={[
          {
            required: true,
            message: emptyInput(),
          },
        ]}
      >
        <Select
          placeholder="Оберіть статус"
        >
          {data?.decisionStatusTypeListItems.map((dst) =>
            <Select.Option key={`status${dst.value}`} value={dst.value}>
              {dst.text}
            </Select.Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
        >
          Опублікувати
        </Button>
      </Form.Item>

    </Form>
  </Drawer >
}

export default FormAddDecision;