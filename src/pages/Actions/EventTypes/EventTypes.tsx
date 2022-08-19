import { Card } from "antd";
import jwt from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eventsApi from "../../../api/eventsApi";
import eventUserApi from "../../../api/eventUserApi";
import userApi from "../../../api/UserApi";
import Add from "../../../assets/images/add.png";
import AuthLocalStorage from "../../../AuthLocalStorage";
import Spinner from "../../Spinner/Spinner";
import EventCreateDrawer from "../ActionEvent/EventCreate/EventCreateDrawer";
import EventTypeCard from "./EventTypeCard";

const classes = require("./EventTypes.module.css");

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
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const getEventTypes = async () => {
      const response = await eventsApi.getTypes();
      setTypes(response.data);
      setLoading(true);
    };
    getEventTypes();
    getUserAccessesForEvents();
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

  const getUserAccessesForEvents = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await eventUserApi.getUserEventAccess(user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const plastTypes = renderTypes(types);
  const { Meta } = Card;

  return loading === false ? (
    <Spinner />
  ) : (
    <div className={classes.background}>
      <h1 className={classes.mainTitle}>Типи</h1>
      <div className={classes.actionsWrapper}>
        {userToken.nameid === userId && userAccesses["CreateEvent"] && (
          <Card
            hoverable
            className={classes.cardStyles}
            cover={
              <div className={classes.imageContainer}>
                <img src={Add} alt="AddEvent" className={classes.imageStyle} />
              </div>
            }
            onClick={() => setShowEventCreateDrawer(true)}
          >
            <Meta className={classes.titleText} title="Створити подію" />
          </Card>
        )}
        <EventCreateDrawer
          visibleEventCreateDrawer={showEventCreateDrawer}
          setShowEventCreateDrawer={setShowEventCreateDrawer}
        />
        {plastTypes}
      </div>
    </div>
  );
};
export default EventTypes;
