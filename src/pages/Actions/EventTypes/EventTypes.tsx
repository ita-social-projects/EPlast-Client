import React, {useState, useEffect} from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";
import {Space, Spin} from "antd";
import spinClasses from '../ActionEvent/EventUser/EventUser.module.css';

const classes = require('./EventTypes.module.css');

const EventTypes = () => {

    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getEventTypes = async () => {
            const response = await eventsApi.getTypes();
            setTypes(response.data);
            setLoading(true);
        };
        getEventTypes();
    }, []);


    const renderTypes = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
                <EventTypeCard item={item} key={item.id}/>
            ));
        }
        return null;
    };

    const plastTypes = renderTypes(types);

    return loading === false ? (
        <div className={spinClasses.spaceWrapper}>
            <Space className={spinClasses.loader} size="large">
                <Spin size="large"/>
            </Space>
        </div>

    ) : (
        <div className={classes.background}>
            <h5 className={classes.mainTitle}>Типи подій</h5>
            <div className={classes.actionsWrapper}>{plastTypes}</div>
        </div>
    )
}
export default EventTypes;
