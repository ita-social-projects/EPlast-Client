import React, { useState } from 'react';
import { Typography, Card, Modal, Space, Form, Row, Col, Table } from 'antd';
import moment from 'moment';
import './ClubAnnualReportInformation.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getClubAnnualReportById, getClubById, confirmClubAnnualReport, cancelClubAnnualReport, removeClubAnnualReport } from '../../../../api/clubsApi';
import { useEffect } from 'react';
import Spinner from '../../../Spinner/Spinner';
import { administrationsColumns, followersColumns, getTableAdmins, getTableFollowers, getTableMembers } from '../../ClubAnnualReportForm/ClubAnnualReportTableColumns';
import ClubAdmin from '../../../../models/Club/ClubAdmin';
import ClubMember from '../../../../models/Club/ClubMember';
import AnnualReportMenu from '../../AnnualReportMenu';
import StatusStamp from '../../AnnualReportStatus';
import notificationLogic from "../../../../components/Notifications/Notification";
import { successfulCancelAction, successfulConfirmedAction, successfulDeleteAction } from '../../../../components/Notifications/Messages';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AuthStore from '../../../../stores/AuthStore';
import jwt from "jwt-decode";
import jwt_decode from 'jwt-decode';
import { Roles } from '../../../../models/Roles/Roles';


const { Title, Text } = Typography;

const ClubAnnualReportInformation = () => {
    const { id } = useParams();
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState(Object);
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isClubAdmin, setIsClubAdmin] = useState<boolean>();
    const [userId, setUserId] = useState<string>();
    const [status, setStatus] = useState<number>();
    const [club, setClub] = useState<any>({
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        checkAccessToManage();
        fetchClubReport(id);
    }, [])

    const fetchClubReport = async (id: number) => {
        setIsLoading(true);
        try {
            let clubReport = await getClubAnnualReportById(id);
            setClubAnnualReport(clubReport.data.annualreport);
            setStatus(clubReport.data.annualreport.status);

            let response = await getClubById(clubReport.data.annualreport.clubId);

            setClub(response.data);

            setAdmins(response.data.administration.filter((a: any) => a != null));

            setClubMembers(response.data.members);

            setFollowers(response.data.followers);
        }
        catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const checkAccessToManage = async () => {
        setIsLoading(true);
        try {
            let token = AuthStore.getToken() as string;
            let decodedJwt = jwt_decode(token) as any;
            let roles = decodedJwt[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] as string[];
            setIsAdmin(roles.includes(Roles.Admin));
            setIsClubAdmin(roles.includes(Roles.KurinHead));
            const user: any = jwt(token);
            setUserId(user.nameid);
        } catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        history.push(`/club/editClubAnnualReport/${id}`);
    };

    const handleConfirm = async (id: number) => {
        let response = await confirmClubAnnualReport(id);
        setStatus(1);
        notificationLogic('success', successfulConfirmedAction('Річний звіт', response.data.name));
    };

    const handleCancel = async (id: number) => {
        let response = await cancelClubAnnualReport(id);
        setStatus(0);
        notificationLogic('success', successfulCancelAction('Річний звіт', response.data.name));
    };

    const handleRemove = async (id: number) => {
        Modal.confirm({
            title: "Ви дійсно хочете видалити річний звіт?",
            icon: <ExclamationCircleOutlined />,
            okText: 'Так, видалити',
            okType: 'danger',
            cancelText: 'Скасувати',
            maskClosable: true,
            async onOk() {
                let response = await removeClubAnnualReport(id);
                notificationLogic('success', successfulDeleteAction('Річний звіт', response.data.name));
                history.goBack()
            }
        });
    };

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    }


    return (
        <>
            {isLoading ? <Spinner /> :
                <>
                    <AnnualReportMenu
                        record={{
                            ...clubAnnualReport,
                            canManage: (isClubAdmin && club.head?.userId == userId)
                        }}
                        isAdmin={isAdmin!}
                        ViewPDF={true}
                        status={status!}
                        setStatus={setStatus}
                        handleEdit={handleEdit}
                        handleConfirm={handleConfirm}
                        handleCancel={handleCancel}
                        handleRemove={handleRemove}
                    />
                    <Form
                        onFinish={() => history.goBack()}
                        className='annualreport-form'>
                        <Title
                            className='textCenter'
                            level={3} >
                            {`Річний звіт куреня ${clubAnnualReport.clubName} за 
                    ${moment(clubAnnualReport.date).year()} рік`}</Title>
                        <StatusStamp status={status!} />
                        <Link className="LinkText" style={{ fontSize: "14px" }} to={"/clubs/"+clubAnnualReport.clubId} target="blank">Перейти на профіль куреня {clubAnnualReport.clubName}</Link>
                        <br />
                        <br />
                        <Card>
                            <Row
                                gutter={16}
                                align='bottom'
                                style={{}}>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title level={4}>Географія куреня. Осередки в Україні:  </Title>
                                        <Text style={{wordBreak: "break-word"}}>{clubAnnualReport.clubCenters}</Text>
                                    </Card.Grid>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title
                                            level={4}>Побажання до КБ УСП:  </Title>
                                        <Text style={{wordBreak: "break-word"}}>{clubAnnualReport.kbUSPWishes}</Text>
                                    </Card.Grid>

                                </Col>
                            </Row>

                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>Дані про членів куреня: </Title>
                                <Space direction='vertical'>
                                    <Text>{`Дійсних членів куреня: 
                            ${clubAnnualReport.currentClubMembers}`}</Text>
                                    <Text>{`Прихильників куреня: 
                            ${clubAnnualReport.currentClubFollowers}`}</Text>
                                    <Text>{`До куреня приєдналось за звітній період: 
                            ${clubAnnualReport.clubEnteredMembersCount}`}</Text>
                                    <Text>{`Вибули з куреня за звітній період: 
                            ${clubAnnualReport.clubLeftMembersCount}`}</Text>
                                </Space>
                            </Card.Grid>

                            <Card.Grid className='container'>
                                <Title level={4}>Провід куреня</Title>
                                <Table
                                    dataSource={getTableAdmins(admins, club.head)}
                                    columns={administrationsColumns}
                                    pagination={{ defaultPageSize: 4 }}
                                    className="table"
                                    onRow={(user) => {
                                        return {
                                            onDoubleClick: event => { if (user.key) window.open(`/userpage/main/${user.key}`) },
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
                                            onDoubleClick: event => { if (user.key) window.open(`/userpage/main/${user.key}`) },
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
                                            onDoubleClick: event => { if (user.key) window.open(`/userpage/main/${user.key}`) },
                                        };
                                    }}
                                />

                            </Card.Grid>

                            <Col xs={24} sm={12} md={12} lg={12} style={{ marginLeft: "10px" }}>
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

                        </Card>

                    </Form>
                </>}
        </>
    );
}

export default ClubAnnualReportInformation;