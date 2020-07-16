import React from 'react';
import {Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;

// eslint-disable-next-line import/prefer-default-export
export const showSubscribeConfirm = (eventName: string) => {
    confirm({
        title: 'Ви впевнені, що хочете зголоситися на дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, зголоситися',
        cancelText: 'Скасувати',
        onOk() {
            console.log('OK');
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

export const showUnsubscribeConfirm = (eventName: string) => {
    confirm({
        title: 'Ви впевнені, що хочете відписатися від події?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, відписатися',
        cancelText: 'Скасувати',
        onOk() {
            console.log('OK');
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

export const showDeleteConfirm = (eventName: string) => {
    confirm({
        title: 'Ви впевнені, що хочете видалити дану подію?',
        icon: <ExclamationCircleOutlined/>,
        content: `Подія: ${eventName}`,
        okText: 'Так, видалити',
        okType: 'danger',
        cancelText: 'Скасувати',
        onOk() {
            console.log('OK');
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

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