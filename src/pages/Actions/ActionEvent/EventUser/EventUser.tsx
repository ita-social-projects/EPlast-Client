import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Modal, Button, Typography, Badge, Space, Spin } from 'antd';
import eventUserApi from '../../../../api/eventUserApi';
import classes from './EventUser.module.css';
import userApi from '../../../../api/UserApi';
import AuthStore from '../../../../stores/Auth';
import jwt from 'jwt-decode';
const { Title } = Typography;

const EventUser = () => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
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
            eventDateEnd: ''
        }],
        visitedEvents: [{
            id: 0,
            eventName: '',
            eventDateStart: '',
            eventDateEnd: ''
        }]
    });

    const [imageBase64, setImageBase64] = useState<string>();
    const [createdEventsModal, setCreatedEventsModal] = useState(false);
    const [planedEventsModal, setPlanedEventsModal] = useState(false);
    const [visitedEventsModal, setVisitedEventsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = AuthStore.getToken() as string;
            const user: any = jwt(token);
            await eventUserApi.getEventsUser(user.nameid).then(async response => {
                const { user, planedEvents, createdEvents, visitedEvents } = response.data;
                setData({ user, planedEvents, createdEvents, visitedEvents });
                await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
                    setImageBase64(response.data);
                })
                setLoading(true);
            })
        }
        fetchData();
    }, []);


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
                    <Button type="primary" className={classes.button} onClick={() => history.push('/actions/eventCreate')}>
                        Створити подію
                 </Button>
                </div>
                < div className={classes.wrapperCol} >
                    <div className={classes.wrapper}>
                        <div className={classes.wrapper2}>
                            <Title level={2}> Відвідані події </Title>
                            < div className={classes.line} />
                            {data.visitedEvents.length === 0 && <h2>Ви ще не відвідали жодної події</ h2 >}
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
                                        <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => setVisitedEventsModal(false)
                                        } > Закрити </Button>
                                    ]}
                            >
                                {data.visitedEvents.map((item: any) =>
                                    <div>
                                        <h1>{item.eventName} </ h1 >
                                        < h2 > Дата початку: {item.eventDateStart}</h2>
                                        < h2 > Дата завершення: {item.eventDateEnd} </h2>
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
                            {data.createdEvents.length !== 0 &&
                                <div>
                                    <Badge count={data.createdEvents.length} style={{ backgroundColor: '#3c5438' }} />
                                    <br />
                                    < Button type="primary" className={classes.button} onClick={() => setCreatedEventsModal(true)
                                    } >
                                        Список
                                </Button>
                                </div>}
                            {data.createdEvents.length === 0 && <h2>Ви ще не створили жодної події </h2>}
                            < Modal
                                title="Створені події"
                                centered
                                visible={createdEventsModal}
                                className={classes.modal}
                                onCancel={() => setCreatedEventsModal(false)}
                                footer={
                                    [
                                        <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => setCreatedEventsModal(false)}>
                                            Закрити
                                    </Button>
                                    ]}
                            >
                                {data.createdEvents.map((item: any) =>
                                    <div>
                                        <h1>{item.eventName} </ h1 >
                                        < h2 > Дата початку: {item.eventDateStart} </h2>
                                        < h2 > Дата завершення: {item.eventDateEnd} </h2>
                                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${item.id}/details`)} >
                                            Деталі
                                    </Button>
                                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/actions/eventEdit/${item.id}`)}>
                                            Редагувати
                                    </Button>
                                        < hr />
                                    </div>)}
                            </Modal>
                        </div>
                    </div>

                    <div className={classes.wrapper}>
                        < div className={classes.wrapper4} >
                            <Title level={2} className={classes.sectionTitle} > Заплановані події </Title>
                            < div className={classes.line} />
                            {data.planedEvents.length === 0 && <div>
                                <h2>Ви ще не запланували жодної події</ h2 >
                                <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => history.push('/actions')} >
                                    Зголоситись на подію
                                </Button>
                            </div>}
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
                                        <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => history.push('/actions')} >
                                            Зголоситись на подію
                                        </Button>,
                                        < Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => setPlanedEventsModal(false)}>
                                            Закрити
                                        </Button>
                                    ]}
                            >
                                {data.planedEvents.map((item: any) => <div>
                                    <h1>{item.eventName} </ h1 >
                                    < h2 > Дата початку: {item.eventDateStart} </h2>
                                    < h2 > Дата завершення: {item.eventDateEnd} </h2>
                                    < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${item.id}/details`)}>
                                        Деталі
                                    </Button>
                                    < hr />
                                </div>)}
                            </Modal>
                        </div>
                        < div className={classes.wrapper5} >
                            <Title level={2} className={classes.sectionTitle} > Календар подій </Title>
                            < div className={classes.line} />
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
