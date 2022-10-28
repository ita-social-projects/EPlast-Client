import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eventsApi from "../../../api/eventsApi";
import SortedEvents from "./SortedEvents";

const classes = require("./ActionEvent.module.css");

const ActionEvent = () => {
  const [SwitchValue, setSwitchValue] = useState<boolean>(false);
  const { typeId, categoryId } = useParams();
  const [title, setTitle] = useState<string>("");

  const fetchData = async () => {
    let category = await eventsApi.getCategoryById(categoryId);
    setTitle(category.data.eventCategoryName);
  };

  const onChange = () => {
    setSwitchValue(!SwitchValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.background}>
      <h1 className={classes.mainTitle}>{title}</h1>
      <p className={classes.swapper}>
        {" "}
        Показати лише дійсні події : <Switch onChange={onChange} />
      </p>
      <div className={classes.actionsWrapper}>
        <SortedEvents
          eventCategoryId={categoryId}
          typeId={typeId}
          switcher={SwitchValue}
          setActionTitle={setTitle}
        />
      </div>
    </div>
  );
};
export default ActionEvent;
