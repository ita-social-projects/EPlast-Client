import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Tooltip } from "antd";
import EventLogo from "../../../../assets/images/handshake.png";
import userApi from "../../../../api/UserApi";

import {
  EditTwoTone,
  DeleteTwoTone,
  StopOutlined,
  SettingTwoTone,
  FlagTwoTone,
  NotificationTwoTone,
  ToolTwoTone,
  CheckCircleTwoTone,
  QuestionCircleTwoTone,
  UserDeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
// eslint-disable-next-line import/named
import {
  showSubscribeConfirm,
  showUnsubscribeConfirm,
  showDeleteConfirm,
} from "../../EventsModals";

// eslint-disable-next-line import/no-cycle
import { CardProps } from "../SortedEvents";
import { Roles } from "../../../../models/Roles/Roles";
import extendedTitleTooltip from "../../../../components/Tooltip";

const classes = require("./EventCard.module.css");
const eventNameMaxLength = 14;
interface Props {
  item: CardProps;
  removeEvent: (id: number) => void;
  subscribeOnEvent: (id: number) => void;
  unsubscribeOnEvent: (id: number) => void;
}

const EventCard = ({
  item: {
    eventName,
    eventId,
    isUserEventAdmin,
    isUserParticipant,
    isUserApprovedParticipant,
    isUserRejectedParticipant,
    isUserUndeterminedParticipant,
    isEventApproved,
    isEventFinished,
    isEventNotApproved,
    eventAdmins,
    eventParticipants,
  },
  removeEvent,
  subscribeOnEvent,
  unsubscribeOnEvent,
}: Props) => {
  const { Meta } = Card;
  const history = useHistory();
  const [canSubscribe] = useState(
    userApi
      .getActiveUserRoles()
      .filter((r) => r != Roles.Supporter && r != Roles.RegisteredUser)
      .length != 0
  );

  const RenderEventsIcons = (): React.ReactNode[] => {
    const eventIcons: React.ReactNode[] = [];
    if (isUserEventAdmin) {
      eventIcons.push(
        <Tooltip title="Ви адмін!">
          <SettingTwoTone twoToneColor="#3c5438" key="setting" />
        </Tooltip>
      );
      eventIcons.push(
        <Tooltip title="Редагувати">
          <EditTwoTone twoToneColor="#3c5438" key="edit" />
        </Tooltip>
      );
      eventIcons.push(
        <Tooltip title="Видалити">
          <DeleteTwoTone
            onClick={() =>
              showDeleteConfirm({
                eventId,
                eventName,
                successCallback: removeEvent,
                isSingleEventInState: false,
                eventAdmins,
                eventParticipants,
              })
            }
            twoToneColor="#8B0000"
            key="delete"
          />
        </Tooltip>
      );
    } else if (isUserParticipant && !isEventFinished) {
      if (isUserRejectedParticipant) {
        eventIcons.push(
          <Tooltip title="Вашу заявку на участь у даній події відхилено">
            <StopOutlined style={{ color: "#8B0000" }} key="banned" />
          </Tooltip>
        );
      } else {
        if (isUserApprovedParticipant) {
          eventIcons.push(
            <Tooltip title="Учасник">
              <CheckCircleTwoTone twoToneColor="#73bd79" key="participant" />
            </Tooltip>
          );
        }
        if (isUserUndeterminedParticipant) {
          eventIcons.push(
            <Tooltip title="Ваша заявка розглядається">
              <QuestionCircleTwoTone twoToneColor="#FF8C00" key="underReview" />
            </Tooltip>
          );
        }
        eventIcons.push(
          <Tooltip title="Відписатися від події">
            <UserDeleteOutlined
              onClick={() =>
                showUnsubscribeConfirm({
                  eventId,
                  eventName,
                  successCallback: unsubscribeOnEvent,
                  isSingleEventInState: false,
                  eventAdmins,
                  eventParticipants,
                })
              }
              style={{ color: "#8B0000" }}
              key="unsubscribe"
            />
          </Tooltip>
        );
      }
    } else if (!isEventFinished && canSubscribe) {
      eventIcons.push(
        <Tooltip title="Зголоситись на подію">
          <UserAddOutlined
            onClick={() =>
              showSubscribeConfirm({
                eventId,
                eventName,
                successCallback: subscribeOnEvent,
                isSingleEventInState: false,
                eventAdmins,
                eventParticipants,
              })
            }
            style={{ color: "#3c5438" }}
            key="unsubscribe"
          />
        </Tooltip>
      );
    }
    if (isEventFinished) {
      eventIcons.push(
        <Tooltip title="Завершено">
          <FlagTwoTone twoToneColor="#3c5438" key="finished" />
        </Tooltip>
      );
    }
    if (isEventApproved) {
      eventIcons.push(
        <Tooltip title="Затверджено">
          <NotificationTwoTone twoToneColor="#3c5438" key="approved" />
        </Tooltip>
      );
    }
    if (isEventNotApproved) {
      eventIcons.push(
        <Tooltip title="Не затверджено">
          <ToolTwoTone twoToneColor="#3c5438" key="notApproved" />
        </Tooltip>
      );
    }
    return eventIcons;
  };

  return (
    <div className={classes.background}>
      <div className={classes.actionsWrapper}>
        <Card
          hoverable
          className={classes.cardStyles}
          onClick={() => history.push(`/events/details/${eventId}`)}
          cover={
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
            <img alt="example" src={EventLogo} />
          }
          actions={RenderEventsIcons()}
        >
          <Meta title={extendedTitleTooltip(eventNameMaxLength, eventName)} />
        </Card>
      </div>
    </div>
  );
};
export default EventCard;
