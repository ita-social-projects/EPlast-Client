import React, { useEffect, useState } from 'react';
import eventUserApi from '../../../../api/eventUserApi';
import { Button, Space, Spin, Modal } from 'antd';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ukLocale from '@fullcalendar/core/locales/uk';
import moment from 'moment';
import 'moment/locale/uk';
moment.locale('uk-ua');

const classes = require('./EventCalendar.module.css');

export default function () {

    const [loading, setLoading] = useState(false);
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
        }
        fetchData();
    }, []);

    return loading === false ? (
        <div className={classes.spaceWrapper}>
            <Space className={classes.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>
    ) : (
            <div>
                <div>
                    <FullCalendar
                        initialView="dayGridMonth"
                        plugins={[dayGridPlugin]}
                        themeSystem='Cosmo'
                        eventColor='#3c5438'
                        displayEventEnd={false}
                        customButtons={classes.button}
                        locale={ukLocale}
                        timeZone='Europe/Kiev'
                        locales={[ukLocale]}
                        height={'auto'}
                        eventClick={() => setEventModal(true)}
                        initialEvents={events}
                        dayMaxEventRows={3}
                        dayMaxEvents={3}
                        moreLinkClick="popover"
                        showNonCurrentDates={false}
                        displayEventTime={false}
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

