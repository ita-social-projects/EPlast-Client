import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Form, Button, Row, Col, Typography, Input, Table } from 'antd';
import './ClubAnnualReportCreate.less';
import {getClubById,createClubAnnualReport,getAllMembers, getAllFollowers, getAllAdmins} from '../../../api/clubsApi';
import moment from 'moment';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import notificationLogic from "../../../components/Notifications/Notification";
import { getTableAdmins,getTableFollowers, getTableMembers } from './ClubAnnualReportTableColumns';
import { emptyInput, maxLength, successfulCreateAction, tryAgain } from '../../../components/Notifications/Messages';
import { useHistory } from 'react-router-dom';
import Spinner from "../../Spinner/Spinner";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const ClubAnnualReportCreate = () => {
    const history = useHistory();
    const { clubId } = useParams();
    const [id, setId] = useState<number>();
    const [title] = useState<string>('Річний звіт куреня');
    const [form] = Form.useForm();
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [club,setClub] = useState<any>({
        id: 0,
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

    const followersColumns = [
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
          title: "Станиця",
          dataIndex: "userCity",
          key: "userCity",
        },
      ];

    useEffect(() => {
           fetchData(clubId);
    }, [])

    const fetchData = async (id: any) => {
        setIsLoading(true);
        try {
            let response = await getClubById(id);
            setClub(response.data);
            const admins = await getAllAdmins(id);
            setAdmins([...admins.data.administration, admins.data.head].filter(a => a != null));
            const members= await getAllMembers(id);
            setClubMembers(members.data.members);
            const followers = await getAllFollowers(id);
            setFollowers(followers.data.followers);
            setId(id);
         }
        catch (error) {
            notificationLogic("error", tryAgain);
         }finally {
            setIsLoading(false);
        }
    }

    const handleFinish = async (obj: any) => {
        obj.clubId = id
        obj.name = club.name
        obj.clubPage = club.clubURL
        obj.currentClubFollowers = followers.length
        obj.currentClubMembers = members.length
        obj.date = moment()
        setIsLoading(true);
        try {
            let response=await createClubAnnualReport(obj);
            form.resetFields();
            notificationLogic('success', successfulCreateAction('Річний звіт', response.data.name));
            history.goBack(); 
        }
        catch (error)
        {
            if (error.response.status === 400 || error.response.status === 404) {
                notificationLogic('error', tryAgain);
                history.goBack(); 
            }
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading? <Spinner />:<Form
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
                            admins.map((admin:ClubAdmin) => (
                                <Form.Item
                                    className='w100'
                                    name='currentClubMembers'
                                >{admin.adminType.adminTypeName}, {admin.user.firstName} {admin.user.lastName}, {admin.user.email}
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
                            name='clubPage'>
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
                                    name='currentClubMembers'>
                                    <p>Дійсних членів куреня - {members.length}</p>
                                </Form.Item>
                            )
                            : (
                                <>Ще немає членів куреня</>
                            )}
                        { followers.length !==0 ? (
                                <Form.Item
                                    className='w100'
                                    name='currentClubFollowers'>
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
                            rules={[{ required: true, message: emptyInput() },
                                { max: 7, message: maxLength(7) }]}>
                            <Input  type="number" min="0" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode===188) && e.preventDefault() }  />
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
                            rules={[{ required: true, message: emptyInput() },
                                { max: 7, message: maxLength(7) }]}>
                            <Input  type="number" min="0" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode===188) && e.preventDefault() }  />
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
                            rules={[{ required: true, message: emptyInput() }, { max: 2000, message: maxLength(2000)}]} >
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
                            rules={[{ required: true, message: emptyInput() }, { max: 2000, message: maxLength(2000)}]} >
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
                            name='date'>
                            {moment().format("DD.MM.YYYY")}
                        </Form.Item>
                    </Col>
                </Row>
                <Col span={24}>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={12} lg={12}
                            className='container'>
                            <Text strong={true}>Список адміністраторів:</Text>
                        </Col>
                    </Row>
                    <Table
                        dataSource={getTableAdmins(admins, club.head)}
                        columns={administrationsColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                    />
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={12} lg={12}
                            className='container'>
                            <Text strong={true}>Список прихильників куреня:</Text>
                        </Col>
                    </Row>
                    <Table
                        dataSource={getTableFollowers(followers)}
                        columns={followersColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                    />
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={12} lg={12}
                            className='container'>
                            <Text strong={true}>Список членів куреня:</Text>
                        </Col>
                    </Row>
                    <Table
                        dataSource={getTableMembers(members,admins,club.head)}
                        columns={followersColumns}
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
            </Form>}
        </>
    );
}

export default ClubAnnualReportCreate;