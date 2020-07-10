import React, { useState, useEffect } from 'react';

import EventCard from './EventCard/EventCard';
import eventsApi from "../../../api/eventsApi";

const classes = require('./ActionEvent.module.css');

interface Props {
    eventCategoryId?: string;
}

const SortedEvents = ({ eventCategoryId = "" }: Props) => {

    const [actions, setActions] = useState([]);

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
            const response = await eventsApi.getEvents();
            console.log(response);
            setActions(response.data)
        };
        fetchData();
    },[]);

    const renderAction = (arr: any) => {
        if (arr) {
            // eslint-disable-next-line react/no-array-index-key
            return arr.map((item: any,index:number) => <EventCard item={item} key={index+1} />);
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