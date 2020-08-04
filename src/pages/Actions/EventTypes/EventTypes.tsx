<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";
=======
import React, {useState, useEffect} from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";
import {Space, Spin} from "antd";
import spinClasses from '../ActionEvent/EventUser/EventUser.module.css';
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

const classes = require('./EventTypes.module.css');

const EventTypes = () => {

    const [types, setTypes] = useState([]);
<<<<<<< HEAD

=======
    const [loading, setLoading] = useState(false);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

    useEffect(() => {
        const getEventTypes = async () => {
            const response = await eventsApi.getTypes();
<<<<<<< HEAD
//            console.log(response);
            setTypes(response.data)
        };
        getEventTypes();
    },[]);
=======
            setTypes(response.data);
            setLoading(true);
        };
        getEventTypes();
    }, []);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544


    const renderTypes = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
<<<<<<< HEAD
                <EventTypeCard item={item} key={item.id} />
            ));
        } return null;
=======
                <EventTypeCard item={item} key={item.id}/>
            ));
        }
        return null;
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    };

    const plastTypes = renderTypes(types);

<<<<<<< HEAD
    return (
=======
    return loading === false ? (
        <div className={spinClasses.spaceWrapper}>
            <Space className={spinClasses.loader} size="large">
                <Spin size="large"/>
            </Space>
        </div>

    ) : (
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
        <div className={classes.background}>
            <h5 className={classes.mainTitle}>Типи подій</h5>
            <div className={classes.actionsWrapper}>{plastTypes}</div>
        </div>
    )
}
export default EventTypes;
