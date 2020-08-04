<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";
=======
import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";
import spinClasses from "./ActionEvent/EventUser/EventUser.module.css";
import {Space, Spin} from "antd";
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

const classes = require('./Actions.module.css');

const Actions = () => {

<<<<<<< HEAD
=======
    const [loading, setLoading] = useState(false);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    const [actions, setActions] = useState([]);
    const {typeId} = useParams();

    useEffect(() => {
        const getCategories = async () => {
            const response = await eventsApi.getCategories(typeId);
<<<<<<< HEAD
            setActions(response.data)
        };
        getCategories();
    },[]);
=======
            setActions(response.data);
            setLoading(true);
        };
        getCategories();
    }, []);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

    const renderActions = (arr: any) => {
        if (arr) {
            const cutArr = arr.slice(0, 48);
            return cutArr.map((item: any) => (
<<<<<<< HEAD
                <ActionCard item={item} eventTypeId={typeId} key={item.eventCategoryId} />
            ));
        } return null;
=======
                <ActionCard item={item} eventTypeId={typeId} key={item.eventCategoryId}/>
            ));
        }
        return null;
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    };

    const plastActions = renderActions(actions);

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
            <h1 className={classes.mainTitle}>Категорії</h1>
            <div className={classes.actionsWrapper}>{plastActions}</div>
        </div>
    )
}
export default Actions;
