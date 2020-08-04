import React from 'react';
import {Card} from 'antd';
import ActionLogo from '../../assets/images/ActionLogo.png'

import {useHistory} from "react-router-dom";


const classes = require('./ActionCard.module.css');

interface CardProps {
    eventCategoryId: number
    eventCategoryName: string
}

interface Props {
    item: CardProps
    eventTypeId: number
}

const ActionCard = ({
                        item: {eventCategoryId, eventCategoryName},
                        eventTypeId
                    }: Props) => {

    const {Meta} = Card;
    const history = useHistory();

    return (
        <div>
            <Card
                key={eventCategoryId}
                hoverable
                className={classes.cardStyles}
                cover={<img alt="example" src={ActionLogo}/>}
                onClick={() => history.push(`/types/${eventTypeId}/categories/${eventCategoryId}/events`)}
            >
                <Meta title={eventCategoryName} className={classes.titleText}/>
            </Card>
        </div>
    )
}
export default ActionCard;



