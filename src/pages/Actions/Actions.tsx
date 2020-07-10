import React, { useState, useEffect } from 'react';
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";

const classes = require('./Actions.module.css');

const Actions = () => {

    const [actions, setActions] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getAll();
            console.log(response);
            setActions(response.data)
        };
        fetchData();
    },[]);


    // useEffect(() => {
    //     updateActions();
    // }, []);

    const renderActions = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
                <ActionCard item={item} key={item.id} />
            ));
        } return null;
    };

    const plastActions = renderActions(actions);

    return (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>Акції</h1>
            <div className={classes.actionsWrapper}>{plastActions}</div>
        </div>
    )
}
export default Actions;
