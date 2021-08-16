import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteAnnouncement } from "../../../api/governingBodiesApi";

const { confirm } = Modal;

const DeleteConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити оголошення?",
    icon: <ExclamationCircleOutlined style={{ color: "#3c5438" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        deleteAnnouncement(id);
      };
      remove();
      onDelete(id);
    },
  });
};
export default DeleteConfirm;
