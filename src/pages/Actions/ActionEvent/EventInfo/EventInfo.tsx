import { Breadcrumb, Input, Row, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
// eslint-disable-next-line import/no-cycle
import eventsApi from "../../../../api/eventsApi";
import EventDetailsHeader from "./EventDetailsHeader";
import Gallery from "./Gallery";
import SortedEventInfo from "./SortedEventInfo";
// eslint-disable-next-line import/no-cycle
import { HomeOutlined } from "@ant-design/icons";
import jwt from "jwt-decode";
import eventUserApi from "../../../../api/eventUserApi";
import UserApi from "../../../../api/UserApi";
import AuthLocalStorage from "../../../../AuthLocalStorage";
import { EventDetails } from "../../../../models/Events/EventDetails";
import { EventParticipant } from "../../../../models/Events/EventParticipant";
import { Roles } from "../../../../models/Roles/Roles";
import Spinner from "../../../Spinner/Spinner";
import "./EventInfo.less";
import ParticipantsTable from "./ParticipantsTable";

const classes = require("./EventInfo.module.css");
const { Title } = Typography;

interface BcProps {
  type: [number, string];
  category: [number, string];
  event: [number, string];
}

const EventBreadcrumb: React.FC<BcProps> = (p: BcProps) => {
  const maxTextLength = 20;

  const textForCrumbs = (text: string) => {
    return text.length > maxTextLength ? (
      <Tooltip title={text}>{text.slice(0, maxTextLength) + "..."}</Tooltip>
    ) : (
      <span>{text}</span>
    );
  };

  return (
    <Breadcrumb className="event-breadcrumb">
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/events/types">Типи подій</Breadcrumb.Item>
      <Breadcrumb.Item href={`/events/${p.type[0]}/categories`}>
        {textForCrumbs(p.type[1])}
      </Breadcrumb.Item>
      <Breadcrumb.Item
        href={`/types/${p.type[0]}/categories/${p.category[0]}/events`}
      >
        {textForCrumbs(p.category[1])}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{textForCrumbs(p.event[1])}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const EventInfo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
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
  const [participantsLoaded, setParticipantsLoaded] = useState<boolean>(false);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    EventParticipant[]
  >([]);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await eventsApi.getEventInfo(id);
        await getUserAccessesForEvents(id);
        setEvent(response.data);
        setParticipantsInTable(response.data.event.eventParticipants);
        getEventStatusId(response.data.event.eventStatus);
        setLoading(true);
      } catch (error) {
        // this looks bad but i didn't find another way to accomplish this
        if ((error.message as string).includes("404")) history.push("/404");
      }
    };
    fetchData();
    getUserRoles();
  }, [visibleDrawer, approvedEvent, render]);

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
    if (value === "") {
      setFilteredParticipants(participants);
      return;
    }

    const filteredTable = participants.filter(
      (item: EventParticipant) =>
        item.fullName.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredParticipants(filteredTable);
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

  const setParticipantsInTable = (eventParticipants: EventParticipant[]) => {
    let availableParticipants = userAccesses["SeeUserTable"]
      ? eventParticipants
      : eventParticipants.filter(
          (p: EventParticipant) => p.status == "Учасник"
        );
    setParticipants(availableParticipants);
    setFilteredParticipants(availableParticipants);
    setParticipantsLoaded(true);
  };

  return loading === false ? (
    <Spinner />
  ) : (
    <div className="event-info-background">
      <Title style={{ overflowWrap: "anywhere" }} level={2}>
        {event.event.eventName}
      </Title>
      <div className="event-info-and-gallery">
        <div className="event-info-header">
          <EventBreadcrumb
            type={[event.event.eventTypeId, event.event.eventType]}
            category={[event.event.eventCategoryId, event.event.eventCategory]}
            event={[event.event.eventId, event.event.eventName]}
          />
          <EventDetailsHeader eventInfo={event.event} />
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
        </div>
        <div className="eventGallary">
          <Gallery
            key={event.event?.eventLocation}
            eventId={event.event?.eventId}
            userAccesses={userAccesses}
            pictureList={event.event.gallery}
          />
        </div>
      </div>
      <div className="event-info-wrapper">
        {userAccesses["SeeUserTable"] || event.isUserApprovedParticipant ? (
          <div className="participantsTable">
            <div key={"2"}>
              <Title level={2} className={classes.userTableTitle}>
                Таблиця учасників
              </Title>
              <Row className={classes.searchArea}>
                <Input.Search
                  allowClear
                  className={classes.inputSearch}
                  placeholder="Пошук"
                  enterButton
                  onSearch={search}
                  onChange={() => search("")}
                />
              </Row>
            </div>
            <div className="participant-table">
              <ParticipantsTable
                userAccesses={userAccesses}
                isEventFinished={event.isEventFinished}
                participants={filteredParticipants}
                eventName={event.event.eventName}
                key={event.event.eventId}
                setRender={setRender}
                loading={!participantsLoaded}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default EventInfo;
