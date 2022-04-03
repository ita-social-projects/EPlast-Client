import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import distinctionApi from "../../../api/distinctionApi";

const { confirm } = Modal;

const remove = async (id: number) => {
  await distinctionApi.deleteUserDistinction(id);
};

const DeleteConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити відзначення цього користувача?",
    icon: <ExclamationCircleOutlined style={{ color: "#3c5438" }} />,
    okText: "Так",
    cancelText: "Ні",
    async onOk() {
      try {
        await remove(id);
      } finally {
        onDelete(id);
      }
    },
  });
};
export default DeleteConfirm;
