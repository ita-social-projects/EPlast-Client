import React from 'react';
import {Card, Tooltip} from 'antd';
import ActionLogo from '../../assets/images/ActionLogo.png'
import {useHistory} from "react-router-dom";
import classes from './ActionCard.module.css';

const categoryMaxLength = 21;
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
                <Meta
                    className={classes.titleText}
                    title={
                        (eventCategoryName.length > categoryMaxLength) ?
                            <Tooltip title={eventCategoryName}>
                                <span>{eventCategoryName}</span>
                            </Tooltip>
                        : eventCategoryName
                    } 
                />
            </Card>
        </div>
    )
}
export default ActionCard;



