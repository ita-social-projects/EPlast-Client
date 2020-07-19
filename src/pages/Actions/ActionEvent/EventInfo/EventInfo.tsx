import React, {useEffect, useState} from 'react';
import {Table, Input, Row} from "antd";
import {useParams} from "react-router-dom";
// eslint-disable-next-line import/no-cycle
import SortedEventInfo from './SortedEventInfo';
import rawData from "./data";
import Gallery from './Gallery';
import eventsApi from "../../../../api/eventsApi";

const classes = require('./EventInfo.module.css');


const baseColumns = [
    {
        title: "Користувач",
        dataIndex: "fullName",
        key: "user"
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email"
    },
    {
        title: "Поточний статус",
        dataIndex: "status",
        key: "status"
    }
];

export interface EventDetails {
    event: EventInformation;
    isUserEventAdmin: boolean;
    isUserParticipant: boolean;
    isUserApprovedParticipant: boolean;
    isUserUndeterminedParticipant: boolean;
    isUserRejectedParticipant: boolean;
    isEventFinished: boolean;
}

export interface EventInformation {
    eventId: number;
    eventName: string;
    description: string;
    eventDateStart: string;
    eventDateEnd: string;
    eventLocation: string;
    eventType: string;
    eventCategory: string;
    eventStatus: string;
    formOfHolding: string;
    forWhom: string;
    eventAdmins: EventAdmin[];
    eventParticipants: EventParticipant[];
    eventGallery: EventGallery[];
}

interface EventParticipant {
    participantId: number;
    fullName: string;
    email: string;
    userId: string;
    statusId: number;
    status: string;
}

interface EventAdmin {
    userId: string;
    fullName: string;
    email: string;
}

interface EventGallery {
    galleryId: number;
    fileName: string;
}

const EventInfo = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filterTable, setFilterTable] = useState([{}]);
    const [baseData,] = useState(rawData);
    // @ts-ignore
    const [event, setEvent] = useState<EventDetails>({})
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getEventInfo(id);
            setEvent(response.data)
            //           console.log(event);
        };
        fetchData();
    }, []);

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

    return (
        <div className={classes.background}>
            <div className={classes.wrapper}>
                <div className={classes.actionsWrapper}>
                    <SortedEventInfo
                        event={event}
                        subscribeOnEvent={subscribeOnEvent}
                        unSubscribeOnEvent={unSubscribeOnEvent}
                    />
                </div>
                <Gallery/>
                <div>
                    <Row>
                        <Input.Search
                            style={{width: "400px", margin: "0 0 10px 0"}}
                            placeholder="Search by..."
                            enterButton
                            onSearch={search}
                        />
                    </Row>
                    <Table
                        rowKey="uid"
                        columns={baseColumns}
                        //                    dataSource={filterTable.length < 2 ? baseData : filterTable}
                        dataSource={event.event?.eventParticipants}
                    />
                </div>

            </div>
        </div>
    )
}
export default EventInfo;