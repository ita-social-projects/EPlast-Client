import React, { useState, useEffect } from 'react';
import { Typography, Card, Modal, Space } from 'antd';
import AnnualReport from '../../Interfaces/AnnualReport';
import moment from 'moment';
import './AnnualReportInformation.less';
import AnnualReportApi from '../../../../api/AnnualReportApi';

const { Title, Text } = Typography;

interface Props {
    visibleModal: boolean,
    annualReport: AnnualReport,
    handleOk: () => void,
    showError: (message: string) => void
}

const AnnualReportInformation = (props: Props) => {
    const { visibleModal, annualReport, handleOk, showError } = props;
    const [cityLegalStatuses, setCityLegalStatuses] = useState<string[]>(Array());

    useEffect(() => {
        fetchCityLegalStatuses();
    }, [])

    const fetchCityLegalStatuses = async () => {
        try {
            let response = await AnnualReportApi.getCityLegalStatuses();
            setCityLegalStatuses(response.data.legalStatuses);
        }
        catch (error) {
            showError(error.message)
        }
    }

    return (
        <Modal
            onCancel={handleOk}
            visible={visibleModal}
            footer={null}
            className='annualreport-modal' >
            <Title
                className='textCenter'
                level={3} >
                {`Річний звіт станиці ${props.annualReport.city?.name} за 
                    ${moment(annualReport.date).year()} рік`}</Title>
            <Card>
                <Card.Grid
                    className='container' >
                    <Title
                        level={4}>Голова новообраної старшини</Title>
                    <Text>
                        {annualReport?.newCityAdmin == null ? 'Відсутній' :
                            `${annualReport.newCityAdmin.firstName} 
                    ${annualReport.newCityAdmin.lastName}`}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Правовий статус осередку</Title>
                    <Text>{cityLegalStatuses[annualReport.newCityLegalStatusType]}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>УПП</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість гніздечок пташат: 
                            ${annualReport.numberOfSeatsPtashat}`}</Text>
                        <Text>{`Кількість пташат: 
                            ${annualReport.membersStatistic?.numberOfPtashata}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>УПН</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість самостійних роїв: 
                            ${annualReport.numberOfIndependentRiy}`}</Text>
                        <Text>{`Кількість новацтва: 
                            ${annualReport.membersStatistic?.numberOfNovatstva}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>УПЮ</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість куренів у станиці/паланці (окрузі/регіоні): 
                            ${annualReport.numberOfClubs}`}</Text>
                        <Text>{`Кількість самостійних гуртків: 
                            ${annualReport.numberOfIndependentGroups}`}</Text>
                        <Text>{`Кількість неіменованих разом: 
                            ${annualReport.membersStatistic?.numberOfUnatstvaNoname}`}</Text>
                        <Text>{`Кількість прихильників/ць: 
                            ${annualReport.membersStatistic?.numberOfUnatstvaSupporters}`}</Text>
                        <Text>{`Кількість учасників/ць: 
                            ${annualReport.membersStatistic?.numberOfUnatstvaMembers}`}</Text>
                        <Text>{`Кількість розвідувачів: 
                            ${annualReport.membersStatistic?.numberOfUnatstvaProspectors}`}</Text>
                        <Text>{`Кількість скобів/вірлиць: 
                            ${annualReport.membersStatistic?.numberOfUnatstvaSkobVirlyts}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>УСП</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість старших пластунів прихильників: 
                            ${annualReport.membersStatistic?.numberOfSeniorPlastynSupporters}`}</Text>
                        <Text>{`Кількість старших пластунів: 
                            ${annualReport.membersStatistic?.numberOfSeniorPlastynMembers}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>УПС</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість сеньйорів пластунів прихильників: 
                            ${annualReport.membersStatistic?.numberOfSeigneurSupporters}`}</Text>
                        <Text>{`Кількість сеньйорів пластунів: 
                            ${annualReport.membersStatistic?.numberOfSeigneurMembers}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Адміністрування та виховництво</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість діючих виховників (з усіх членів УСП, УПС): 
                            ${annualReport.numberOfTeachers}`}</Text>
                        <Text>{`Кількість адміністраторів (в проводах будь якого рівня): 
                            ${annualReport.numberOfAdministrators}`}</Text>
                        <Text>{`Кількість тих, хто поєднує виховництво та адміністрування: 
                            ${annualReport.numberOfTeacherAdministrators}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Пластприят</Title>
                    <Space direction='vertical'>
                        <Text>{`Кількість пільговиків: 
                            ${annualReport.numberOfBeneficiaries}`}</Text>
                        <Text>{`Кількість членів Пластприяту: 
                            ${annualReport.numberOfPlastpryiatMembers}`}</Text>
                        <Text>{`Кількість почесних членів: 
                            ${annualReport.numberOfHonoraryMembers}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Залучені кошти</Title>
                    <Space direction='vertical'>
                        <Text>{`Державні кошти: 
                            ${annualReport.publicFunds}`}</Text>
                        <Text>{`Внески: 
                            ${annualReport.contributionFunds}`}</Text>
                        <Text>{`Пластовий заробіток: 
                            ${annualReport.plastSalary}`}</Text>
                        <Text>{`Спонсорські кошти: 
                            ${annualReport.sponsorshipFunds}`}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Вкажіть, що вам допоможе ефективніше залучати волонтерів
                            та створювати виховні частини (гнізда, курені)</Title>
                    <Space direction='vertical'>
                        <Text>{annualReport.improvementNeeds === null ? 'Інформація відсутня'
                            : annualReport.improvementNeeds}</Text>
                    </Space>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Вкажіть перелік майна, що є в станиці</Title>
                    <Space direction='vertical'>
                        <Text>{annualReport.listProperty === null ? 'Інформація відсутня'
                            : annualReport.listProperty}</Text>
                    </Space>
                </Card.Grid>
            </Card>
        </Modal>
    );
}

export default AnnualReportInformation;