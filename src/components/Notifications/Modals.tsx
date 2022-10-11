import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
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

export const showLogOutModal = () => {
  return Modal.warning({
    title: "Вам змінили права доступу! У вас є хвилина поки вас не виб'є",
    icon: <WarningOutlined />,
    okText: "Ок",
    maskClosable: false
  });
}