import { Card, Tooltip } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import userApi from "../../../../api/UserApi";
import EventLogo from "../../../../assets/images/handshake.png";

import {
  FlagTwoTone,
  NotificationTwoTone,
  SettingTwoTone,
  ToolTwoTone,
} from "@ant-design/icons";
// eslint-disable-next-line import/named

// eslint-disable-next-line import/no-cycle
import extendedTitleTooltip from "../../../../components/Tooltip";
import { Roles } from "../../../../models/Roles/Roles";
import { CardProps } from "../SortedEvents";

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
        <Tooltip title="Ви адмініструєте цю подію">
          <SettingTwoTone twoToneColor="#3c5438" key="setting" />
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
