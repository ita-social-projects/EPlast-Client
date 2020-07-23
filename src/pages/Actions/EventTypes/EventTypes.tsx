import React, { useState, useEffect } from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";

const classes = require('./EventTypes.module.css');

const EventTypes = () => {

    const [types, setTypes] = useState([]);


    useEffect(() => {
        const getEventTypes = async () => {
            const response = await eventsApi.getTypes();
//            console.log(response);
            setTypes(response.data)
        };
        getEventTypes();
    },[]);


    const renderTypes = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
                <EventTypeCard item={item} key={item.id} />
            ));
        } return null;
    };

    const plastTypes = renderTypes(types);

    return (
        <div className={classes.background}>
            <h5 className={classes.mainTitle}>Типи подій</h5>
            <div className={classes.actionsWrapper}>{plastTypes}</div>
        </div>
    )
}
export default EventTypes;
