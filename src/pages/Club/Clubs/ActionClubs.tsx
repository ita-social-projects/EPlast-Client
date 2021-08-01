import { Switch } from 'antd';
import React, { useState } from 'react';
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import { useEffect } from 'react';
import SortedClubs from './SortedClubs';

const classes = require('./ActionClubs.module.css');

const ActionClubs = () => {

    const [activeUserRoles, setActiveUserRoles] = useState<string[]>();
    const [SwitchValue, setSwitchValue]= useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const checkAccessToManage = () => {
        let roles = UserApi.getActiveUserRoles();
        setIsAdmin(roles.includes(Roles.Admin));
    }

    const onChange = () => {
            setSwitchValue(!SwitchValue);
      }

    useEffect(()=>{
        checkAccessToManage();
    },[])
    
    return (
        <div>
            {isAdmin ? ( 
                <p className={classes.swapper}> Показати не активні курені: <Switch onChange={onChange}/></p> 
            ): null }
                <div className={classes.actionsWrapper}>
                    <SortedClubs switcher={SwitchValue} />
                </div>
        </div>
    )
}
export default ActionClubs;