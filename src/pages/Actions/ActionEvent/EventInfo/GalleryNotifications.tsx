import React from "react";
import {notification, Spin} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import{
    successfulUpdateAction, 
    failUpdateAction,
    isNotChosen
  } from "../../../../components/Notifications/Messages"

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

export const updateNotification = () => {
    notification.success(
        {
            message: successfulUpdateAction("Галерею події"),
            placement: "topRight",
            duration: 7
        }
    );
};

export const failUpdatingNotification = () => {
    notification.error(
        {
            message: failUpdateAction("галерею"),
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
        message: isNotChosen("Жодної фотографії"),
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