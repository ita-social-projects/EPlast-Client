import React, { useEffect, useState } from 'react';
import eventUserApi from '../../../../api/eventUserApi';
import { Button, Space, Spin, Modal } from 'antd';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
<<<<<<< HEAD
import listPlugin from '@fullcalendar/list'
import ukLocale from '@fullcalendar/core/locales/uk';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
=======
import ukLocale from '@fullcalendar/core/locales/uk';
import moment from 'moment';
import 'moment/locale/uk';
moment.locale('uk-ua');
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

const classes = require('./EventCalendar.module.css');

export default function () {

    const [loading, setLoading] = useState(false);
<<<<<<< HEAD
    const [actions, setActions] = useState<any>([]);
    const [educations, setEducations] = useState<any>([]);
    const [camps, setCamps] = useState<any>([]);
    const [eventModal, setEventModal] = useState(false);
    const eventsColors: string[] = ['#6f8ab5', '#fdcb02', '#c01111'];
    const [eventInfo, setEventInfo] = useState<any>();
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            await eventUserApi.getActionsForCalendar().then(async response => {
                setActions(response.data);

                await eventUserApi.getEducationsForCalendar().then(async response => {
                    setEducations(response.data);

                    await eventUserApi.getCampsForCalendar().then(async response => {
                        setCamps(response.data);
                    })
                })
            })
            setLoading(true);
=======
    const [events, setEvents] = useState<any>({
        id: 0,
        title: '',
        start: '',
        end: '',
        eventlocation: '',
        description: '',
        color: '#3c5438'
    });

    const [eventModal, setEventModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await eventUserApi.getDataForCalendar().then(async response => {
                setEvents(response.data);
                setLoading(true);
            })
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
        }
        fetchData();
    }, []);

<<<<<<< HEAD
    function getConcatedEvents(): Array<any> {
        (actions as Array<any>).forEach(event => {
            Object.assign(event, { color: eventsColors[0] })
        });
        (educations as Array<any>).forEach(event => {
            Object.assign(event, { color: eventsColors[1] })
        });
        (camps as Array<any>).forEach(event => {
            Object.assign(event, { color: eventsColors[2] })
        });

        return (actions as Array<any>).concat(educations as Array<any>).concat(camps as Array<any>);
    }



    const handleEventClick = (clickInfo: any) => {
        setEventModal(true);
        setEventInfo(clickInfo);
    }

=======
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    return loading === false ? (
        <div className={classes.spaceWrapper}>
            <Space className={classes.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>
    ) : (
            <div>
                <div>
<<<<<<< HEAD
                    <div className={classes.legend}>
                        <div className={classes.legendItem}>
                            Акція
                            <div className={classes.legendCircle} style={{ background: eventsColors[0] }}></div>
                        </div>

                        <div className={classes.legendItem}>
                            Вишкіл
                            <div className={classes.legendCircle} style={{ background: eventsColors[1] }}></div>
                        </div>

                        <div className={classes.legendItem}>
                            Табір
                            <div className={classes.legendCircle} style={{ background: eventsColors[2] }}></div>
                        </div>
                    </div>
                    <FullCalendar
                        plugins={[dayGridPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,listMonth'
                        }}
                        views={{
                            listMonth: { buttonText: 'Список' },
                        }}
                        displayEventEnd={true}
                        locale={ukLocale}
                        timeZone={'Europe/Kiev'}
                        height={'auto'}
                        eventClick={event => handleEventClick(event)}
                        initialEvents={getConcatedEvents()}
=======
                    <FullCalendar
                        initialView="dayGridMonth"
                        plugins={[dayGridPlugin]}
                        themeSystem='Cosmo'
                        eventColor='#3c5438'
                        displayEventEnd={false}
                        customButtons={classes.button}
                        locale={ukLocale}
                        timeZone='Europe/Kiev'
                        height={'auto'}
                        eventClick={() => setEventModal(true)}
                        initialEvents={events}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                        dayMaxEventRows={3}
                        dayMaxEvents={3}
                        moreLinkClick="popover"
                        showNonCurrentDates={false}
                        displayEventTime={false}
<<<<<<< HEAD
                        defaultAllDay={true}
                        forceEventDuration={true}
=======
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                    />
                    < Modal
                        title="Деталі події"
                        centered
                        visible={eventModal}
                        className={classes.modal}
                        onCancel={() => setEventModal(false)}
                        footer={
                            [
                                <Button type="primary" key='submit' className={classes.buttonCansel} onClick={() => setEventModal(false)} >
                                    Закрити
                                </Button>
                            ]}
                    >
<<<<<<< HEAD
                        <h1>{eventInfo?.event?.title}</h1>
                        <h2>Дата початку: {moment(eventInfo?.event?.start).format("DD-MM-YYYY HH:mm")}</h2>
                        <h2>Дата завершення: {moment(eventInfo?.event?.end).format("DD-MM-YYYY HH:mm")}</h2>
                        <h2>Локація: {eventInfo?.event?._def.extendedProps.eventlocation}</h2>
                        <h2>Опис: {eventInfo?.event?._def.extendedProps.description}</h2>
                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${eventInfo?.event?.id}/details`)} >
                            Деталі
                        </Button>
=======
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                    </Modal >
                </div>
            </div>
        )
}

