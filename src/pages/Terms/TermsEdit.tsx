import React, { useEffect, useState } from "react";
import {Modal} from 'antd'
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useHistory } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./TermsOfUse.less"
import {Button, Form, Input, Layout, Upload, Row, Col, Card} from "antd";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import termsApi from "../../api/termsApi";
import TermsOfUse from "../../models/TermsOfUse/TermsOfUseModel";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";

const titleMaxLength = 255;

let defaultSect: TermsOfUse = {
  termsId :1,
  termsTitle : " ",
  termsText : "Немає данних",
  datePublication : new Date()
};

function EditTerms() {

const history = useHistory();
const [loading, setLoading] = useState(false);
const [terms, setTerms] = useState<TermsOfUse>(defaultSect);
const [usersId, setUsersId] = useState([]);
const [canEdit, setCanEdit] = useState(false);

const fetchUser = async () => {
  let roles = UserApi.getActiveUserRoles();
  setCanEdit(roles.includes(Roles.Admin));
}

const fetchTermsData = async () => {
  setLoading(true);
  const termsData: TermsOfUse = await termsApi.getTerms();
  setTerms(termsData)
  setLoading(false);
};

useEffect(() =>{
  fetchUser();
  fetchTermsData();
  getAllUsersId();
},[])

const getAllUsersId = async () => {
  const usersIdData = await termsApi.getUsersId();
  setUsersId(usersIdData);
};

const putTerms = async () => {
  await termsApi.putTermById(terms);
}

const setDateNow = () =>{
  let date = new Date;
  terms.datePublication=date
  setTerms({...terms}); 
}

const sendMessage = async () => {
  await createNotification(usersId, "Зміненно політику конфіденційності.", true);
}

const createNotification = async ([], message: string, changeTextTerms: boolean) => {
  if (changeTextTerms) {
    await NotificationBoxApi.createNotifications(
      usersId,
      message,
      NotificationBoxApi.NotificationTypes.UserNotifications,
    );
  }
}

const submitChange = () =>{
  setDateNow();
  putTerms();
  checkTextLength();
}

const handleClickBack = () =>{
  history.push("/terms"); 
}

const checkTextLength = () =>{
  (terms.termsText.length>45000)?(messageCheckTextLength()):(messageForUsers())
}

function messageCheckTextLength() {
  return Modal.confirm({
    title: "Довжина тексту політики конфіденційності перевищує 40 000 символів. Будь ласка, скоротіть довжину тексту.",
    icon: <ExclamationCircleOutlined />,
    okText: 'Зрозуміло',
    maskClosable: false,
    cancelButtonProps:{style:{display:'none'}},
    onOk(){ 
    history.push("/terms/edit"); 
    setLoading(false)}
  });
}

function messageForUsers() {
  return Modal.info({
    title: "Політку конфіденційності змінено. Всім користувачам надіслано повідомлення.",
    icon: <ExclamationCircleOutlined />,
    okText: 'Зрозуміло',
    maskClosable: false,
    okType: 'danger',
    onOk(){
      sendMessage();
      history.push("/terms");
    }
  });
}

return loading ? (
  <Spinner /> 
  ) : (canEdit ?(
    <Layout.Content className="editTerms">
      <Card hoverable className="editTermsCard">
        <Title level={3}>Редагування політики конфіденційності</Title>
          <Form className="reactQuill">
            <Row>
              <Col className="termsInput">
                <Form.Item
                  name="name"
                  labelCol={{ span: 24 }}
                >
                  <Input 
                  type='text'
                  placeholder="Заголовок..."
                  name="inputForTitle"
                  maxLength={titleMaxLength}
                  defaultValue={terms.termsTitle}
                  value={terms.termsTitle}
                  onChange={event=>{
                    terms.termsTitle=event.target.value;
                    setTerms({...terms});
                  }}  
                  /> 
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col className="termsInput" >
                    <ReactQuill 
                      className="iputFortText"
                      theme='snow'
                      placeholder="Введіть текс..."
                      defaultValue={terms.termsText}
                      value={terms.termsText}        
                      onChange={event=>{
                        terms.termsText=event;
                        setTerms({...terms}); 
                      }}
                    />
              </Col>
            </Row>
          <Row className="editButtons" justify="center" gutter={[0, 6]}>
            <Col xs={24} sm={12}>
              <Button
                type="primary"
                className="backButton"
                onClick={handleClickBack}
              >
                Назад
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button 
              htmlType="submit" 
              type="primary"
              onClick={submitChange}
              >
                Змінити
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Layout.Content>
  ):(<></>)
  );
};

export default EditTerms;