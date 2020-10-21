import React, { useEffect, useState } from 'react';
import { Col, Input, notification, Row, Space, Spin, Table, Typography } from "antd";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-cycle
import SortedEventInfo from './SortedEventInfo';
import rawData from "./data";
import Gallery from './Gallery';
import eventsApi from "../../../../api/eventsApi";
import EventDetailsHeader from "./EventDetailsHeader";
// eslint-disable-next-line import/no-cycle
import ParticipantsTable from "./ParticipantsTable";
import spinClasses from "../EventUser/EventUser.module.css";

import './EventInfo.less';

const { Title } = Typography;

export interface EventDetails {
    event: EventInformation;
    participantAssessment: number;
    isUserEventAdmin: boolean;
    isUserParticipant: boolean;
    isUserApprovedParticipant: boolean;
    isUserUndeterminedParticipant: boolean;
    isUserRejectedParticipant: boolean;
    isEventFinished: boolean;
    isEventNotApproved: boolean;
    canEstimate: boolean;
}

export interface EventInformation {
    eventId: number;
    eventName: string;
    description: string;
    eventDateStart: string;
    eventDateEnd: string;
    eventLocation: string;
    eventTypeId: number;
    eventType: string;
    eventCategoryId: number;
    eventCategory: string;
    eventStatus: string;
    formOfHolding: string;
    forWhom: string;
    rating: number;
    eventAdmins: EventAdmin[];
    eventParticipants: EventParticipant[];
}

export interface EventParticipant {
    participantId: number;
    fullName: string;
    email: string;
    userId: string;
    statusId: number;
    status: string;
}

export interface EventAdmin {
    userId: string;
    fullName: string;
    adminType: string;
}

export interface EventGallery {
    galleryId: number;
    fileName: string;
}

const estimateNotification = () => {
    notification.info(
        {
            message: "Оцінювання події є доступним протягом 3 днів після її завершення!",
            placement: "topRight",
            duration: 7,
            key: "estimation"
        }
    );
};

const CheckEventForEstimation = ({ canEstimate, isEventFinished }: EventDetails) => {
    if (canEstimate && isEventFinished) {
        estimateNotification();
    }
}

const EventInfo = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const [, setFilterTable] = useState([{}]);
    const [baseData,] = useState(rawData);
    // @ts-ignore
    const [event, setEvent] = useState<EventDetails>({})
    const { id } = useParams();
    const [visibleDrawer,setVisibleDrawer]= useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getEventInfo(id);
            setEvent(response.data);
            setLoading(true);
        };
        fetchData();
    }, [visibleDrawer]);

    const search = (value: any) => {
        const filteredTable = baseData.filter((item: any) =>
            Object.keys(item).some(k =>
                String(item[k])
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )
        );
        setFilterTable(filteredTable);
    }

    const subscribeOnEvent = () => {
        setEvent((prevState: EventDetails) => {
            return {
                ...prevState,
                isUserParticipant: true,
                isUserUndeterminedParticipant: true
            }
        })
    }

    const unSubscribeOnEvent = () => {
        setEvent((prevState: EventDetails) => {
            return {
                ...prevState,
                isUserParticipant: false,
                isUserApprovedParticipant: false,
                isUserUndeterminedParticipant: false
            }
        })
    }

    return loading === false ? (
        <div className={spinClasses.spaceWrapper} key='1'>
            <Space className={spinClasses.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>

    ) : (
            <div className="event-info-background">
                {CheckEventForEstimation(event)}
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <SortedEventInfo
                            event={event}
                            setVisibleDrawer={setVisibleDrawer}
                            visibleDrawer={visibleDrawer}
                            subscribeOnEvent={subscribeOnEvent}
                            unSubscribeOnEvent={unSubscribeOnEvent}
                            key={event.event?.eventName}
                        />
                    </Col>
                    <Col xs={24} sm={{ span: 24, offset: 1 }} md={{ span: 24, offset: 3 }} lg={{ span: 16, offset: 0 }}>
                        <EventDetailsHeader eventInfo={event.event} />
                    </Col>
                </Row>
                <div className="event-info-wrapper">
                    <div className="eventGallary">

                        <Gallery key={event.event?.eventLocation} eventId={event.event?.eventId}
                            isUserEventAdmin={event.isUserEventAdmin} />
                    </div>
                    <div className="participantsTable">

                        <div key={'2'}>
                            <Title level={2} style={{ color: '#3c5438' }}>Таблиця користувачів</Title>
                            <Row>
                                <Input.Search
                                    style={{ width: "400px", margin: "0 0 10px 0" }}
                                    placeholder="Пошук"
                                    enterButton
                                    onSearch={search}
                                />
                            </Row>
                        </div>
                        <div className="participant-table">
                            <ParticipantsTable
                                isUserEventAdmin={event.isUserEventAdmin}
                                participants={event.event?.eventParticipants}
                                key={event.event?.eventId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
}
export default EventInfo;