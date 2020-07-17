import React from 'react';
import {Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import eventsApi from "../../api/eventsApi";

const {confirm} = Modal;

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
        content: 'Щось пішло не так. Спробуйте повторити дану дію пізніше або напишіть у техпідтримку.'
    });
}

export const showSubscribeConfirm = (eventId: number, eventName: string, successCallback: (id: number) => void) => {
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
                    successCallback(eventId)
                })
                .catch(() => {
                    showError();
                });        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

export const showUnsubscribeConfirm = (eventId: number, eventName: string, successCallback: (id: number) => void) => {
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
                    successCallback(eventId)
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

export const showDeleteConfirm = (eventId: number, eventName: string, successCallback: (id: number) => void) => {
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
                    Success('Подія успішно видалена.')
                    successCallback(eventId)
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

