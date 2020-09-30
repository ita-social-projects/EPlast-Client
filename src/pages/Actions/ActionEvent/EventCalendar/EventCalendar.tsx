import React, { useEffect, useState } from 'react';
import eventUserApi from '../../../../api/eventUserApi';
import { Button, Space, Spin, Modal } from 'antd';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ukLocale from '@fullcalendar/core/locales/uk';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import notificationLogic from '../../../../components/Notifications/Notification';
import Spinner from '../../../Spinner/Spinner';

const classes = require('./EventCalendar.module.css');

export default function () {

    const [loading, setLoading] = useState(false);
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
            if (window.innerWidth < 768) {
                notificationLogic('info', "Для кращого користувацького досвіду поверніть девайс на 90 градусів");
            }
        }
        fetchData();
    }, []);

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

        console.log(actions);
        console.log(camps); 
        return (actions as Array<any>).concat(educations as Array<any>).concat(camps as Array<any>);
    }

    const handleEventClick = (clickInfo: any) => {
        setEventModal(true);
        setEventInfo(clickInfo);
        console.log(clickInfo);
    }

    return loading === false ? (
        <Spinner />
    ) : (
            <div>
                <div>
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
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        }}
                        displayEventEnd={false}
                        locale={ukLocale}
                        height={'auto'}
                        eventClick={event => handleEventClick(event)}
                        initialEvents={getConcatedEvents()}
                        dayMaxEventRows={3}
                        dayMaxEvents={3}
                        eventTimeFormat={ {
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }
                        }
                        moreLinkClick="popover"
                        showNonCurrentDates={false}
                        displayEventTime={false}
                        defaultAllDay={false}
                        forceEventDuration={true}
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
                        <div className={classes.title}>
                        <h1>{eventInfo?.event?.title}</h1>
                        </div>
                        <h2>Дата початку: {moment(eventInfo?.event?.start).format("LLLL")}</h2>
                        <h2>Дата завершення: {moment(eventInfo?.event?.end).format("LLLL")}</h2>
                        <h2>Локація: {eventInfo?.event?._def.extendedProps.eventlocation}</h2>
                        <h2>Опис: {eventInfo?.event?._def.extendedProps.description}</h2>
                        < Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push(`/events/${eventInfo?.event?.id}/details`)} >
                            Деталі
                        </Button>
                    </Modal >
                </div>
            </div>
        )
}