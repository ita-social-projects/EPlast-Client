import { Switch } from 'antd';
import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import SortedEvents from './SortedEvents';


const classes = require('./ActionEvent.module.css');

const ActionEvent = () => {


    const [SwitchValue, setSwitchValue]= useState<boolean>(false);
    const {typeId, categoryId} = useParams();


    const onChange = () => {
        
            setSwitchValue(!SwitchValue);
      }

    return (
        
        <div className={classes.background}>
            <p className={classes.swapper}>Показати лише дійсні події : <Switch onChange={onChange}/></p>  
            <div className={classes.actionsWrapper}>
                <SortedEvents eventCategoryId={categoryId} typeId={typeId} switcher={SwitchValue} />
            </div>
        </div>
    )
}
export default ActionEvent;