import React, { useEffect, useState } from "react";

// eslint-disable-next-line import/no-cycle
import eventsApi from "../../../api/eventsApi";
import { EventAdmin } from "../../../models/Events/EventAdmin";
import { EventParticipant } from "../../../models/Events/EventParticipant";
import Spinner from "../../Spinner/Spinner";
import EventCard from "./EventCard/EventCard";

const classes = require("./ActionEvent.module.css");

interface Props {
  eventCategoryId: number;
  typeId: number;
  switcher: boolean;
  setActionTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface CardProps {
  eventId: number;
  eventName: string;
  eventAdmins: EventAdmin[];
  eventParticipants: EventParticipant[];
  isUserEventAdmin: boolean;
  isUserParticipant: boolean;
  isUserApprovedParticipant: boolean;
  isUserUndeterminedParticipant: boolean;
  isUserRejectedParticipant: boolean;
  isEventApproved: boolean;
  isEventFinished: boolean;
  isEventNotApproved: boolean;
}

const SortedEvents = ({ eventCategoryId, typeId, switcher }: Props) => {
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState<CardProps[]>([]);
  const [actionsToDisplay, setActionsToDisplay] = useState<CardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventsApi.getEvents(typeId, eventCategoryId);
      setActions(response.data);
      setActionsToDisplay(
        switcher
          ? response.data.filter((a: CardProps) => !a.isEventFinished)
          : response.data
      );
      setLoading(true);
    };

    if (actions.length === 0) {
      fetchData();
    } else {
      setActionsToDisplay(
        switcher
          ? actions.filter((a: CardProps) => !a.isEventFinished)
          : actions
      );
    }
  }, [switcher]);

  const removeEventCard = (id: number) => {
    setActions(actions.filter((action) => action.eventId !== id));
    setActionsToDisplay(
      actionsToDisplay.filter((action) => action.eventId !== id)
    );
  };

  const subscribeOnEvent = (id: number) => {
    setActions(
      actions.map((action) => {
        if (action.eventId === id) {
          // eslint-disable-next-line no-param-reassign
          action.isUserParticipant = true;
          // eslint-disable-next-line no-param-reassign
          action.isUserUndeterminedParticipant = true;
        }
        return action;
      })
    );
  };
  const unsubscribeOnEvent = (id: number) => {
    setActions(
      actions.map((action) => {
        if (action.eventId === id) {
          // eslint-disable-next-line no-param-reassign
          action.isUserParticipant = false;
          if (action.isUserUndeterminedParticipant) {
            // eslint-disable-next-line no-param-reassign
            action.isUserUndeterminedParticipant = false;
          } else {
            // eslint-disable-next-line no-param-reassign
            action.isUserApprovedParticipant = false;
          }
        }
        return action;
      })
    );
  };

  const renderAction = (arr: CardProps[]) => {
    if (arr) {
      // eslint-disable-next-line react/no-array-index-key
      return arr.map((item: CardProps) => (
        <EventCard
          item={item}
          removeEvent={removeEventCard}
          subscribeOnEvent={subscribeOnEvent}
          unsubscribeOnEvent={unsubscribeOnEvent}
          key={item.eventId}
        />
      ));
    }
    return null;
  };

  const actionCard = renderAction(actionsToDisplay);

  return loading === false ? (
    <Spinner />
  ) : (
    <div className={classes.background}>
      <div className={classes.actionsWrapper}>{actionCard}</div>
    </div>
  );
};
export default SortedEvents;
