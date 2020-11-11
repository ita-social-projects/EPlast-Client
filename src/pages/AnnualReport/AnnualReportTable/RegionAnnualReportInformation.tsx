import React from 'react';
import { Typography, Card, Modal, Space } from 'antd';
import RegionAnnualReport from '../Interfaces/RegionAnnualReports';
import moment from 'moment';

const { Title, Text } = Typography;

interface Props {
    visibleModal: boolean,
    regionAnnualReport: RegionAnnualReport,
    handleOk: () => void,
    showError: (message: string) => void
}

const RegionAnnualReportInformation = (props: Props) => {
    const { visibleModal, regionAnnualReport, handleOk } = props;

    return (
        <Modal
            onCancel={handleOk}
            visible={visibleModal}
            footer={null}
            className='annualreport-modal' >
            <Title
                className='textCenter'
                level={3} >
                {`Річний звіт округу ${props.regionAnnualReport.regionName} за 
                    ${moment(regionAnnualReport.annualReportYear).year()} рік`}</Title>
            <Card>
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
                </Card.Grid>
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
                </Card.Grid>
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
                    </Space>
                </Card.Grid>
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
                </Card.Grid>
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
            </Card>
        </Modal>
    );
}

export default RegionAnnualReportInformation;