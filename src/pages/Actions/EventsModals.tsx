import React, { useEffect } from 'react';
import {Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import eventsApi from "../../api/eventsApi";
import eventUserApi from "../../api/eventUserApi";
import {useHistory} from "react-router-dom";
import{successfulDeleteAction, tryAgain} from "../../components/Notifications/Messages"

const {confirm} = Modal;

type ParameterizedCallback = (id: number) => void
type UnParameterizedCallback = () => void
type EventsStateCallback = ParameterizedCallback | UnParameterizedCallback

interface EventData {
    eventId: number;
    eventName: string;
    successCallback: EventsStateCallback;
    isSingleEventInState: boolean;
}

interface EventDataForDeleting {
    eventId: number;
    eventName: string;
    eventTypeId: number;
    eventCategoryId: number;
}

interface EventDataForApproving {
    eventId: number;
    eventName: string;
    eventStatusId: string;
    setState:(visible:boolean)=>void;
}

// eslint-disable-next-line import/prefer-default-export
export const Success = (message: string) => {
    Modal.success({
        title: 'Вітаємо!',
        content: message
    });
}

export const showError = () => {
    Modal.error({
        title: 'Упсс...',
        content: tryAgain
    });
}

export const showSubscribeConfirm = ({eventId, eventName, successCallback, isSingleEventInState}: EventData) => {
    confirm({
        title: 'Ви впевнені, що хочете зголоситися на дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, зголоситися',
        cancelText: 'Скасувати',
        onOk() {
            const createParticipant = async () => {
                await eventsApi.createParticipant(eventId);
            };
            createParticipant()
                .then(() => {
                    Success('Ви успішно надіслали заявку на участь у події.')
                    if (isSingleEventInState) {
                        // @ts-ignore
                        successCallback()
                    } else {
                        successCallback(eventId)
                    }
                })
                .catch(() => {
                    showError();
                });
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

export const showUnsubscribeConfirm = ({eventId, eventName, successCallback, isSingleEventInState}: EventData) => {
    confirm({
        title: 'Ви впевнені, що хочете відписатися від події?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, відписатися',
        cancelText: 'Скасувати',
        onOk() {
            const deleteParticipant = async () => {
                await eventsApi.removeParticipant(eventId);
            };
            deleteParticipant()
                .then(() => {
                    Success('Ви успішно відписалися від події.')
                    if (isSingleEventInState) {
                        // @ts-ignore
                        successCallback()
                    } else {
                        successCallback(eventId)
                    }
                })
                .catch(() => {
                    showError();
                });
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

export const showDeleteConfirm = ({eventId, eventName, successCallback, isSingleEventInState}: EventData) => {
    confirm({
        title: 'Ви впевнені, що хочете видалити дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, видалити',
        okType: 'danger',
        cancelText: 'Скасувати',
        onOk() {
            const deleteEvent = async () => {
                await eventsApi.remove(eventId);
            };
            deleteEvent()
                .then(() => {
                    Success(successfulDeleteAction("Подію"))
                    if (isSingleEventInState) {
                        // @ts-ignore
                        successCallback()
                    } else {
                        successCallback(eventId)
                    }
                })
                .catch(() => {
                    showError();
                });
        },
        onCancel() {
            console.log('Cancel Delete');
        },
    });
}

export const showDeleteConfirmForSingleEvent = ({eventId, eventName, eventTypeId, eventCategoryId}: EventDataForDeleting) => {
    confirm({
        title: 'Ви впевнені, що хочете видалити дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, видалити',
        okType: 'danger',
        cancelText: 'Скасувати',
        onOk() {
            const deleteEvent = async () => {
                await eventsApi.remove(eventId);
            };
            deleteEvent()
                .then(() => {
                    window.location.replace(`/types/${eventTypeId}/categories/${eventCategoryId}/events`)
                })
                .catch(() => {
                    showError();
                });
        },
        onCancel() {
            console.log('Cancel Delete');
        },
    });
}

export const showApproveConfirm = ({eventId, eventName, eventStatusId,setState}: EventDataForApproving) => {
    confirm({
        title: 'Ви впевнені, що хочете затвердити дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, затвердити',
        cancelText: 'Скасувати',
        onOk() {
            const approveEvent = async () => {
             await eventUserApi.getEventToApprove(eventId);
             setState(true);
            };
            approveEvent()
                .then(() => {
                    Success('Ви успішно затвердили дану подію.')
                    if (eventStatusId==="Затверджений(-на)") {
                        // @ts-ignore
                        successCallback()
                    } 
                })
                .catch(() => {
                    showError();
                });
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}
