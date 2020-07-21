import React from 'react';
import { useParams } from 'react-router-dom';
import SortedEvents from './SortedEvents';


const classes = require('./ActionEvent.module.css');

const ActionEvent = () => {
    const { categoryId } = useParams();
    return (
        <div className={classes.background}>
            <div className={classes.actionsWrapper}>
                <SortedEvents eventCategoryId={categoryId} typeId={1} />
            </div>
        </div>
    )
}
export default ActionEvent;