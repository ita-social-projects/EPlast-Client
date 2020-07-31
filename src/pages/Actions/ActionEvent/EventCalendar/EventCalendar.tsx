import React, { useEffect, useState } from 'react';
import eventUserApi from '../../../../api/eventUserApi';
import { Button, Space, Spin, Modal } from 'antd';
import FullCalendar, { CalendarData, CalendarApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import ukLocale from '@fullcalendar/core/locales/uk';
import { calendarFormat } from 'moment';

const classes = require('./EventCalendar.module.css');

export default function () {

    const [loading, setLoading] = useState(false);

    const [actions, setActions] = useState<any>([]);
    const [educations, setEducations] = useState<any>([]);
    const [camps, setCamps] = useState<any>([]);

    const [eventModal, setEventModal] = useState(false);

    const eventsColors: string[] = ['#6f8ab5', '#fdcb02', '#c01111'];

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
        }
        fetchData();
    }, []);


    function handleEventClick(event: any) {
        console.log(event);
        setEventModal(true);
    }



    return loading === false ? (
        <div className={classes.spaceWrapper}>
            <Space className={classes.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>
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
                        dayMaxEventRows={3}
                        dayMaxEvents={3}
                        moreLinkClick="popover"
                        showNonCurrentDates={false}
                        displayEventTime={false}
                        defaultAllDay={true}
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
                    </Modal >
                </div>
            </div>
        )
}

