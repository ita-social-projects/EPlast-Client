import React from 'react';
import { Card } from 'antd';

import { useHistory } from "react-router-dom";


const classes = require('./EventTypeCard.module.css');

interface CardProps {
    id:number
    eventTypeName: string
}

interface Props {
    item: CardProps;
}

const EventTypeCard = ({
                        item: {  id , eventTypeName}
                    }:Props) => {

    const { Meta } = Card;
    const history = useHistory();

    return (
        <div>
            <Card
                key={id}
                hoverable
                className={classes.cardStyles}
                cover={<img alt="example" src="https://eplast.azurewebsites.net/images/Events/ActionLogo.png" />}
                onClick={()=> history.push(`/events/${id}/categories`)}
            >
                <Meta title={eventTypeName} className={classes.titleText}/>
            </Card>
        </div>
    )
}
export default EventTypeCard;



