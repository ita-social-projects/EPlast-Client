import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import precautionApi from "../../../api/precautionApi";

const { confirm } = Modal;

const remove = async (id: number) => {
  await precautionApi.deleteUserPrecaution(id);
};

const DeleteConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити пересторогу цього користувача?",
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
