import { ExclamationCircleOutlined } from "@ant-design/icons";
import notificationLogic from "../../components/Notifications/Notification";
import { Modal } from "antd";
import React from "react";

export const showRegionNameExistsModal = () => {
    return Modal.error({
      title: "Округа з такою назвою вже існує! Будь ласка, вкажіть іншу назву.",
      icon: <ExclamationCircleOutlined />,
      okText: "Ок",
      maskClosable: true,
    });
};

export const showUserIsFormerMemberModal = () => {
  return Modal.confirm({
    title: `Даному аккаунту надано статус "Колишній член" в зв'язку з чим доступ до нього обмежено. 
            Для відновлення аккаунту будь ласка надішліть запит адміністратору.`,
    icon: <ExclamationCircleOutlined/>,
    okText: "Надіслати запит",
    cancelText: "Скасувати",
    maskClosable: true,
    onOk() {
      notificationLogic("info", "Треба реалізувати даний функціонал");
    }
  });
};