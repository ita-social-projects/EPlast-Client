import React from 'react';
import {Row, Col, Table, Tooltip} from 'antd';
import {UserDeleteOutlined, TeamOutlined, UserSwitchOutlined, CameraOutlined, IdcardOutlined} from '@ant-design/icons';
// eslint-disable-next-line import/no-cycle,import/no-duplicates
import {EventDetails} from "./EventInfo";

const classes = require('./EventInfo.module.css');

interface Props {
    event: EventDetails;
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

    return (
        <div className={classes.background}>
            <div className={classes.actionsWrapper}>
                <Row>
                    <Col span={10} push={14}>
                        <img
                            className={classes.imgEvent}
                            alt="example"
                            src="https://www.kindpng.com/picc/m/150-1504140_shaking-hands-png-download-transparent-background-hand-shake.png"
                        />
                        <div className={classes.iconsFlex}>
                            <Tooltip placement="bottom" title="Ваша кандидатура розглядається">
                                <UserSwitchOutlined className={classes.icon}/>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Натисніть, щоб відписатись від події">
                                <UserDeleteOutlined className={classes.icon}/>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Учасники">
                                <TeamOutlined className={classes.icon}/>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Галерея">
                                <CameraOutlined className={classes.icon}/>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Адміністратор(-и) події">
                                <IdcardOutlined className={classes.icon}/>
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={14} pull={10}>
                        <Table columns={columns} dataSource={data} pagination={false}/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default SortedEventInfo;