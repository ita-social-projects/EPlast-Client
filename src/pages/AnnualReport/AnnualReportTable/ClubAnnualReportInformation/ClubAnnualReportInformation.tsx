import React, { useState } from 'react';
import { Typography, Card, Modal, Space, Form, Row, Col, Table } from 'antd';
import ClubAnnualReport from '../../Interfaces/ClubAnnualReport';
import moment from 'moment';
import './ClubAnnualReportInformation.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getClubAnnualReportById, getClubById } from '../../../../api/clubsApi';
import { useEffect } from 'react';
import Spinner from '../../../Spinner/Spinner';
import { administrationsColumns, followersColumns, getTableAdmins, getTableFollowers, getTableMembers } from '../../ClubAnnualReportCreate/ClubAnnualReportTableColumns';
import ClubAdmin from '../../../../models/Club/ClubAdmin';
import ClubMember from '../../../../models/Club/ClubMember';

const { Title, Text } = Typography;

const ClubAnnualReportInformation = () => {
    const { id } = useParams();
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState(Object);
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [club, setClub] = useState<any>({
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchClubReport(id);
    }, [])

    const fetchClubReport = async (id: number) => {
        setIsLoading(true);
        try {
            let clubReport = await getClubAnnualReportById(id);
            setClubAnnualReport(clubReport.data.annualreport);

            let response = await getClubById(clubReport.data.annualreport.clubId).then((res)=>{console.log(res); return res;});

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
                    {`Річний звіт куреня ${clubAnnualReport.clubName} за 
                    ${moment(clubAnnualReport.date).year()} рік`}</Title>
                <Link className="LinkText" style={{ fontSize: "14px" }} to="#" onClick={() => window.open(`/clubs/${clubAnnualReport.clubId}`)}>Перейти на профіль куреня {clubAnnualReport.clubName}</Link>
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
                                    level={4}>Географія куреня. Осередки в Україні:  </Title>
                                <Text>{clubAnnualReport.clubCenters}</Text>
                            </Card.Grid>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12}>
                            <Card.Grid
                                className='container'>
                                <Title
                                    level={4}>Побажання до КБ УСП:  </Title>
                                <Text>{clubAnnualReport.kbUSPWishes}</Text>
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

                    <Text style={{fontSize:'16px', fontWeight: 'bold'}}>Сайт/сторінка в інтернеті:  </Text>
                    <Text>{clubAnnualReport.clubPage}</Text>
                    <br/>
                    <br/>
                    <Text style={{fontSize:'16px', fontWeight: 'bold'}}>Дата заповнення:  </Text>
                    <Text>{moment(clubAnnualReport.date).format(
                        "DD.MM.YYYY HH:mm"
                    )}</Text>

                </Card>

            </Form>}
        </>
        // <Modal
        //     onCancel={handleOk}
        //     visible={visibleModal}
        //     footer={null}
        //     className='annualreport-modal' >
        //     
        //     <Card>
        //         <Card.Grid
        //             className='container'>
        //             <Title
        //                 level={4}>Провід куреня: </Title>
        //             {(clubAnnualReport?.clubMembersSummary?.split('\n').map((item, key) => {
        //                 if(item!=""){
        //                     return <Text key={key}>{key+1}. {
        //                         item?.split(',').map((item, key)=>{
        //                             if(item!="")
        //                                 return <Text key={key}>{item}<br/></Text>
        //                         })}<br/></Text>
        //                 }
        //             }))}
        //         </Card.Grid>
        //         <Card.Grid
        //             className='container'>
        //             <Title
        //                 level={4}>Контакти: </Title>
        //             {(clubAnnualReport?.clubAdminContacts?.split('\n').map((item, key)=>{
        //                 if(item!=""){
        //                     return <Text key={key}>{key+1}. {
        //                         item?.split(',').map((item, key)=>{
        //                             if(item!="")
        //                                 return <Text key={key}>{item}<br/></Text>
        //                         })}<br/></Text>
        //                 }
        //             }))}
        //         </Card.Grid>
        //         
        //         <Card.Grid
        //             className='container'>
        //             <Title
        //                 level={4}>Список членів куреня:  </Title>
        //             {(clubAnnualReport?.clubMembersSummary?.split('\n').map((item, key)=>{
        //                 if(item!=""){
        //                     return <Text key={key}>{key+1}. {
        //                         item?.split(',').map((item, key)=>{
        //                             if(item!="")
        //                                 return <Text key={key}>{item}<br/></Text>
        //                         })}<br/></Text>
        //                 }
        //             }))}
        //         </Card.Grid>
        //         </Card>
        // </Modal>
    );
}

export default ClubAnnualReportInformation;