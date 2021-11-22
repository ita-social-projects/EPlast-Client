import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import aboutBase from "../../api/aboutBase";

const { confirm } = Modal;

const DeleteSectConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити цей розділ? Це спричинить видалення всіх підрозділів, які у ньому знаходяться.",
    icon: <ExclamationCircleOutlined style={{ color: "#FF0000" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        await aboutBase.deleteAboutBaseSection(id);
      };
      remove();
      onDelete(id);
    },
  });
};
export default DeleteSectConfirm;
