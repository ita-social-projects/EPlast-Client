import { Switch } from 'antd';
import React, { useState } from 'react';
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import { useEffect } from 'react';
import SortedCities from './SortedCities';


const classes = require('./ActionCities.module.css');

const ActionCities = () => {

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
            <p className={classes.swapper}> Показати не активні округи : <Switch onChange={onChange}/></p> 
            ): null }
            <div className={classes.actionsWrapper}>
            <SortedCities switcher={SwitchValue} />
            </div>
        </div>
    )
}
export default ActionCities;