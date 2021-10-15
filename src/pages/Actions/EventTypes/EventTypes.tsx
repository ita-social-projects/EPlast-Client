import React, {useState, useEffect} from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";
import Spinner from '../../Spinner/Spinner';

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
        <Spinner />
    ) : (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>Типи</h1>
            <div className={classes.actionsWrapper}>{plastTypes}</div>
        </div>
    )
}
export default EventTypes;
