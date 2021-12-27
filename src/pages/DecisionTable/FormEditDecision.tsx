import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Mentions } from "antd";
import decisionsApi, { DecisionPost } from "../../api/decisionsApi";
import formclasses from "./FormEditDecision.module.css";
import jwt from "jwt-decode";
import AuthStore from "../../stores/AuthStore";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import adminApi from "../../api/adminApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";

interface Props {
  record: number;
  decision: DecisionPost;
  setShowModal: (showModal: boolean) => void;
  onEdit: (id: number, name: string, description: string) => void;
}

const FormEditDecision = ({
  record,
  setShowModal,
  onEdit,
  decision,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const id = record;
  const [form] = Form.useForm();
  const [tip, setTip] = useState<string>('Введіть  ім\`я користувача');
  const [tipOnNotFound, setTipOnNotFound] = useState<string>('Введіть  ім\`я користувача');
  const [userData, setUserData] = useState<any[]>([]);
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [search, setSearch] = useState<string>('');
  const { Option } = Mentions;
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);
  useEffect(() => {
    setLoading(true);
    form.setFieldsValue({
      name: decision.name,
      description: decision.description,
    });
    setLoading(false);
  }, [decision]);
  const handleCancel = () => {
    setShowModal(false);
  };
  
  const onSearch = async (search: string) => {
    setTipOnNotFound("") 
    setUserData([]);
    const removeElements = (elms:NodeListOf<any>) => elms.forEach(el => el.remove());
    removeElements( document.querySelectorAll(".mentionOption") );
    
    var trigger = search,
    regexp = new RegExp('^[\\\\./]'),
    test = regexp.test(trigger); 
  
    if (search !== "" && search !== null && test != true) {
      await adminApi.getShortUserInfo(search).then((response) => {
        setUserData(response.data);
        setTip("")
        setTipOnNotFound("Даних не знайдено")
        setLoadingUserStatus(false);
      });
    }
    else{ 
      setTipOnNotFound('Введіть  ім\`я користувача');
      setTip('Введіть  ім\`я користувача');
      setLoadingUserStatus(false);
    }
  };

  const onSelect = async (select: any) => {
    var user: any = userData.find(u => u.firstName + ' ' + u.lastName === select.value);
    setMentionedUsers(old => [...old, user]);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => [onSearch(search)], 10);
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
  const handleFinish = async (dec: any) => {
    let user: any;
    let curToken = AuthStore.getToken() as string;
    user = jwt(curToken);
    const newDecision: DecisionPost = {
      id: decision?.id,
      name: dec.name,
      decisionStatusType: decision?.decisionStatusType,
      governingBody: decision?.governingBody,
      decisionTarget: decision?.decisionTarget,
      description: dec.description,
      date: decision?.date,
      userId: user.nameid,
      fileName: decision?.fileName,
    };
    await decisionsApi.put(id, newDecision);
    onEdit(newDecision.id, newDecision.name, newDecision.description);
    setShowModal(false);
    await notifyMentionedUsers(dec.description, dec.name);
  };
  return (
    <div>
      {!loading && (
        <Form name="basic" onFinish={handleFinish} id='area' form={form}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                label="Назва рішення"
                labelCol={{ span: 24 }}
                name="name"
                className={formclasses.inputWidth}
                rules={descriptionValidation.DecisionAndDocumentName}
              >
                <Input className={formclasses.input} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                label="Текст рішення"
                labelCol={{ span: 24 }}
                name="description"
                rules={descriptionValidation.Description}
              >
                <Mentions
                  getPopupContainer={() => document.getElementById('area')! as HTMLElement}
                  onChange = {()=>{if(search!=''){setLoadingUserStatus(true)}}}
                  notFoundContent = {<h5>{tipOnNotFound}</h5>}
                  loading={loadingUserStatus}
                  onSearch={(s => setSearch(s))}
                  rows={5}
                  onSelect={onSelect}
                  className={formclasses.formField}
                >
                  <Option value=""  disabled >{tip}</Option> 
                      {userData?.map((u) =>
                        <Option className="mentionOption"
                          key={u.id}
                          value={u.firstName + ' ' + u.lastName}
                        >
                          {u.firstName + ' ' + u.lastName + ' ' + u.email}
                  </Option>)}
                </Mentions>
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
                >
                  Змінити
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default FormEditDecision;
