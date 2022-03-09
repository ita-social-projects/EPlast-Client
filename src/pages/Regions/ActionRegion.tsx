import { Switch } from "antd";
import React, { useState } from "react";

import SortedRegions from "./SortedRegions";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";
import { useEffect } from "react";

const classes = require("./ActionRegion.module.css");

const ActionRegion = () => {
  const [SwitchValue, setSwitchValue] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const checkAccessToManage = () => {
    let roles = UserApi.getActiveUserRoles();
    setIsAdmin(roles.includes(Roles.Admin));
  };

  const onChange = () => {
    setSwitchValue(!SwitchValue);
  };

  useEffect(() => {
    checkAccessToManage();
  }, []);

  return (
    <div>
      {isAdmin ? (
        <p className={classes.swapper}>
          {" "}
          Показати неактивні округи: <Switch onChange={onChange} />
        </p>
      ) : null}
      <div className={classes.actionsWrapper}>
        <SortedRegions switcher={SwitchValue} />
      </div>
    </div>
  );
};

export default ActionRegion;
