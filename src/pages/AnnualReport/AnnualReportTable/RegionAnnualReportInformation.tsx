import React, { useEffect, useState } from 'react';
import { Typography, Card, Modal, Space, Form, Row, Col } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import userApi from '../../../api/UserApi';
import regionsApi from '../../../api/regionsApi';
import RegionMembersTable from './RegionMembersTable/RegionMembersTable';
import notificationLogic from "../../../components/Notifications/Notification";
import { successfulCancelAction, successfulConfirmedAction, successfulDeleteAction } from '../../../components/Notifications/Messages';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AnnualReportMenu from '../AnnualReportMenu';
import AuthStore from '../../../stores/AuthStore';
import jwt_decode from 'jwt-decode';
import jwt from "jwt-decode";
import StatusStamp from '../AnnualReportStatus';

const { Title, Text } = Typography;


const RegionAnnualReportInformation = () => {
    const { annualreportId, year } = useParams();
    const history = useHistory();
    const [regionAnnualReport, setRegionAnnualReport] = useState(Object);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<number>();
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isRegionAdmin, setIsRegionAdmin] = useState<boolean>();
    const [userRegionId, setUserRegionId] = useState<number>();

    useEffect(() => {
        checkAccessToManage();
        fetchRegionReports(annualreportId, year);
    }, [])

    const fetchRegionReports = async (annualreportId: number, year: number) => {
        setIsLoading(true);
        try {
            let response = await regionsApi.getReportById(annualreportId, year);
            setRegionAnnualReport(response.data)
            setStatus(response.data.status);
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
            setIsAdmin(roles.includes("Admin"));
            setIsRegionAdmin(roles.includes("Голова Округи"));
            const user: any = jwt(token);
            var regionId = await userApi.getById(user.nameid).then((response) => {
                return response.data?.user.regionId
            })
                .catch((error) => {
                    notificationLogic("error", error.message);
                });
            setUserRegionId(regionId);
        } catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        history.push(`/annualreport/region/edit/${id}/${year}`);
    };

    const handleConfirm = async (id: number) => {
        let response = await regionsApi.confirm(id);
        setStatus(1);
        notificationLogic('success', successfulConfirmedAction('Річний звіт', response.data.name));
    };

    const handleCancel = async (id: number) => {
        let response = await regionsApi.cancel(id);
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
                let response = await regionsApi.removeAnnualReport(id);
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
                        record={{ ...regionAnnualReport, canManage: isRegionAdmin && regionAnnualReport.regionId == userRegionId }}
                        isAdmin={isAdmin!}
                        ViewPDF={false}
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
                    {`Річний звіт округи ${regionAnnualReport.regionName} за 
                    ${year} рік`}</Title>
                <StatusStamp  status={status!} />
                <Link className="LinkText" style={{ fontSize: "14px" }} to={"/regions/"+regionAnnualReport.regionId} target="blank">Перейти на профіль округи {regionAnnualReport.regionName}</Link>
                        <br />
                        <br />
                <Card>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col xs={24} sm={12} md={12} lg={12}>
                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>УПП</Title>
                                <Space direction='vertical'>
                                    <Text>{`Кількість гніздечок пташат: 
                            ${regionAnnualReport.numberOfSeatsPtashat}`}</Text>
                                    <Text>{`Кількість пташат: 
                            ${regionAnnualReport?.numberOfPtashata}`}</Text>
                                </Space>
                            </Card.Grid></Col>

                        <Col xs={24} sm={12} md={12} lg={12}>
                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>УПН</Title>
                                <Space direction='vertical'>
                                    <Text>{`Кількість самостійних роїв: 
                            ${regionAnnualReport.numberOfIndependentRiy}`}</Text>
                                    <Text>{`Кількість новацтва: 
                            ${regionAnnualReport.numberOfNovatstva}`}</Text>
                                </Space>
                            </Card.Grid></Col>
                    </Row>

                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col xs={24} sm={12} md={12} lg={12}>
                        <Card.Grid
                        className='container'>
                        <Title
                            level={4}>УПС</Title>
                        <Space direction='vertical'>
                            <Text>{`Кількість сеньйорів пластунів прихильників: 
                            ${regionAnnualReport.numberOfSeigneurSupporters}`}</Text>
                            <Text>{`Кількість сеньйорів пластунів: 
                            ${regionAnnualReport.numberOfSeigneurMembers}`}</Text>
                        </Space>
                    </Card.Grid>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12}>
                        <Card.Grid
                        className='container'>
                        <Title
                            level={4}>УСП</Title>
                        <Space direction='vertical'>
                            <Text>{`Кількість старших пластунів прихильників: 
                            ${regionAnnualReport.numberOfSeniorPlastynSupporters}`}</Text>
                            <Text>{`Кількість старших пластунів: 
                            ${regionAnnualReport.numberOfSeniorPlastynMembers}`}</Text>
                        </Space>
                    </Card.Grid></Col>
                    </Row>

                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col xs={24} sm={12} md={12} lg={12}>
                        <Card.Grid
                        className='container'>
                        <Title
                            level={4}>УПЮ</Title>
                        <Space direction='vertical'>
                            <Text>{`Кількість куренів у станиці/паланці (окрузі/регіоні): 
                            ${regionAnnualReport.numberOfClubs}`}</Text>
                            <Text>{`Кількість самостійних гуртків: 
                            ${regionAnnualReport.numberOfIndependentGroups}`}</Text>
                            <Text>{`Кількість неіменованих разом: 
                            ${regionAnnualReport.numberOfUnatstvaNoname}`}</Text>
                            <Text>{`Кількість прихильників/ць: 
                            ${regionAnnualReport.numberOfUnatstvaSupporters}`}</Text>
                            <Text>{`Кількість учасників/ць: 
                            ${regionAnnualReport.numberOfUnatstvaMembers}`}</Text>
                            <Text>{`Кількість розвідувачів: 
                            ${regionAnnualReport.numberOfUnatstvaProspectors}`}</Text>
                            <Text>{`Кількість скобів/вірлиць: 
                            ${regionAnnualReport.numberOfUnatstvaSkobVirlyts}`}</Text>
                            <br/>
                            <br/>
                        </Space>
                    </Card.Grid>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12}>
                        <Card.Grid
                        className='container'>
                        <Title
                            level={4}>Адміністрування та виховництво</Title>
                        <Space direction='vertical'>
                            <Text>{`Кількість діючих виховників (з усіх членів УСП, УПС): 
                            ${regionAnnualReport.numberOfTeachers}`}</Text>
                            <Text>{`Кількість адміністраторів (в проводах будь якого рівня): 
                            ${regionAnnualReport.numberOfAdministrators}`}</Text>
                            <Text>{`Кількість тих, хто поєднує виховництво та адміністрування: 
                            ${regionAnnualReport.numberOfTeacherAdministrators}`}</Text>
                        </Space>
                    </Card.Grid>
                    <Card.Grid
                        className='container'>
                        <Title
                            level={4}>Пластприят</Title>
                        <Space direction='vertical'>
                            <Text>{`Кількість пільговиків: 
                            ${regionAnnualReport.numberOfBeneficiaries}`}</Text>
                            <Text>{`Кількість членів Пластприяту: 
                            ${regionAnnualReport.numberOfPlastpryiatMembers}`}</Text>
                            <Text>{`Кількість почесних членів: 
                            ${regionAnnualReport.numberOfHonoraryMembers}`}</Text>
                        </Space>
                    </Card.Grid>
                    </Col>
                    </Row>
                    
                    
                    <RegionMembersTable
                        regionId={regionAnnualReport.regionId}
                        year={year}
                    />
                    <Card.Grid
                        className='container'>
                        <Title
                            level={4}>Додаткові дані</Title>
                        <Space direction='vertical'>
                            <Text strong={true}>{`1. Загальна характеристика діяльності осередків в області:`} </Text>
                            <Text>{`${regionAnnualReport.characteristic}`}</Text>
                            <Text strong={true}>{`2. Стан підготовки/реалізації стратегії округи, осередків округи: `} </Text>
                            <Text>{`${regionAnnualReport.stateOfPreparation}`}</Text>
                            <Text strong={true}>{`3. Чи виконується стратегія у Вашій окрузі? Що допоможе її реалізувати?`} </Text>
                            <Text>{`${regionAnnualReport.statusOfStrategy}`}</Text>
                            <Text strong={true}>{`4. Стан роботи із залученням волонтерів:`} </Text>
                            <Text>{`${regionAnnualReport.involvementOfVolunteers}`}</Text>
                            <Text strong={true}>{`5. Які вишколи потрібні членам вашої округи? та  Які вишколи із вказаних ви можете провести самостійно? `} </Text>
                            <Text>{`${regionAnnualReport.trainedNeeds}`}</Text>
                            <Text strong={true}>{`6. Чи отримають станиці державне фінансування або іншу підтримку від влади? Якщо так, то яку? `} </Text>
                            <Text>{`${regionAnnualReport.publicFunding}`}</Text>
                            <Text strong={true}>{`7. Чи співпрацюєте ви із церквою (вкажіть як саме, тип співпраці з церквою)?`} </Text>
                            <Text>{`${regionAnnualReport.churchCooperation}`}</Text>
                            <Text strong={true}>{`8. Чи займаються станиці фандрейзингом? Якщо так, то хто і в якому форматі?`} </Text>
                            <Text>{`${regionAnnualReport.fundraising}`}</Text>
                            <Text strong={true}>{`9. Участь (організація) у соціальних проектах:`} </Text>
                            <Text>{`${regionAnnualReport.socialProjects}`}</Text>
                            <Text strong={true}>{`10. Проблемні ситуації, виклики, які мають негативний вплив на організацію на місцевому та національному рівні.`} </Text>
                            <Text>{`${regionAnnualReport.problemSituations}`}</Text>
                            <Text strong={true}>{`11. Вкажіть важливі потреби для розвитку округи та осередків:`} </Text>
                            <Text>{`${regionAnnualReport.importantNeeds}`}</Text>
                            <Text strong={true}>{`12. Розкажіть про ваші історії успіху, за цей період:`} </Text>
                            <Text>{`${regionAnnualReport.successStories}`}</Text>
                        </Space>
                    </Card.Grid>
                </Card>

            </Form>
            </>}
        </>
    );
}

export default RegionAnnualReportInformation;