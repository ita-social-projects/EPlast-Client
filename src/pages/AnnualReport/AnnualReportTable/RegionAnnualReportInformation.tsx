import React, { useEffect, useState } from 'react';
import { Typography, Card, Modal, Space, Form, Row, Col } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import regionsApi from '../../../api/regionsApi';
import RegionMembersTable from './RegionMembersTable/RegionMembersTable';

const { Title, Text } = Typography;


const RegionAnnualReportInformation = () => {
    const { annualreportId, year } = useParams();
    const history = useHistory();
    const [regionAnnualReport, setRegionAnnualReport] = useState(Object);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRegionReports(annualreportId, year);
    }, [])

    const fetchRegionReports = async (annualreportId: number, year: number) => {
        setIsLoading(true);
        try {
            let response = await regionsApi.getReportById(annualreportId, year);
            setRegionAnnualReport(response.data)
        }
        catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    return (
        <>
            {isLoading ? <Spinner /> : <Form
                onFinish={() => history.goBack()}
                className='annualreport-form'>
                <Title
                    className='textCenter'
                    level={3} >
                    {`Річний звіт округи ${regionAnnualReport.regionName} за 
                    ${year} рік`}</Title>
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

            </Form>}
        </>
    );
}

export default RegionAnnualReportInformation;