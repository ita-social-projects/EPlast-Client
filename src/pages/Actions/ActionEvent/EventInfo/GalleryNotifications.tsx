import React from "react";
import {notification, Spin} from "antd";
import {LoadingOutlined} from '@ant-design/icons';


const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

export const updateNotification = () => {
    notification.success(
        {
            message: "Галерея події успішно оновлена!",
            placement: "topRight",
            duration: 7
        }
    );
};

export const failUpdatingNotification = () => {
    notification.error(
        {
            message: "На жаль не вдалося обновити галерею!",
            placement: "topRight",
            duration: 7
        }
    );
};

export const loadingNotification = () => {
    notification.success({
        message: 'Оновлення галереї події...',
        icon: <Spin indicator={antIcon}/>,
        duration: null
    });
};

export const emptyPhotoListNotification = () => {
    notification.warn({
        message: "Ви ще не вибрали жодної фотографії для завантаження!",
        placement: "topRight",
        duration: 7
    });
};

export const limitNotification = (message: string,
                                  description: string) => {
    notification.warn({
        message,
        description,
        duration: 7
    });
};