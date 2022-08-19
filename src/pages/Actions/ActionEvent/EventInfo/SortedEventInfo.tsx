import {
  CheckCircleTwoTone,
  CheckSquareOutlined,
  DeleteTwoTone,
  EditTwoTone,
  IdcardOutlined,
  QuestionCircleTwoTone,
  StopOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Modal, Rate, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import eventUserApi from "../../../../api/eventUserApi";
import userApi from "../../../../api/UserApi";
import EventAdminLogo from "../../../../assets/images/EventAdmin.png";
import CreatedEvents from "../../../../models/EventUser/CreatedEvents";
import EventsUser from "../../../../models/EventUser/EventUser";
import {
  showApproveConfirm,
  showDeleteConfirmForSingleEvent,
  showSubscribeConfirm,
  showUnsubscribeConfirm,
} from "../../EventsModals";
import EventEditDrawer from "../EventEdit/EventEditDrawer";
import EventFeedbackModal from "./EventFeedbackModal";
import { EventAdmin, EventDetails } from "./EventInfo";
import "./EventInfo.less";

interface Props {
  userAccesses: { [key: string]: boolean };
  event: EventDetails;
  eventStatusId: number;
  visibleDrawer: boolean;
  canViewAdminProfiles: boolean;
  setApprovedEvent: (visible: boolean) => void;
  setVisibleDrawer: (visible: boolean) => void;
  subscribeOnEvent: () => void;
  unSubscribeOnEvent: () => void;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
}

const RenderEventIcons = (
  userAccesses: { [key: string]: boolean },
  {
    event,
    isUserParticipant,
    isUserApprovedParticipant,
    isUserUndeterminedParticipant,
    isUserRejectedParticipant,
    isEventFinished,
  }: EventDetails,
  setApprovedEvent: (visible: boolean) => void,
  setVisibleDrawer: (visible: boolean) => void,
  subscribeOnEvent: () => void,
  unSubscribeOnEvent: () => void,
  setAdminsVisibility: (flag: boolean) => void
) => {
  const eventIcons: React.ReactNode[] = [];
  const roles = ([] as string[]).concat(userApi.getActiveUserRoles());

  const SubscribeToEvent = () => {
    eventIcons.push(
      <Tooltip title="Зголоситися на подію" key="subscribe">
        <UserAddOutlined
          onClick={() =>
            showSubscribeConfirm({
              eventId: event?.eventId,
              eventName: event?.eventName,
              successCallback: subscribeOnEvent,
              isSingleEventInState: true,
              eventAdmins: event.eventAdmins,
              eventParticipants: event.eventParticipants,
            })
          }
          style={{ color: "#3c5438" }}
          key="subscribe"
        />
      </Tooltip>
    );
  };

  const TrackStatus = () => {
    if (isUserRejectedParticipant) {
      eventIcons.push(
        <Tooltip
          placement="bottom"
          title="Вашу заявку на участь у даній події відхилено"
          key="banned"
        >
          <StopOutlined
            style={{ color: "#8B0000" }}
            className="icon"
            key="banned"
          />
        </Tooltip>
      );
    } else {
      if (isUserApprovedParticipant) {
        eventIcons.push(
          <Tooltip placement="bottom" title="Учасник" key="participant">
            <CheckCircleTwoTone
              twoToneColor="#73bd79"
              className="icon"
              key="participant"
            />
          </Tooltip>
        );
      }

      if (isUserUndeterminedParticipant) {
        eventIcons.push(
          <Tooltip
            placement="bottom"
            title="Ваша заявка розглядається"
            key="underReview"
          >
            <QuestionCircleTwoTone
              twoToneColor="#FF8C00"
              className="icon"
              key="underReview"
            />
          </Tooltip>
        );
      }

      eventIcons.push(
        <Tooltip
          placement="bottom"
          title="Відписатися від події"
          key="unsubscribe"
        >
          <UserDeleteOutlined
            onClick={() =>
              showUnsubscribeConfirm({
                eventId: event?.eventId,
                eventName: event?.eventName,
                successCallback: unSubscribeOnEvent,
                isSingleEventInState: true,
                eventAdmins: event.eventAdmins,
                eventParticipants: event.eventParticipants,
              })
            }
            style={{ color: "#8B0000" }}
            className="icon"
            key="unsubscribe"
          />
        </Tooltip>
      );
    }
  };

  if (isUserParticipant && !isEventFinished) {
    TrackStatus();
  } else if (!isEventFinished && userAccesses["SubscribeOnEvent"]) {
    SubscribeToEvent();
  }

  if (userAccesses["ApproveEvent"] && event.eventStatus === "Не затверджено") {
    eventIcons.push(
      <Tooltip placement="bottom" title="Затвердити подію" key="setting">
        <CheckSquareOutlined
          style={{ color: "#3c5438" }}
          onClick={() =>
            showApproveConfirm({
              eventId: event?.eventId,
              eventName: event?.eventName,
              eventStatusId: event?.eventStatus,
              eventAdmins: event.eventAdmins,
              setApprovedEvent: setApprovedEvent,
            })
          }
          className="icon"
          key="setting"
        />
      </Tooltip>
    );
  }

  if (userAccesses["EditEvent"]) {
    eventIcons.push(
      <Tooltip placement="bottom" title="Редагувати" key="edit">
        <EditTwoTone
          twoToneColor="#3c5438"
          className="icon"
          key="edit"
          onClick={() => setVisibleDrawer(true)}
        />
      </Tooltip>
    );
  }

  if (userAccesses["DeleteEvent"]) {
    eventIcons.push(
      <Tooltip placement="bottom" title="Видалити" key="delete">
        <DeleteTwoTone
          twoToneColor="#8B0000"
          onClick={() =>
            showDeleteConfirmForSingleEvent({
              eventId: event?.eventId,
              eventName: event?.eventName,
              eventTypeId: event?.eventTypeId,
              eventCategoryId: event?.eventCategoryId,
              eventAdmins: event.eventAdmins,
            })
          }
          className="icon"
          key="delete"
        />
      </Tooltip>
    );
  }

  eventIcons.push(
    <Tooltip placement="bottom" title="Адміністратори події" key="admins">
      <IdcardOutlined
        style={{ color: "#3c5438", fontSize: "30px" }}
        className="icon"
        onClick={() => setAdminsVisibility(true)}
      />
    </Tooltip>
  );

  return eventIcons;
};

const GetReviewString = (amount: number) => {
  let numberInText = String(amount);
  let lastDigit = numberInText.charAt(numberInText.length - 1);

  let single = ["1"];
  let pair = ["2", "3", "4"];

  if (single.includes(lastDigit) && amount != 11) return `${amount} відгук`;
  else if (pair.includes(lastDigit) && (amount < 10 || amount > 20))
    return `${amount} відгуки`;
  else return `${amount} відгуків`;
};

const RenderAdminCards = (
  eventAdmins: EventAdmin[],
  visibleDrawer: any,
  canViewAdminProfiles: boolean
) => {
  const history = useHistory();
  return (
    <List
      className="event-admin-card"
      grid={{
        gutter: 16,
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 2,
      }}
      dataSource={eventAdmins}
      renderItem={(item) => GetAdminInfo(item, canViewAdminProfiles)}
    />
  );
};

const GetAdminInfo = (admin: EventAdmin, canViewAdminProfiles: boolean) => {
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState<string>("default_user_image.png");
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    userApi.getImage(admin.avatarUrl).then((response) => {
      setImageUrl(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <List.Item>
      <Card
        hoverable={canViewAdminProfiles}
        title={admin.adminType}
        cover={<img alt="avatar" src={isLoading ? EventAdminLogo : imageUrl} />}
        onClick={() =>
          canViewAdminProfiles
            ? history.push(`/userpage/main/${admin.userId}`)
            : null
        }
        className={canViewAdminProfiles ? "" : "hovering-cardbody"}
      >
        <div>{admin.fullName}</div>
      </Card>
    </List.Item>
  );
};

const SortedEventInfo = ({
  userAccesses,
  event,
  eventStatusId,
  canViewAdminProfiles,
  setApprovedEvent,
  subscribeOnEvent,
  unSubscribeOnEvent,
  visibleDrawer,
  setVisibleDrawer,
  setRender,
}: Props) => {
  const [adminsVisible, setAdminsVisibility] = useState(false);
  const { id } = useParams();
  const { userId } = useParams();
  const [createdEvents, setCreatedEvents] = useState<CreatedEvents[]>([
    new CreatedEvents(),
  ]);
  const [allEvents, setAllEvents] = useState<EventsUser>(new EventsUser());
  const [imageBase64, setImageBase64] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(
    false
  );

  const fetchData = async () => {
    await eventUserApi.getEventsUser(userId).then(async (response) => {
      setCreatedEvents(response.data);
      setAllEvents(response.data);
      await userApi
        .getImage(response.data.user.imagePath)
        .then((response: { data: any }) => {
          setImageBase64(response.data);
        });

      setLoading(true);
    });
  };

  return (
    <Row>
      <Col className="eventActions">
        <div className="iconsFlex">
          {RenderEventIcons(
            userAccesses,
            event,
            setApprovedEvent,
            setVisibleDrawer,
            subscribeOnEvent,
            unSubscribeOnEvent,
            setAdminsVisibility
          )}
        </div>
        <div className="rateFlex">
          <Rate allowHalf disabled defaultValue={event.event.rating} />
          <div
            className={"feedbackInfo"}
            onClick={() => {
              setFeedbackModalVisible(true);
            }}
          >
            ({GetReviewString(event.event.eventFeedbacks.length)})
          </div>
        </div>

        <EventFeedbackModal
          eventId={event.event.eventId}
          feedbacks={event.event.eventFeedbacks}
          visible={isFeedbackModalVisible}
          setVisible={setFeedbackModalVisible}
          canLeaveFeedback={event.canEstimate}
          setRender={setRender}
        />
      </Col>
      <Modal
        visible={adminsVisible}
        title="Адміністратори події"
        footer={null}
        onCancel={() => {
          setAdminsVisibility(false);
        }}
      >
        {RenderAdminCards(
          event.event.eventAdmins,
          visibleDrawer,
          canViewAdminProfiles
        )}
      </Modal>
      <EventEditDrawer
        id={id}
        statusId={eventStatusId}
        visibleEventEditDrawer={visibleDrawer}
        setShowEventEditDrawer={setVisibleDrawer}
        onEdit={fetchData}
      />
    </Row>
  );
};

export default SortedEventInfo;
