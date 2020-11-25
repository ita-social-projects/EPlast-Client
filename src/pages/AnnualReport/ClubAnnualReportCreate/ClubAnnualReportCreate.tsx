import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col, Typography, Input, Table } from 'antd';
import './ClubAnnualReportCreate.less';
import {getClubById,createClubAnnualReport, getAllFollowers} from '../../../api/clubsApi';
import moment from 'moment';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import { getTableAdmins,getTableFollowers, getTableMembers } from '../../AnnualReport/ClubAnnualReportCreate/ClubAnnualReportTableColumns';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const ClubAnnualReportCreate = () => {

    const validationSchema = {
        currentClubMembers: [
            { required: true, message: "Оберіть хто є в проводі куреня" }
        ],
        textarea: [
            { max: 2000, message: "Максимально допустима кількість символів - 2000" }
        ],
        text: [
            { max: 20, message: "Максимально допустима кількість символів - 20" }
        ],
    }
    const { clubId } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт куреня');
    const [form] = Form.useForm();
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [club,setClub] = useState<any>({
  id:0,
  name: "",
  description: "",
  clubURL: "",
  email: "",
    });

    const administrationsColumns = [
        {
          title: "Ім’я, Прізвище",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Стан в курені",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Посада",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "Станиця",
          dataIndex: "userCity",
          key: "userCity",
        },
      ];
    

    useEffect(() => {
           fetchData(clubId);
    }, [])

    const fetchData = async (id: any) => {
        try {
            let response = await getClubById(id);
            setClub(response.data);
            const admins = [...response.data.administration, response.data.head]
            .filter(a => a !== null);
            setAdmins(admins);
            const members=[...response.data.members, response.data.head]
            .filter(a => a !== null);
            setClubMembers(members);
            const followers = await getAllFollowers(id);
            setFollowers(followers.data.followers);
         }
         catch (error) {
             showError(error.message)
         }
    }

    const handleFinish = async (obj: any) => {
        try {
            let response = await createClubAnnualReport(obj);
            fetchData(clubId);
            form.resetFields();
            showSuccess(response.data.message);
        }
        catch (error) {
            showError(error.message)
        }
    }

    const showSuccess = (message: string) => {
        Modal.success({
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    return (
        <Form
            onFinish={handleFinish}
            className='clubannualreport-form'
            form={form} >
            <Title>{title}</Title>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Курінь</Text>
                    <Form.Item
                        name='name'
                        className='w100'>
                        {club.name}
                    </Form.Item>
                </Col>
                </Row>
                <Row
                gutter={16}
                align='bottom'>
                   
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Провід куреня</Text>
                    {admins.length !== 0 ? (
                admins.map((admin) => (
                    <Form.Item
                        className='w100'
                        name='currentClubMembers'
                    >{admin.adminType.adminTypeName}, {admin.user.firstName} {admin.user.lastName}, 
                    {admin.user.email}
                    </Form.Item>
                ))
                ) : (
                  <>Ще немає діловодів куреня</>
                )}
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Контакти:</Text>
                    {admins.length !== 0 ? (
                admins.filter(a=>a.adminType.adminTypeName === "Голова Куреня" ).map((admin) => (
                    <Form.Item
                        className='w100'
                        name='clubContacts'>
                      {admin.adminType.adminTypeName}, {admin.user.firstName} {admin.user.lastName}, {admin.user.email},  
                      {admin.user.phoneNumber}
                    </Form.Item>
                    ))
                    ) : (
                      <>Ще немає адміністратора куреня</>
                    )}
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Сайт/сторінка в інтернеті:</Text>
                    <Form.Item
                        className='w100'
                        name='clubPage'
                        >
                    {club.clubURL}
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Дані про членів куреня</Text>
                    {members.length !== 0 ? (
                    <Form.Item
                        className='w100'
                        name='currentClubMembers'
                        >
                          <p>Дійсних членів куреня - {members.length - 1}</p>
                    </Form.Item>
                    )
                    : (
                      <>Ще немає членів куреня</>
                    )}
                     { followers.length !==0 ? (
                    <Form.Item
                        className='w100'
                        name='currentClubFollowers'
                        >
                          <p>Прихильників куреня - {followers.length }</p>
                    </Form.Item>
                    )
                    : (
                      <>Ще немає членів куреня</>
                    )}
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>До куреня приєдналось за звітній період</Text>
                    <Form.Item
                            className='w100'
                            name='clubEnteredMembersCount'
                            rules={validationSchema.text} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Вибули з куреня за звітній період</Text>
                    <Form.Item
                            className='w100'
                            name='clubLeftMembersCount'
                            rules={validationSchema.text} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Географія куреня. Осередки в Україні:</Text>
                    <Form.Item
                            className='w100'
                            name='clubCenters'
                            rules={validationSchema.textarea} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Вкажіть побажання до КБ УСП</Text>
                    <Form.Item
                            className='w100'
                            name='kbUSPWishes'
                            rules={validationSchema.textarea} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Дата заповнення</Text>
                    <Form.Item
                        className='w100'
                        name='date'
                        >
                            {moment().format("DD.MM.YYYY")}
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Список членів куреня:</Text>
                </Col>
            </Row>
            <Col span={24}>
              <Table
                dataSource={getTableAdmins(admins, club.head)}
                columns={administrationsColumns}
                pagination={{ defaultPageSize: 4 }}
                className="table"
              />
              <Table
                dataSource={getTableFollowers(followers)}
                columns={administrationsColumns}
                pagination={{ defaultPageSize: 4 }}
                className="table"
              />
              <Table
                dataSource={getTableMembers(members,admins, club.head)}
                columns={administrationsColumns}
                pagination={{ defaultPageSize: 4 }}
                className="table"
              />
            </Col>
            <Row
                justify='center' >
                <Col>
                    <Button
                        type='primary'
                        htmlType='submit'>
                        Подати річний звіт
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default ClubAnnualReportCreate;