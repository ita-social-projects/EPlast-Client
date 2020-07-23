import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";

const classes = require('./Actions.module.css');

const Actions = () => {

    const [actions, setActions] = useState([]);
    const {typeId} = useParams();

    useEffect(() => {
        const getCategories = async () => {
            const response = await eventsApi.getCategories(typeId);
            setActions(response.data)
        };
        getCategories();
    },[]);

    const renderActions = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
                <ActionCard item={item} eventTypeId={typeId} key={item.eventCategoryId} />
            ));
        } return null;
    };

    const plastActions = renderActions(actions);

    return (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>Категорії</h1>
            <div className={classes.actionsWrapper}>{plastActions}</div>
        </div>
    )
}
export default Actions;
