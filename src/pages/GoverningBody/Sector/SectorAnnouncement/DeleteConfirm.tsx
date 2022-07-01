import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteSectorAnnouncement } from "../../../../api/governingBodySectorsApi";
import notificationLogic from "../../../../components/Notifications/Notification";

const { confirm } = Modal;

const DeleteConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити оголошення?",
    icon: <ExclamationCircleOutlined style={{ color: "#3c5438" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        deleteSectorAnnouncement(id);
      };
      remove();
      onDelete(id);
      notificationLogic("success", "Оголошення видалено");
    },
  });
};
export default DeleteConfirm;
