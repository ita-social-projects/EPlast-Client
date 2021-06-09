import React from 'react';
import { Form, Row, Col, Typography, Input, Table, Card } from 'antd';
import moment from 'moment';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import { administrationsColumns, followersColumns, getTableAdmins, getTableFollowers, getTableMembers } from './ClubAnnualReportTableColumns';
import { emptyInput, maxLength } from '../../../components/Notifications/Messages';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
    club: {
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
        head: ClubAdmin,
    }
    admins: ClubAdmin[],
    members: ClubMember[],
    followers: ClubMember[],
}

export const ClubAnnualReportForm = (props: Props) => {
    const { club, admins, members, followers } = props;

    return (
        <>
            <Card>
                <Title
                    level={4}>Дані про членів куреня </Title>
                <div style={{ marginLeft: "20px" }}>
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
                                <TextArea style={{ width: "700px", height: "100px" }} />
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
                                <TextArea style={{ width: "700px", height: "100px" }} />
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
                                onDoubleClick: event => {
                                    if (user.key) window.open(`/userpage/main/${user.key}`)
                                },
                            };
                        }}
                    />

                </Card.Grid>
                <Row
                    gutter={16}
                    align='bottom'>

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
                </Row>

            </Card>
        </>
    );
}

export default ClubAnnualReportForm;