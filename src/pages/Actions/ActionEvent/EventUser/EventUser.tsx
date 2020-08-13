import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Avatar, Modal, Button, Typography, Badge, Space, Spin, Checkbox, Tooltip, Skeleton } from 'antd';
import eventUserApi from '../../../../api/eventUserApi';
import classes from './EventUser.module.css';
import userApi from '../../../../api/UserApi';
import AuthStore from '../../../../stores/AuthStore';
import jwt from 'jwt-decode';
import { CalendarOutlined, FlagTwoTone, NotificationTwoTone, ToolTwoTone } from '@ant-design/icons';
import moment from 'moment';
const { Title } = Typography;

const EventUser = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>();
    const [createdEventsModal, setCreatedEventsModal] = useState(false);
    const [planedEventsModal, setPlanedEventsModal] = useState(false);
    const [visitedEventsModal, setVisitedEventsModal] = useState(false);
    const [checked, setChecked] = useState(false);
    const { userId } = useParams();
    const [userToken, setUserToken] = useState<any>([{
        nameid: ''
    }]);
    const [createdEvents, setCreatedEvents] = useState<any>({
        user: {
            id: '',
            firstName: '',
            lastName: '',
        },
        createdEvents: [{
            id: 0,
            eventName: '',
            eventDateStart: '',
            eventDateEnd: '',
            eventStatusID: ''
        }],
    });

    const [data, setData] = useState<any>({
        user: {
            id: '',
            firstName: '',
            lastName: '',
        },
        planedEvents: [{
            id: 0,
            eventName: '',
            eventDateStart: '',
            eventDateEnd: ''
        }],
        createdEvents: [{
            id: 0,
            eventName: '',
            eventDateStart: '',
            eventDateEnd: '',
            eventStatusID: ''
        }],
        visitedEvents: [{
            id: 0,
            eventName: '',
            eventDateStart: '',
            eventDateEnd: ''
        }]
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = AuthStore.getToken() as string;
            setUserToken(jwt(token));
            await eventUserApi.getEventsUser(userId).then(async response => {
                const { user, planedEvents, createdEvents, visitedEvents } = response.data;
                console.log(response.data);
                setData({ user, planedEvents, visitedEvents });
                setCreatedEvents({ user, createdEvents });
                await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
                    setImageBase64(response.data);
                })
                setLoading(true);
            })
        }
        fetchData();
    }, []);

    async function renderArchiveEvents(e: any) {
        setChecked(e.target.checked);
        if (checked === false) {
            await eventUserApi.getCreatedArchivedEvents(userId).then(async response => {
                const { user, createdEvents } = response.data;
                setCreatedEvents({ user, createdEvents });
            })
        }
        else {
            await eventUserApi.getEventsUser(userId).then(async response => {
                const { user, planedEvents, createdEvents, visitedEvents } = response.data;
                setData({ user, planedEvents, visitedEvents });
                setCreatedEvents({ user, createdEvents });
            })
        }
    };

    const newLocal = '#3c5438';
    return loading === false ? (
        <div className={classes.spaceWrapper}>
            <Space className={classes.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>
    ) : (
            <div className={classes.wrapper} >
                <div className={classes.wrapperImg}>
                    <Avatar size={200} src={imageBase64} />
                    <Title level={2}> {data?.user.firstName} {data?.user.lastName} </Title>
                    < div className={classes.line} />
                    {data?.user.userPlastDegreeName}
                    {userToken.nameid === userId && createdEvents?.createdEvents.length !== 0 &&
                        < Button type="primary" className={classes.button} onClick={() => history.push('/actions/eventCreate')} >
                            Створити подію
                 </Button>}
                </div>
                < div className={classes.wrapperCol} >
                    <div className={classes.wrapper}>
                        <div className={classes.wrapper2}>
                            <Title level={2}> Відвідані події </Title>
                            < div className={classes.line} />
                            {data.visitedEvents.length === 0 && userToken.nameid !== userId &&
                                <h2>{data?.user.firstName} {data?.user.lastName} ще не відвідав(ла) жодної події</ h2 >
                            }
                            {data.visitedEvents.length === 0 && userToken.nameid === userId &&
                                <h2>ви ще не відвідали жодної події</ h2 >
                            }
                            {data.visitedEvents.length !== 0 &&
                                <div>
                                    <Badge count={data.visitedEvents.length} style={{ backgroundColor: newLocal }} />
                                    <br />
                                    < Button type="primary" className={classes.button} onClick={() => setVisitedEventsModal(true)
                                    }>
                                        Список
                                    </Button>
                                </div>}
                            < Modal
                                title="Відвідані події"
                                centered
                                visible={visitedEventsModal}
                                className={classes.modal}
                                onCancel={() => setVisitedEventsModal(false)}
                                footer={
                                    [
                                        <Button type="primary" key='submit' className={classes.button} onClick={() => setVisitedEventsModal(false)
                                        } > Закрити </Button>
                                    ]}
                            >
                                {data.visitedEvents.map((item: any) =>
                                    <div>
                                        <h1>{item.eventName} </ h1 >
                                        < h2 > Дата початку: {moment(item.eventDateStart).format("DD-MM-YYYY HH:mm")} </h2>
                                        < h2 > Дата завершення: {moment(item.eventDateEnd).format("DD-MM-YYYY HH:mm")} </h2>
                                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${item.id}/details`)} >
                                            Деталі
                                        </Button>
                                        < hr />
                                    </div>)}
                            </Modal>
                        </div>
                        < div className={classes.wrapper3} >
                            <Title level={2}> Створені події </Title>
                            < div className={classes.line} />
                            {createdEvents.createdEvents.length !== 0 &&
                                <div>
                                    <Badge count={createdEvents.createdEvents.length} style={{ backgroundColor: '#3c5438' }} />
                                    <br />
                                    < Button type="primary" className={classes.button} onClick={() => setCreatedEventsModal(true)
                                    } >
                                        Список
                                </Button>
                                </div>}
                            {userToken.nameid === userId && createdEvents.createdEvents.length === 0 &&
                                <div>
                                    <h2>Ви ще не створили жодної події</ h2 >
                                    < Button type="primary" className={classes.button} onClick={() => history.push('/actions/eventCreate')} >
                                        Створити подію
                                    </Button>
                                </div>}
                            {userToken.nameid !== userId && createdEvents.createdEvents.length === 0 &&
                                < div >
                                    <h2>{data?.user.firstName} {data?.user.lastName} ще не створив(ла) жодної події</ h2 >
                                </div>
                            }
                            < Modal
                                title="Створені події"
                                centered
                                visible={createdEventsModal}
                                className={classes.modal}
                                onCancel={() => setCreatedEventsModal(false)}
                                footer={
                                    [
                                        <Checkbox checked={checked} onChange={(checked: any) => renderArchiveEvents(checked)}>
                                            Показати завершені події
                                       </Checkbox>,
                                        <Button type="primary" key='submit' className={classes.button} onClick={() => setCreatedEventsModal(false)}>
                                            Закрити
                                        </Button>
                                    ]}
                            >
                                {createdEvents.createdEvents.map((item: any) =>
                                    <div>
                                        {item.eventStatusID === 3 ?
                                            <div >
                                                <h1>{item.eventName} </ h1 >
                                                <Tooltip title="Затверджено">
                                                    <NotificationTwoTone className={classes.icon} twoToneColor={newLocal} key="approved" />
                                                </Tooltip>
                                            </div> :
                                            <div>
                                                <h1>{item.eventName} </ h1 >
                                                <Tooltip title="Не затверджено">
                                                    <ToolTwoTone className={classes.icon} twoToneColor={newLocal} key="notApproved" />
                                                </Tooltip>
                                            </div>}
                                        < h2 > Дата початку: {moment(item.eventDateStart).format("DD-MM-YYYY HH:mm")} </h2>
                                        < h2 > Дата завершення: {moment(item.eventDateEnd).format("DD-MM-YYYY HH:mm")} </h2>
                                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${item.id}/details`)} >
                                            Деталі
                                        </Button>
                                        {item.eventStatusID !== 1 && userToken.nameid === userId &&
                                            < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/actions/eventEdit/${item.id}`)}>
                                                Редагувати
                                            </Button>}
                                        < hr />
                                    </div>)}
                            </Modal>
                        </div>
                    </div>

                    <div className={classes.wrapper}>
                        < div className={classes.wrapper4} >
                            <Title level={2} className={classes.sectionTitle} > Заплановані події </Title>
                            < div className={classes.line} />
                            {data.planedEvents.length === 0 && userToken.nameid === userId ?
                                <div>
                                    <h2>Ви ще не запланували жодної події</ h2 >
                                    <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => history.push('/events/types')} >
                                        Зголоситись на подію
                                </Button>
                                </div> :
                                <h2>{data?.user.firstName} {data?.user.lastName} ще не запланував(ла) жодної події</ h2 >
                            }
                            {data.planedEvents.length !== 0 && <div>
                                <Badge count={data.planedEvents.length} style={{ backgroundColor: '#3c5438' }} />
                                <br />
                                < Button type="primary" className={classes.button} onClick={() => setPlanedEventsModal(true)
                                }>
                                    Список
                                </Button>
                            </div>}
                            < Modal
                                title="Заплановані події"
                                centered
                                visible={planedEventsModal}
                                className={classes.modal}
                                onCancel={() => setPlanedEventsModal(false)}
                                footer={
                                    [
                                        <Button type="primary" key='submit' className={classes.button} onClick={() => history.push('/events/types')} >
                                            Зголоситись на подію
                                        </Button>,
                                        < Button type="primary" key='submit' className={classes.button} onClick={() => setPlanedEventsModal(false)}>
                                            Закрити
                                        </Button>
                                    ]}
                            >
                                {data.planedEvents.map((item: any) => <div>
                                    <h1>{item.eventName} </ h1 >
                                    < h2 > Дата початку: {moment(item.eventDateStart).format("DD-MM-YYYY HH:mm")} </h2>
                                    < h2 > Дата завершення: {moment(item.eventDateEnd).format("DD-MM-YYYY HH:mm")} </h2>
                                    < Button type="primary" className={classes.button} id={classes.button} style={{ marginLeft: 160 }} onClick={() => history.push(`/events/${item.id}/details`)}>
                                        Деталі
                                    </Button>
                                    < hr />
                                </div>)}
                            </Modal>
                        </div>
                        < div className={classes.wrapper5} >
                            <Title level={2} className={classes.sectionTitle} > Календар подій </Title>
                            < div className={classes.line} />
                            <CalendarOutlined style={{ fontSize: '22px' }} />
                            < Button type="primary" className={classes.button} onClick={() => history.push("/actions/eventCalendar")}>
                                Переглянути
                        </Button>
                        </div>
                    </div>
                </div>
            </div >
        );
}

export default EventUser;