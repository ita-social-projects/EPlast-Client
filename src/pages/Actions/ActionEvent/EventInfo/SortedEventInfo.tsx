import React from 'react';
import {Row, Col, Table, Tooltip} from 'antd';
import {
    TeamOutlined,
    CameraOutlined,
    IdcardOutlined,
    EditTwoTone,
    DeleteTwoTone,
    StopOutlined,
    SettingTwoTone,
    CheckCircleTwoTone,
    QuestionCircleTwoTone,
    UserDeleteOutlined,
    UserAddOutlined
} from '@ant-design/icons';
// eslint-disable-next-line import/no-cycle,import/no-duplicates
import {EventDetails} from "./EventInfo";
import {showSubscribeConfirm, showUnsubscribeConfirm, showDeleteConfirmForSingleEvent} from "../../EventsModals";

import './EventInfo.less';

interface Props {
    event: EventDetails,
    subscribeOnEvent: () => void
    unSubscribeOnEvent: () => void
}

const RenderEventIcons = ({
                              event,
                              isUserEventAdmin, isUserParticipant, isUserApprovedParticipant,
                              isUserUndeterminedParticipant, isUserRejectedParticipant, isEventFinished
                          }: EventDetails,
                          subscribeOnEvent: () => void,
                          unSubscribeOnEvent: () => void
): React.ReactNode[] => {
    const eventIcons: React.ReactNode[] = []
    if (isUserEventAdmin) {
        eventIcons.push(<Tooltip placement="bottom" title="Ви адмін!" key="setting">
            <SettingTwoTone twoToneColor="#3c5438" className="icon" key="setting"/>
        </Tooltip>)
        eventIcons.push(<Tooltip placement="bottom" title="Редагувати" key="edit">
            <EditTwoTone twoToneColor="#3c5438" className="icon" key="edit"/>
        </Tooltip>)
        eventIcons.push(<Tooltip placement="bottom" title="Видалити" key="delete">
            <DeleteTwoTone twoToneColor="#8B0000"
                           onClick={() => showDeleteConfirmForSingleEvent({
                               eventId: event?.eventId,
                               eventName: event?.eventName,
                               eventTypeId: event?.eventTypeId,
                               eventCategoryId: event?.eventCategoryId
                           })}
                           className="icon" key="delete"/>
        </Tooltip>)
    } else if (isUserParticipant && !isEventFinished) {
        if (isUserRejectedParticipant) {
            eventIcons.push(<Tooltip placement="bottom" title="Вашу заявку на участь у даній події відхилено"
                                     key="banned">
                <StopOutlined style={{color: "#8B0000"}} className="icon" key="banned"/>
            </Tooltip>)
        } else {
            if (isUserApprovedParticipant) {
                eventIcons.push(<Tooltip placement="bottom" title="Учасник" key="participant">
                    <CheckCircleTwoTone twoToneColor="#73bd79" className="icon" key="participant"/>
                </Tooltip>)
            }
            if (isUserUndeterminedParticipant) {
                eventIcons.push(<Tooltip placement="bottom" title="Ваша заявка розглядається" key="underReview">
                    <QuestionCircleTwoTone twoToneColor="#FF8C00" className="icon" key="underReview"/>
                </Tooltip>)
            }
            eventIcons.push(<Tooltip placement="bottom" title="Відписатися від події" key="unsubscribe">
                <UserDeleteOutlined
                    onClick={() => showUnsubscribeConfirm({
                        eventId: event?.eventId,
                        eventName: event?.eventName,
                        successCallback: unSubscribeOnEvent,
                        isSingleEventInState: true
                    })}
                    style={{color: "#8B0000"}}
                    className="icon" key="unsubscribe"/>
            </Tooltip>)
        }
    } else if (!isEventFinished) {
        eventIcons.push(<Tooltip title="Зголоситись на подію" key="subscribe">
            <UserAddOutlined onClick={() => showSubscribeConfirm({
                eventId: event?.eventId,
                eventName: event?.eventName,
                successCallback: subscribeOnEvent,
                isSingleEventInState: true
            })}
                             style={{color: "#3c5438"}}
                             key="subscribe"/>
        </Tooltip>)
    }
    eventIcons.push(<Tooltip placement="bottom" title="Учасники" key="participants">
        <TeamOutlined style={{color: "#3c5438"}} className="icon"/>
    </Tooltip>)
    eventIcons.push(<Tooltip placement="bottom" title="Галерея" key="gallery">
        <CameraOutlined style={{color: "#3c5438"}} className="icon"/>
    </Tooltip>)
    eventIcons.push(<Tooltip placement="bottom" title="Адміністратор(-и) події" key="admins">
        <IdcardOutlined style={{color: "#3c5438",fontSize: "30px"}} className="icon"/>
    </Tooltip>)
    return eventIcons
}

const SortedEventInfo = ({event, subscribeOnEvent, unSubscribeOnEvent}: Props) => {
    return <Row justify="center">
        <Col>
            <img
                className="imgEvent"
                alt="example"
                src="https://www.kindpng.com/picc/m/150-1504140_shaking-hands-png-download-transparent-background-hand-shake.png"
            />
            <div className="iconsFlex">
                {RenderEventIcons(event, subscribeOnEvent, unSubscribeOnEvent)}
            </div>
        </Col>
    </Row>
}
export default SortedEventInfo;