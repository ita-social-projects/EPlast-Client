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
import {showDeleteConfirm, showSubscribeConfirm, showUnsubscribeConfirm} from "../../EventsModals";


const classes = require('./EventInfo.module.css');

interface Props {
    event: EventDetails;
}

const RenderEventIcons = ({
                               event,
                               isUserEventAdmin, isUserParticipant, isUserApprovedParticipant,
                               isUserUndeterminedParticipant, isUserRejectedParticipant, isEventFinished
                           }: EventDetails): React.ReactNode[] => {
    const eventIcons: React.ReactNode[] = []
    if (isUserEventAdmin) {
        eventIcons.push(<Tooltip placement="bottom" title="Ви адмін!">
            <SettingTwoTone twoToneColor="#3c5438" className={classes.icon} key="setting"/>
        </Tooltip>)
        eventIcons.push(<Tooltip placement="bottom" title="Редагувати">
            <EditTwoTone twoToneColor="#3c5438" className={classes.icon} key="edit"/>
        </Tooltip>)
        eventIcons.push(<Tooltip placement="bottom" title="Видалити">
            <DeleteTwoTone onClick={() => showDeleteConfirm(event?.eventName)} twoToneColor="#8B0000"
                           className={classes.icon} key="delete"/>
        </Tooltip>)
    } else if (isUserParticipant && !isEventFinished) {
        if (isUserRejectedParticipant) {
            eventIcons.push(<Tooltip placement="bottom" title="Вашу заявку на участь у даній події відхилено">
                <StopOutlined style={{color: "#8B0000"}} className={classes.icon} key="banned"/>
            </Tooltip>)
        } else {
            if (isUserApprovedParticipant) {
                eventIcons.push(<Tooltip placement="bottom" title="Учасник">
                    <CheckCircleTwoTone twoToneColor="#73bd79" className={classes.icon} key="participant"/>
                </Tooltip>)
            }
            if (isUserUndeterminedParticipant) {
                eventIcons.push(<Tooltip placement="bottom" title="Ваша заявка розглядається">
                    <QuestionCircleTwoTone twoToneColor="#FF8C00" className={classes.icon} key="underReview"/>
                </Tooltip>)
            }
            eventIcons.push(<Tooltip placement="bottom" title="Відписатися від події">
                <UserDeleteOutlined onClick={() => showUnsubscribeConfirm(event?.eventName)} style={{color: "#8B0000"}}
                                    className={classes.icon} key="unsubscribe"/>
            </Tooltip>)
        }
    } else if (!isEventFinished) {
        eventIcons.push(<Tooltip placement="bottom" title="Зголоситись на подію">
            <UserAddOutlined onClick={() => showSubscribeConfirm(event?.eventName)} style={{color: "#3c5438"}}
                             className={classes.icon} key="unsubscribe"/>
        </Tooltip>)
    }
    eventIcons.push(<Tooltip placement="bottom" title="Учасники">
        <TeamOutlined style={{color: "#3c5438"}} className={classes.icon}/>
    </Tooltip>)
    eventIcons.push(<Tooltip placement="bottom" title="Галерея">
        <CameraOutlined style={{color: "#3c5438"}} className={classes.icon}/>
    </Tooltip>)
    eventIcons.push(<Tooltip placement="bottom" title="Адміністратор(-и) події">
        <IdcardOutlined style={{color: "#3c5438"}} className={classes.icon}/>
    </Tooltip>)
    return eventIcons
}

const SortedEventInfo = ({event}: Props) => {
    //   console.log("EventInfo:",event)
    const columns = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: event?.event?.eventName,
            dataIndex: 'desc',
            key: 'desc',
        }
    ];

    const data = [
        {
            key: '1',
            name: 'Тип:',
            desc: event?.event?.eventType,
        },
        {
            key: '2',
            name: 'Категорія:',
            desc: event?.event?.eventCategory,

        },
        {
            key: '3',
            name: 'Дата початку:',
            desc: event?.event?.eventDateStart,

        },
        {
            key: '4',
            name: 'Дата завершення:',
            desc: event?.event?.eventDateEnd,

        },
        {
            key: '5',
            name: 'Локація:',
            desc: event?.event?.eventLocation,

        },
        {
            key: '6',
            name: 'Призначений для:',
            desc: event?.event?.forWhom,

        },
        {
            key: '7',
            name: 'Форма проведення:',
            desc: event?.event?.formOfHolding,

        },
        {
            key: '8',
            name: 'Статус:',
            desc: event?.event?.eventStatus,

        },
        {
            key: '9',
            name: 'Опис:',
            desc: event?.event?.description,
        }
    ];

    return <div className={classes.background}>
        <div className={classes.actionsWrapper}>
            <Row>
                <Col span={10} push={14}>
                    <img
                        className={classes.imgEvent}
                        alt="example"
                        src="https://www.kindpng.com/picc/m/150-1504140_shaking-hands-png-download-transparent-background-hand-shake.png"
                    />
                    <div className={classes.iconsFlex}>
                        {RenderEventIcons(event)}
                    </div>
                </Col>
                <Col span={14} pull={10}>
                    <Table columns={columns} dataSource={data} pagination={false}/>
                </Col>
            </Row>
        </div>
    </div>
}
export default SortedEventInfo;