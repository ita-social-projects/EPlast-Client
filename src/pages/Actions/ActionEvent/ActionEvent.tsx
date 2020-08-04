<<<<<<< HEAD
import React from 'react';
import {useParams} from 'react-router-dom';
import SortedEvents from './SortedEvents';


const classes = require('./ActionEvent.module.css');

const ActionEvent = () => {
    const {typeId, categoryId} = useParams();
    return (
        <div className={classes.background}>
            <div className={classes.actionsWrapper}>
                <SortedEvents eventCategoryId={categoryId} typeId={typeId}/>
            </div>
        </div>
    )
}
=======
import React from 'react';
import {useParams} from 'react-router-dom';
import SortedEvents from './SortedEvents';


const classes = require('./ActionEvent.module.css');

const ActionEvent = () => {
    const {typeId, categoryId} = useParams();
    return (
        <div className={classes.background}>
            <div className={classes.actionsWrapper}>
                <SortedEvents eventCategoryId={categoryId} typeId={typeId}/>
            </div>
        </div>
    )
}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
export default ActionEvent;