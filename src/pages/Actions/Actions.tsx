import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";
import spinClasses from "./ActionEvent/EventUser/EventUser.module.css";
import {Space, Spin} from "antd";

const classes = require('./Actions.module.css');

const Actions = () => {

    const [loading, setLoading] = useState(false);
    const [actions, setActions] = useState([]);
    const {typeId} = useParams();

    useEffect(() => {
        const getCategories = async () => {
            const response = await eventsApi.getCategories(typeId);
            setActions(response.data);
            setLoading(true);
        };
        getCategories();
    }, []);

    const renderActions = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
                <ActionCard item={item} eventTypeId={typeId} key={item.eventCategoryId}/>
            ));
        }
        return null;
    };

    const plastActions = renderActions(actions);

    return loading === false ? (
        <div className={spinClasses.spaceWrapper}>
            <Space className={spinClasses.loader} size="large">
                <Spin size="large"/>
            </Space>
        </div>

    ) : (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>Категорії</h1>
            <div className={classes.actionsWrapper}>{plastActions}</div>
        </div>
    )
}
export default Actions;
