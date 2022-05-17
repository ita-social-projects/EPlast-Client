import { Switch } from "antd";
import React, { useState } from "react";

import SortedRegions from "./SortedRegions";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";
import { useEffect } from "react";

const classes = require("./ActionRegion.module.css");

const ActionRegion = () => {
  const [SwitchValue, setSwitchValue] = useState<boolean>(false);
  const [canArchive, setCanArchive] = useState<boolean>();
  const checkAccessToManage = () => {
    let roles = UserApi.getActiveUserRoles();
    setCanArchive(roles.includes(Roles.Admin) || roles.includes(Roles.GoverningBodyAdmin));
  };

  const onChange = () => {
    setSwitchValue(!SwitchValue);
  };

  useEffect(() => {
    checkAccessToManage();
  }, []);

  return (
    <div>
      {canArchive ? (
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
