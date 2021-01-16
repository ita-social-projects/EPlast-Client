import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import precautionApi from "../../../api/precautionApi";

const { confirm } = Modal;

const DeleteTypeConfirm = (id: number, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити цей тип перестороги?",
    icon: <ExclamationCircleOutlined style={{ color: "#3c5438" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        await precautionApi.deletePrecaution(id);
      };
      remove();
      onDelete(id);
    },
  });
};
export default DeleteTypeConfirm;
