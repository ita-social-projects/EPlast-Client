import { Switch } from "antd";
import React, { useState } from "react";
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import { useEffect } from "react";
import SortedClubs from "./SortedClubs";
import { useHistory } from "react-router-dom";

const classes = require("./ActionClubs.module.css");

const ActionClubs = () => {
  const history = useHistory();
  const [SwitchValue, setSwitchValue] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const checkAccessToManage = () => {
    let roles = UserApi.getActiveUserRoles();
    setIsAdmin(roles.includes(Roles.Admin));
  };

  const onChange = () => {
    setSwitchValue(!SwitchValue);
    history.push("/clubs/page/1");
  };

  useEffect(() => {
    checkAccessToManage();
  }, []);

  return (
    <div>
      {isAdmin ? (
        <p className={classes.swapper}>
          {" "}
          Показати неактивні курені: <Switch onChange={onChange} />
        </p>
      ) : null}
      <div className={classes.actionsWrapper}>
        <SortedClubs switcher={SwitchValue} />
      </div>
    </div>
  );
};
export default ActionClubs;
