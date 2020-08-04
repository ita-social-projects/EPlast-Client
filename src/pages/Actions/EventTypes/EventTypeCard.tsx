import React from 'react';
import { Card } from 'antd';
<<<<<<< HEAD
=======
import EvenTypeLogo from '../../../assets/images/ActionLogo.png'
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

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
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                onClick={()=> history.push(`/events/${id}/categories`)}
            >
                <Meta title={eventTypeName} className={classes.titleText}/>
            </Card>
        </div>
    )
}
export default EventTypeCard;



