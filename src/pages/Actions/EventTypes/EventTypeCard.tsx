import React from 'react';
import { Card } from 'antd';
<<<<<<< HEAD
=======
import EvenTypeLogo from '../../../assets/images/ActionLogo.png'
>>>>>>> origin

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
<<<<<<< HEAD
                cover={<img alt="example" src="https://eplast.azurewebsites.net/images/Events/ActionLogo.png" />}
=======
                cover={<img alt="example" src={EvenTypeLogo}/>}
>>>>>>> origin
                onClick={()=> history.push(`/events/${id}/categories`)}
            >
                <Meta title={eventTypeName} className={classes.titleText}/>
            </Card>
        </div>
    )
}
export default EventTypeCard;



