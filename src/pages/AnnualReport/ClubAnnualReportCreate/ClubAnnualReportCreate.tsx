import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Form, Button, Row, Col, Typography, Input, Table, Card } from 'antd';
import './ClubAnnualReportCreate.less';
import { getClubById, createClubAnnualReport, getAllMembers, getAllFollowers, getAllAdmins } from '../../../api/clubsApi';
import moment from 'moment';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import notificationLogic from "../../../components/Notifications/Notification";
import { administrationsColumns, followersColumns, getTableAdmins, getTableFollowers, getTableMembers } from './ClubAnnualReportTableColumns';
import { emptyInput, maxLength, successfulCreateAction, tryAgain } from '../../../components/Notifications/Messages';
import { Link, useHistory } from 'react-router-dom';
import Spinner from "../../Spinner/Spinner";
import { CloseCircleOutlined } from '@ant-design/icons';

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
    const [club, setClub] = useState<any>({
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
    });

    useEffect(() => {
        fetchData(clubId);
    }, [])

    const fetchData = async (id: any) => {
        setIsLoading(true);
        try {
            let response = await getClubById(id).then((res)=>{console.log(res); return res;});

            setClub(response.data);

            setAdmins(response.data.administration.filter((a: any) => a != null));

            setClubMembers(response.data.members);

            setFollowers(response.data.followers);

            setId(id);
        }
        catch (error) {
            notificationLogic("error", tryAgain);
        } finally {
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
            let response = await createClubAnnualReport(obj);
            form.resetFields();
            notificationLogic('success', successfulCreateAction('Річний звіт', response.data.name));
            history.goBack();
        }
        catch (error) {
            if (error.response.status === 400 || error.response.status === 404) {
                notificationLogic('error', tryAgain);
                history.goBack();
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading ? <Spinner /> : <Form
                onFinish={handleFinish}
                className='annualreport-form'
                form={form} >
                <Title
                    className='textCenter'
                    level={3} >
                    {`Річний звіт куреня ${club.name} за 
                    ${moment(club.date).year()} рік`}</Title>
                <Link className="LinkText" style={{ fontSize: "14px" }} to="#" onClick={() => window.open(`/clubs/${clubId}`)}>Перейти на профіль куреня {club.name}</Link>
                <br />
                <br />
                <Card>
                    <Title
                        level={4}>Дані про членів куреня </Title>
                        <div style={{marginLeft:"20px"}}>
                        {members.length !== 0 ? (
                            <Form.Item
                                className='w100'
                                name='currentClubMembers'>
                                <p>Дійсних членів куреня: {members.length}</p>
                            </Form.Item>
                        )
                            : (
                                <>Ще немає членів куреня</>
                            )}
                        {followers.length !== 0 ? (
                            <Form.Item
                                className='w100'
                                name='currentClubFollowers'>
                                <p>Прихильників куреня: {followers.length}</p>
                            </Form.Item>
                        )
                            : (
                                <>Ще немає членів куреня</>
                            )}

                        <Row
                            gutter={16}
                            align='bottom'>
                            <Col
                                xs={24} sm={12} md={12} lg={12}
                                className='container'>
                                <Text strong={true}>До куреня приєдналось за звітній період:</Text>
                                <Form.Item
                                    className='w100'
                                    name='clubEnteredMembersCount'
                                    rules={[{ required: true, message: emptyInput() },
                                    { max: 7, message: maxLength(7) }]}>
                                    <Input style={{ width: 150 }} type="number" min="0" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 188) && e.preventDefault()} />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row
                            gutter={16}
                            align='bottom'>
                            <Col
                                xs={24} sm={12} md={12} lg={12}
                                className='container'>
                                <Text strong={true}>Вибули з куреня за звітній період:</Text>
                                <Form.Item
                                    className='w100'
                                    name='clubLeftMembersCount'
                                    rules={[{ required: true, message: emptyInput() },
                                    { max: 7, message: maxLength(7) }]}>
                                    <Input style={{ width: 150 }} type="number" min="0" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 188) && e.preventDefault()} />
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
                                    rules={[{ required: true, message: emptyInput() }, { max: 200, message: maxLength(200) }]} >
                                    <TextArea style={{width:"700px", height:"100px"}}/>
                                </Form.Item>
                                </Col>
                        </Row>
                        <Row
                            gutter={16}
                            align='bottom'>
                                <Col
                                xs={24} sm={12} md={12} lg={12}
                                className='container'>
                                    <Text strong={true}>Вкажіть побажання до КБ УСП:</Text>
                            <Form.Item
                                    className='w100'
                                    name='kbUSPWishes'
                                    rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                                    <TextArea style={{width:"700px", height:"100px"}}/>
                                </Form.Item>
                                </Col>
                        </Row>
                        </div>

                    <Card.Grid className='container'>
                    <Title level={4}>Провід куреня</Title>
                        <Table
                            dataSource={getTableAdmins(admins, club.head)}
                            columns={administrationsColumns}
                            pagination={{ defaultPageSize: 4 }}
                            className="table"
                            onRow={(user) => {
                                return {
                                  onDoubleClick: event => {if (user.key) window.open(`/userpage/main/${user.key}`) },
                                };
                            }}
                        />
                    </Card.Grid>
                    <Card.Grid className='container'>
                    <Title level={4}>Члени куреня</Title>
                    <Table
                        dataSource={getTableMembers(members, admins, club.head)}
                        columns={followersColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                        onRow={(user) => {
                            return {
                              onDoubleClick: event => {if (user.key) window.open(`/userpage/main/${user.key}`) },
                            };
                        }}
                    />

                    </Card.Grid>

                    <Card.Grid className='container'>
                    <Title level={4}>Прихильники куреня</Title>
                    <Table
                        dataSource={getTableFollowers(followers)}
                        columns={followersColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                        onRow={(user) => {
                            return {
                              onDoubleClick: event => {if (user.key) window.open(`/userpage/main/${user.key}`) },
                            };
                        }}
                    />

                    </Card.Grid>
                    
                    
                    
                <Row
                    gutter={16}
                    align='bottom'>
                    
                        <Card.Grid
                            className='container'>
                                <Col xs={24} sm={12} md={12} lg={12}>
                            <Text strong={true}>Контакти:</Text>
                            {club.head ? (
                                <Form.Item
                                    className='w100'
                                    name='clubContacts'>
                                    {club.head.adminType.adminTypeName} {club.head.user.firstName} {club.head.user.lastName} <br />
                                    {club.head.user.email} <br />
                                    {club.head.user.phoneNumber}
                                </Form.Item>
                            ) : (
                                <> Ще немає адміністратора куреня</>
                            )}
                            <Form.Item
                                label={(<Text strong={true}>Сайт/сторінка в інтернеті</Text>)}
                                className='w100'
                                name='clubPage'>
                                {club.clubURL.replace(' ', '') == '' ? 'немає' : club.clubURL}
                            </Form.Item>
                            <Form.Item
                                label={(<Text strong={true}>Дата заповнення</Text>)}
                                className='w100'
                                name='date'>
                                {moment().format("DD.MM.YYYY")}
                            </Form.Item>
                            </Col>
                        </Card.Grid>
                </Row>
                <Row className="clubButtons" justify='center'>
                    <Col>
                        <Button
                            type='primary'
                            htmlType='submit'>
                            Подати річний звіт
                        </Button>
                        <Button
                            type="primary"
                            className="backButton"
                            onClick={() => history.goBack()}>
                            Скасувати
                        </Button>
                    </Col>
                </Row>

                </Card>

            </Form>}
        </>
    );
}

export default ClubAnnualReportCreate;