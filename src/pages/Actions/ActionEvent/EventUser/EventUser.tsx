import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Avatar, Modal, Button, Typography, Badge, Space, Spin, Tooltip, Switch, Drawer, Tag } from 'antd';
import eventUserApi from '../../../../api/eventUserApi';
import EventsUser from '../../../../models/EventUser/EventUser';
import CreatedArchivedEvents from '../../../../models/EventUser/CreatedArchivedEvents';
import classes from './EventUser.module.css';
import userApi from '../../../../api/UserApi';
import AuthStore from '../../../../stores/AuthStore';
import jwt from 'jwt-decode';
import { CalendarOutlined, NotificationTwoTone, ToolTwoTone } from '@ant-design/icons';
import moment from 'moment';
import EventCreateDrawer from '../EventCreate/EventCreateDrawer';
import EventEditDrawer from '../EventEdit/EventEditDrawer';
const { Title } = Typography;

const EventUser = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>();
    const [createdEventsModal, setCreatedEventsModal] = useState(false);
    const [plannedEventsModal, setPlannedEventsModal] = useState(false);
    const [visitedEventsModal, setVisitedEventsModal] = useState(false);
    const [checked, setChecked] = useState(false);
    const { userId } = useParams();
    const [createdEvents, setCreatedEvents] = useState<CreatedArchivedEvents>(new CreatedArchivedEvents());
    const [allEvents, setAllEvents] = useState<EventsUser>(new EventsUser());
    const [showEventCreateDrawer, setShowEventCreateDrawer] = useState(false);
    const [showEventEditDrawer, setShowEventEditDrawer] = useState(false);
    const [eventId, setEventId] = useState<number>();
    const [userToken, setUserToken] = useState<any>([{
        nameid: ''
    }]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = AuthStore.getToken() as string;
        setUserToken(jwt(token));
        await eventUserApi.getEventsUser(userId).then(async response => {
            const { user, createdEvents } = response.data;
            setAllEvents(response.data);
            setCreatedEvents({ user, createdEvents });
            await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
                setImageBase64(response.data);
            })
            setLoading(true);
        })
    }

    async function renderArchiveEvents(checked: any) {
        setChecked(checked);
        if (checked === true) {
            await eventUserApi.getCreatedArchivedEvents(userId).then(async response => {
                const { user, createdEvents } = response.data;
                setCreatedEvents({ user, createdEvents });
            })
        }
        else {
            await fetchData();
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
                    <Avatar className={classes.avatar} size={300} src={imageBase64} />
                    <Title level={2}> {allEvents?.user.firstName} {allEvents?.user.lastName} </Title>
                    < div className={classes.line} />
                    {userToken.nameid === userId && createdEvents?.createdEvents.length !== 0 &&
                        < Button type="primary" className={classes.button} onClick={() => setShowEventCreateDrawer(true)} >
                            Створити подію
                        </Button>}
                </div>
                < div className={classes.wrapperCol} >
                    <div className={classes.wrapper}>
                        <div className={classes.wrapper2}>
                            <Title level={2}> Відвідані події </Title>
                            < div className={classes.line} />
                            {allEvents.visitedEvents?.length === 0 && userToken.nameid !== userId &&
                                <h2>{allEvents?.user.firstName} {allEvents?.user.lastName} ще не відвідав(ла) жодної події</ h2 >
                            }
                            {allEvents?.visitedEvents?.length === 0 && userToken.nameid === userId &&
                                <h2>Ви ще не відвідали жодної події</ h2 >
                            }
                            {allEvents?.visitedEvents?.length !== 0 &&
                                <div>
                                    <Badge count={allEvents?.visitedEvents?.length} style={{ backgroundColor: newLocal }} />
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
                                {allEvents?.visitedEvents?.map((item: any) =>
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
                                    < Button type="primary" className={classes.button} onClick={() => setShowEventCreateDrawer(true)} >
                                        Створити подію
                                    </Button>
                                </div>}

                            <EventCreateDrawer
                                visibleEventCreateDrawer={showEventCreateDrawer}
                                setShowEventCreateDrawer={setShowEventCreateDrawer}
                                onCreate={fetchData}
                            />

                            {userToken.nameid !== userId && createdEvents.createdEvents.length === 0 &&
                                < div >
                                    <h2>{allEvents?.user.firstName} {allEvents?.user.lastName} ще не створив(ла) жодної події</ h2 >
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
                                        <div className={classes.modalFooter}>
                                            <Switch size="default" unCheckedChildren="Архів" checked={checked} onChange={(checked: any) => renderArchiveEvents(checked)} />
                                            <Button type="primary" key='submit' className={classes.button} onClick={() => setCreatedEventsModal(false)}>
                                                Закрити
                                        </Button>
                                        </div>
                                    ]}
                            >
                                {createdEvents.createdEvents.map((item: any) =>
                                    <div>
                                        {/* <Tag color="red">azaza</Tag> */}
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
                                            < Button type="primary" className={classes.button} id={classes.button} onClick={() => { setShowEventEditDrawer(true); setEventId(item.id); }}>
                                                Редагувати
                                            </Button>}
                                        < hr />
                                    </div>)}
                                <EventEditDrawer
                                    id={eventId!}
                                    visibleEventEditDrawer={showEventEditDrawer}
                                    setShowEventEditDrawer={setShowEventEditDrawer}
                                    onEdit={fetchData} />
                            </Modal>
                        </div>
                    </div>
                    <div className={classes.wrapper}>
                        < div className={classes.wrapper4} >
                            <Title level={2} className={classes.sectionTitle} > Заплановані події </Title>
                            < div className={classes.line} />
                            {allEvents?.planedEvents?.length === 0 && userToken.nameid === userId &&
                                <div>
                                    <h2>Ви ще не запланували жодної події</ h2 >
                                    <Button type="primary" key='submit' className={classes.button} id={classes.subcribeButton} onClick={() => history.push('/events/types')} >
                                        Зголоситись на подію
                                </Button>
                                </div>}
                            {allEvents?.planedEvents?.length === 0 && userToken.nameid !== userId &&
                                <h2>{allEvents?.user.firstName} {allEvents?.user.lastName} ще не запланував(ла) жодної події</ h2 >}
                            {allEvents?.planedEvents?.length !== 0 && <div>
                                <Badge count={allEvents?.planedEvents?.length} style={{ backgroundColor: '#3c5438' }} />
                                <br />
                                < Button type="primary" className={classes.button} onClick={() => setPlannedEventsModal(true)
                                }>
                                    Список
                                </Button>
                            </div>}
                            < Modal
                                title="Заплановані події"
                                centered
                                visible={plannedEventsModal}
                                className={classes.modal}
                                onCancel={() => setPlannedEventsModal(false)}
                                footer={
                                    [
                                        <Button type="primary" key='submit' className={classes.button} id={classes.subcribeButton} onClick={() => history.push('/events/types')} >
                                            Зголоситись на подію
                                        </Button>,
                                        < Button type="primary" key='submit' className={classes.button} onClick={() => setPlannedEventsModal(false)}>
                                            Закрити
                                        </Button>
                                    ]}
                            >
                                {allEvents?.planedEvents?.map((item: any) => <div>
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
                            <CalendarOutlined style={{ fontSize: '23px', marginBottom: "7.5px" }} />
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