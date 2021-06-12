import React, { useState, useEffect } from 'react';
import { Typography, Card, Modal, Space, Form, Row, Col } from 'antd';
import moment from 'moment';
import './AnnualReportInformation.less';
import userApi from '../../../../api/UserApi';
import notificationLogic from "../../../../components/Notifications/Notification";
import AnnualReportApi from '../../../../api/AnnualReportApi';
import Spinner from '../../../Spinner/Spinner';
import { Link, useHistory, useParams } from 'react-router-dom';
import AnnualReportMenu from '../../AnnualReportMenu';
import StatusStamp from '../../AnnualReportStatus';
import AuthStore from '../../../../stores/AuthStore';
import jwt_decode from 'jwt-decode';
import jwt from "jwt-decode";
import { successfulCancelAction, successfulConfirmedAction, successfulDeleteAction } from '../../../../components/Notifications/Messages';
import { ExclamationCircleOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

const AnnualReportInformation = () => {
    const { id } = useParams();
    const history = useHistory();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<string[]>(Array());
    const [cityAnnualReport, setCityAnnualReport] = useState(Object);
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isCityAdmin, setIsCityAdmin] = useState<boolean>();
    const [userCityId, setUserCityId] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<number>();


    useEffect(() => {
        checkAccessToManage();
        fetchCityReport(id);
        fetchCityLegalStatuses();
    }, [])

    const fetchCityLegalStatuses = async () => {
        setIsLoading(true)
        try {
            let response = await AnnualReportApi.getCityLegalStatuses();
            setCityLegalStatuses(response.data.legalStatuses);
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
            setIsCityAdmin(roles.includes("Голова Станиці"));
            const user: any = jwt(token);
            var cityId = await userApi.getById(user.nameid).then((response) => {
                return response.data?.user.cityId
            })
                .catch((error) => {
                    notificationLogic("error", error.message);
                });
            setUserCityId(cityId);
        } catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCityReport = async (id: number) => {
        setIsLoading(true);
        try {
            let response = await AnnualReportApi.getById(id);
            setCityAnnualReport(response.data.annualReport);
            setStatus(response.data.annualReport.status);
        }
        catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (id: number) => {
        history.push(`/annualreport/edit/${id}`);
    };

    const handleConfirm = async (id: number) => {
        let response = await AnnualReportApi.confirm(id);
        setStatus(1);
        notificationLogic('success', successfulConfirmedAction('Річний звіт', response.data.name));
    };

    const handleCancel = async (id:number) => {
        let response = await AnnualReportApi.cancel(id);
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
                let response = await AnnualReportApi.remove(id);
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
                        record={{ ...cityAnnualReport, canManage: isCityAdmin && cityAnnualReport.cityId == userCityId }}
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
                            {`Річний звіт станиці ${cityAnnualReport.city?.name} за 
                    ${moment(cityAnnualReport.date).year()} рік`}</Title>
                        <StatusStamp status={status!} />
                        <Link className="LinkText" style={{ fontSize: "14px" }} to={"/cities/"+cityAnnualReport.city?.id} target="blank">Перейти на профіль станиці {cityAnnualReport.city?.name}</Link>
                        <br />
                        <br />
                        <Card>
                            <Row
                                gutter={16}
                                align='bottom'>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container' >
                                        <Title
                                            level={4}>Голова новообраної старшини</Title>
                                        {cityAnnualReport.newCityAdmin == null ? <Text>Відсутній</Text> :
                                            <Link className="LinkText" style={{ fontSize: "18px" }} to={"/userpage/main/"+cityAnnualReport.newCityAdmin.id} target="blank">{cityAnnualReport.newCityAdmin.firstName} {cityAnnualReport.newCityAdmin.lastName}</Link>}
                                    </Card.Grid></Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'
                                        style={{ marginTop: "-5px" }}
                                    >
                                        <Title
                                            level={4}>Правовий статус осередку</Title>
                                        <Text>{cityLegalStatuses[cityAnnualReport.newCityLegalStatusType]}</Text>
                                        <br />
                                    </Card.Grid></Col>
                            </Row>

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
                            ${cityAnnualReport.numberOfSeatsPtashat}`}</Text>
                                            <Text>{`Кількість пташат: 
                            ${cityAnnualReport.membersStatistic?.numberOfPtashata}`}</Text>
                                        </Space>
                                    </Card.Grid></Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title
                                            level={4}>УПН</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Кількість самостійних роїв: 
                            ${cityAnnualReport.numberOfIndependentRiy}`}</Text>
                                            <Text>{`Кількість новацтва: 
                            ${cityAnnualReport.membersStatistic?.numberOfNovatstva}`}</Text>
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
                                            level={4}>УСП</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Кількість старших пластунів прихильників: 
                            ${cityAnnualReport.membersStatistic?.numberOfSeniorPlastynSupporters}`}</Text>
                                            <Text>{`Кількість старших пластунів: 
                            ${cityAnnualReport.membersStatistic?.numberOfSeniorPlastynMembers}`}</Text>
                                        </Space>
                                    </Card.Grid>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title
                                            level={4}>УПС</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Кількість сеньйорів пластунів прихильників: 
                            ${cityAnnualReport.membersStatistic?.numberOfSeigneurSupporters}`}</Text>
                                            <Text>{`Кількість сеньйорів пластунів: 
                            ${cityAnnualReport.membersStatistic?.numberOfSeigneurMembers}`}</Text>
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
                                            level={4}>Адміністрування та виховництво</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Кількість діючих виховників (з усіх членів УСП, УПС): 
                            ${cityAnnualReport.numberOfTeachers}`}</Text>
                                            <Text>{`Кількість адміністраторів (в проводах будь якого рівня): 
                            ${cityAnnualReport.numberOfAdministrators}`}</Text>
                                            <Text>{`Кількість тих, хто поєднує виховництво та адміністрування: 
                            ${cityAnnualReport.numberOfTeacherAdministrators}`}</Text>
                                        </Space>
                                    </Card.Grid>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title
                                            level={4}>Пластприят</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Кількість пільговиків: 
                            ${cityAnnualReport.numberOfBeneficiaries}`}</Text>
                                            <Text>{`Кількість членів Пластприяту: 
                            ${cityAnnualReport.numberOfPlastpryiatMembers}`}</Text>
                                            <Text>{`Кількість почесних членів: 
                            ${cityAnnualReport.numberOfHonoraryMembers}`}</Text>
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
                            ${cityAnnualReport.numberOfClubs}`}</Text>
                                            <Text>{`Кількість самостійних гуртків: 
                            ${cityAnnualReport.numberOfIndependentGroups}`}</Text>
                                            <Text>{`Кількість неіменованих разом: 
                            ${cityAnnualReport.membersStatistic?.numberOfUnatstvaNoname}`}</Text>
                                            <Text>{`Кількість прихильників/ць: 
                            ${cityAnnualReport.membersStatistic?.numberOfUnatstvaSupporters}`}</Text>
                                            <Text>{`Кількість учасників/ць: 
                            ${cityAnnualReport.membersStatistic?.numberOfUnatstvaMembers}`}</Text>
                                            <Text>{`Кількість розвідувачів: 
                            ${cityAnnualReport.membersStatistic?.numberOfUnatstvaProspectors}`}</Text>
                                            <Text>{`Кількість скобів/вірлиць: 
                            ${cityAnnualReport.membersStatistic?.numberOfUnatstvaSkobVirlyts}`}</Text>
                                        </Space>
                                    </Card.Grid>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <Card.Grid
                                        className='container'>
                                        <Title
                                            level={4}>Залучені кошти</Title>
                                        <Space direction='vertical'>
                                            <Text>{`Державні кошти: 
                            ${cityAnnualReport.publicFunds}`}</Text>
                                            <Text>{`Внески: 
                            ${cityAnnualReport.contributionFunds}`}</Text>
                                            <Text>{`Пластовий заробіток: 
                            ${cityAnnualReport.plastSalary}`}</Text>
                                            <Text>{`Спонсорські кошти: 
                            ${cityAnnualReport.sponsorshipFunds}`}</Text>
                                            <br />
                                            <br />
                                            <br />
                                        </Space>
                                    </Card.Grid></Col>
                            </Row>

                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>Вкажіть, що вам допоможе ефективніше залучати волонтерів
                            та створювати виховні частини (гнізда, курені)</Title>
                                <Space direction='vertical'>
                                    <Text>{cityAnnualReport.improvementNeeds === null ? 'Інформація відсутня'
                                        : cityAnnualReport.improvementNeeds}</Text>
                                </Space>
                            </Card.Grid>
                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>Вкажіть перелік майна, що є в станиці</Title>
                                <Space direction='vertical'>
                                    <Text>{cityAnnualReport.listProperty === null ? 'Інформація відсутня'
                                        : cityAnnualReport.listProperty}</Text>
                                </Space>
                            </Card.Grid>
                        </Card>
                    </Form>
                </>}
        </>
    );
}

export default AnnualReportInformation;
