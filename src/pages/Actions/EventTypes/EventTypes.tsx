import React, { useState, useEffect } from 'react';
import EventTypeCard from "./EventTypeCard";
import eventsApi from "../../../api/eventsApi";
import Spinner from '../../Spinner/Spinner';
import { Card } from 'antd';
import EventCreateDrawer from '../ActionEvent/EventCreate/EventCreateDrawer';
import { useParams } from 'react-router-dom';
import Add from "../../../assets/images/add.png";
import { Roles } from '../../../models/Roles/Roles';
import userApi from "../../../api/UserApi";

const classes = require('./EventTypes.module.css');

const EventTypes = () => {
    let roles = userApi.getActiveUserRoles();

    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEventCreateDrawer, setShowEventCreateDrawer] = useState(false);
    const [userToken, setUserToken] = useState<any>([
        {
            nameid: "",
        },
    ]);
    const { userId } = useParams();
    const [canCreate] = useState(roles.filter(r => r != Roles.Supporter && r != Roles.RegisteredUser).length != 0);

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
                <EventTypeCard item={item} key={item.id} />
            ));
        }
        return null;
    };

    const plastTypes = renderTypes(types);
    const { Meta } = Card;

    return loading === false ? (
        <Spinner />
    ) : (
        <div className={classes.background}>
            <h1 className={classes.mainTitle}>Типи</h1>
            <div className={classes.actionsWrapper}>
                {userToken.nameid === userId && canCreate && (
                    <Card
                        hoverable
                        className={classes.cardStyles}
                        cover={
                            <div className={classes.imageContainer}>
                                <img src={Add} alt="AddEvent" className={classes.imageStyle} />
                            </div>}
                        onClick={() => setShowEventCreateDrawer(true)}
                    >
                        <Meta
                            className={classes.titleText}
                            title="Створити подію"
                        />
                    </Card>
                )}
                <EventCreateDrawer
                    visibleEventCreateDrawer={showEventCreateDrawer}
                    setShowEventCreateDrawer={setShowEventCreateDrawer}
                />
                {plastTypes}
            </div>
        </div>
    )
}
export default EventTypes;
