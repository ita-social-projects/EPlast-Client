import React, {useState, useEffect} from 'react';

// eslint-disable-next-line import/no-cycle
import EventCard from './EventCard/EventCard';
import eventsApi from "../../../api/eventsApi";

const classes = require('./ActionEvent.module.css');

interface Props {
    eventCategoryId: number;
    typeId: number;
}

export interface CardProps {
    eventId: number;
    eventName: string;
    isUserEventAdmin: boolean;
    isUserParticipant: boolean;
    isUserApprovedParticipant: boolean;
    isUserUndeterminedParticipant: boolean;
    isUserRejectedParticipant: boolean;
    isEventApproved: boolean;
    isEventFinished: boolean;
    isEventNotApproved: boolean;
}

const SortedEvents = ({eventCategoryId, typeId}: Props) => {

    const [actions, setActions] = useState<CardProps[]>([]);

    /* const updateActions = async (callback:Function) => {
         const actionsArray = await http.get('comments');
         setActions(actionsArray.data);
         callback(actionsArray);
     };

     const filterActions = (arr: any) => {
         if (eventCategoryId && arr) {
            setActions(arr.data.filter((item: any) => item.postId === 1));
         }
     } */

    /* useEffect(() => {
         updateActions(filterActions);
     }, [eventCategoryId]); */

    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getEvents(typeId, eventCategoryId);
            console.log(response);
            setActions(response.data)
        };
        fetchData();
    }, []);

    const removeEventCard = (id: number) => {
        setActions(actions.filter(action => action.eventId !== id))
    }

    const subscribeOnEvent = (id: number) => {
        setActions(actions.map(action => {
            if (action.eventId === id) {
                // eslint-disable-next-line no-param-reassign
                action.isUserParticipant = true;
                // eslint-disable-next-line no-param-reassign
                action.isUserUndeterminedParticipant = true;
            }
            return action;
        }))
    }
    const unsubscribeOnEvent = (id: number) => {
        setActions(actions.map(action => {
            if (action.eventId === id) {
                // eslint-disable-next-line no-param-reassign
                action.isUserParticipant = false;
                if (action.isUserUndeterminedParticipant) {
                    // eslint-disable-next-line no-param-reassign
                    action.isUserUndeterminedParticipant = false
                } else {
                    // eslint-disable-next-line no-param-reassign
                    action.isUserApprovedParticipant = false
                }
            }
            return action;
        }))
    }

    const renderAction = (arr: CardProps[]) => {
        if (arr) {
            // eslint-disable-next-line react/no-array-index-key
            return arr.map((item: CardProps) =>
                <EventCard
                    item={item}
                    removeEvent={removeEventCard}
                    subscribeOnEvent={subscribeOnEvent}
                    unsubscribeOnEvent={unsubscribeOnEvent}
                    key={item.eventId}/>);
        }
        return null;
    };

    const actionCard = renderAction(actions);

    return (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>{eventCategoryId}</h1>
            <div className={classes.actionsWrapper}>{actionCard}</div>
        </div>
    )
}
export default SortedEvents;