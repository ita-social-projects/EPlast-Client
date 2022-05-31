import React, { useEffect, useState } from "react";
import { Col, Input, notification, Row, Typography } from "antd";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-cycle
import SortedEventInfo from "./SortedEventInfo";
import rawData from "./data";
import Gallery from "./Gallery";
import eventsApi from "../../../../api/eventsApi";
import EventDetailsHeader from "./EventDetailsHeader";
// eslint-disable-next-line import/no-cycle
import ParticipantsTable from "./ParticipantsTable";
import "./EventInfo.less";
import Spinner from "../../../Spinner/Spinner";
import AuthLocalStorage from "../../../../AuthLocalStorage";
import jwt from "jwt-decode";
import eventUserApi from "../../../../api/eventUserApi";
import UserApi from "../../../../api/UserApi";
import { Roles } from "../../../../models/Roles/Roles";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";

const classes = require("./EventInfo.module.css");
const { Title } = Typography;

export interface EventDetails {
  event: EventInformation;
  participantAssessment: number;
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
  numberOfPartisipants: number;
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

const EventInfo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [, setFilterTable] = useState([{}]);
  const [baseData] = useState(rawData);
  // @ts-ignore
  const [event, setEvent] = useState<EventDetails>({});
  const [eventStatusID, setEventStatusID] = useState<number>();
  const { id } = useParams();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [approvedEvent, setApprovedEvent] = useState(false);
  const [render, setRender] = useState(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isUserRegisteredUser, setUserRegisterUser] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventsApi.getEventInfo(id);
      setEvent(response.data);
      getEventStatusId(response.data.event.eventStatus);
      setLoading(true);
    };
    fetchData();
    getUserAccessesForEvents(id);
    getUserRoles();
  }, [visibleDrawer, approvedEvent, render]);

  const estimateNotification = (userId: string) => {
    NotificationBoxApi.createNotifications(
      [userId],
      "Оцінювання події є доступним протягом 3 днів після її завершення! ",
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/events/details/${id}`,
      event.event.eventName
    );
  };

  const CheckEventForEstimation = ({
    canEstimate,
    isEventFinished,
    userId,
  }: any) => {
    if (canEstimate && isEventFinished) {
      estimateNotification(userId);
    }
  };

  const getEventStatusId = async (eventStatus: string) => {
    await eventsApi.getEventStatusId(eventStatus).then((response) => {
      setEventStatusID(response.data);
    });
  };

  const getUserAccessesForEvents = async (id: number) => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await eventUserApi.getUserEventAccess(user.nameid, +id).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const getUserRoles = () => {
    let roles = UserApi.getActiveUserRoles();
    setUserRegisterUser(roles.includes(Roles.RegisteredUser));
  };

  const search = (value: any) => {
    const filteredTable = baseData.filter((item: any) =>
      Object.keys(item).some((k) =>
        String(item[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilterTable(filteredTable);
  };

  const subscribeOnEvent = () => {
    setEvent((prevState: EventDetails) => {
      return {
        ...prevState,
        isUserParticipant: true,
        isUserUndeterminedParticipant: true,
      };
    });
  };

  const unSubscribeOnEvent = () => {
    setEvent((prevState: EventDetails) => {
      return {
        ...prevState,
        isUserParticipant: false,
        isUserApprovedParticipant: false,
        isUserUndeterminedParticipant: false,
      };
    });
  };

  const setParticipantsInTable = () => {
    if (userAccesses["SeeUserTable"]) {
      return event.event?.eventParticipants;
    } else {
      return event.event?.eventParticipants.filter(
        (p: EventParticipant) => p.status == "Учасник"
      );
    }
  };

  return loading === false ? (
    <Spinner />
  ) : (
    <div className="event-info-background">
      {CheckEventForEstimation(event)}
      <Row className="event-info-header">
        <Col xs={24} sm={24} md={24} lg={8}>
          <SortedEventInfo
            userAccesses={userAccesses}
            event={event}
            eventStatusId={eventStatusID!}
            setApprovedEvent={setApprovedEvent}
            setVisibleDrawer={setVisibleDrawer}
            visibleDrawer={visibleDrawer}
            subscribeOnEvent={subscribeOnEvent}
            unSubscribeOnEvent={unSubscribeOnEvent}
            key={event.event?.eventName}
            setRender={setRender}
            canViewAdminProfiles={!isUserRegisteredUser}
          />
        </Col>
        <Col
          xs={24}
          sm={{ span: 24, offset: 1 }}
          md={{ span: 24, offset: 3 }}
          lg={{ span: 16, offset: 0 }}
        >
          <EventDetailsHeader eventInfo={event.event} />
        </Col>
      </Row>
      <div className="event-info-wrapper">
        <div className="eventGallary">
          <Gallery
            key={event.event?.eventLocation}
            eventId={event.event?.eventId}
            userAccesses={userAccesses}
          />
        </div>
        {userAccesses["SeeUserTable"] || event.isUserApprovedParticipant ? (
          <div className="participantsTable">
            <div key={"2"}>
              <Title level={2} className={classes.userTableTitle}>
                Таблиця учасників
              </Title>
              <Row>
                <Input.Search
                  className={classes.inputSearch}
                  placeholder="Пошук"
                  enterButton
                  onSearch={search}
                />
              </Row>
            </div>
            <div className="participant-table">
              <ParticipantsTable
                userAccesses={userAccesses}
                isEventFinished={event.isEventFinished}
                participants={setParticipantsInTable()}
                eventName={event.event.eventName}
                key={event.event?.eventId}
                setRender={setRender}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default EventInfo;
