import React from 'react';
import { Card } from 'antd';

import { useHistory } from "react-router-dom";


const classes = require('./ActionCard.module.css');

interface CardProps {
    eventCategoryName: string;
    imgUrl?: string;
    userId?: string;
    eventCategoryId: number;
}

interface Props {
    item: CardProps;
}

const ActionCard = ({
    item: {  eventCategoryId , eventCategoryName}
}:Props) => {

    const { Meta } = Card;
    const history = useHistory();
    
    return (
        <div>
            <Card
                key={eventCategoryId}
                hoverable
                className={classes.cardStyles}
                cover={<img alt="example" src="https://eplast.azurewebsites.net/images/Events/ActionLogo.png" />}
                onClick={()=> history.push(`/actions/events/${id}`)}
            >
                <Meta title={eventCategoryName} className={classes.titleText}/>
            </Card>
        </div>
    )
}
export default ActionCard;



