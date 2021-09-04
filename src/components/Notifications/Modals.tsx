import { ExclamationCircleOutlined } from "@ant-design/icons";
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
