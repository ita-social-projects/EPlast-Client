import React, { useState, useEffect } from 'react';
import { Typography, Card, Modal, Space } from 'antd';
import ClubAnnualReport from '../../Interfaces/ClubAnnualReport';
import moment from 'moment';
import './ClubAnnualReportInformation.less';
import AnnualReportApi from '../../../../api/AnnualReportApi';
import notificationLogic from '../../../../components/Notifications/Notification';
import { tryAgain } from '../../../../components/Notifications/Messages';

const { Title, Text } = Typography;

interface Props {
    visibleModal: boolean,
    clubAnnualReport: ClubAnnualReport,
    handleOk: () => void,
}

const ClubAnnualReportInformation = (props: Props) => {
    const { visibleModal, clubAnnualReport, handleOk} = props;
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
            {
                if (error.response?.status === 400) {
                  notificationLogic('error', tryAgain);
                };
            }
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
                {`Річний звіт куреня за 
                    ${moment(clubAnnualReport.date).year()} рік`}</Title>
            <Card>
                <Card.Grid
                    className='container' >
                    <Title
                        level={4}>Курінь</Title>
                    <Text>
                        {clubAnnualReport.clubName}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Провід куреня: </Title>
                    <Text>{clubAnnualReport.clubMembersSummary}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Контакти: </Title>
                    <Text>{clubAnnualReport.clubAdminContacts}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Сайт/сторінка в інтернеті:  </Title>
                    <Text>{clubAnnualReport.clubPage}</Text>
                </Card.Grid>
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
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Географія куреня. Осередки в Україні:  </Title>
                    <Text>{clubAnnualReport.clubCenters}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Побажання до КБ УСП:  </Title>
                    <Text>{clubAnnualReport.kbUSPWishes}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Дата заповнення:  </Title>
                    <Text>{moment(clubAnnualReport.date).format(
                      "DD.MM.YYYY HH:mm"
                    )}</Text>
                </Card.Grid>
                <Card.Grid
                    className='container'>
                    <Title
                        level={4}>Список членів куреня:  </Title>
                    <Text>{clubAnnualReport.clubMembersSummary}</Text>
                </Card.Grid>
                </Card>
        </Modal>
    );
}

export default ClubAnnualReportInformation;