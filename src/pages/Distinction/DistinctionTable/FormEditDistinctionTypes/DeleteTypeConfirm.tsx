import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

const { confirm } = Modal;

const DeleteTypeConfirm = (distinctionId: number, deleteDistinction: any) => {
  return confirm({
    title:
      "Ви справді хочете видалити цей тип відзначення? Це спричинить видалення всіх створених відзначень із цим типом.",
    icon: <ExclamationCircleOutlined style={{ color: "#FF0000" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      deleteDistinction(distinctionId);
    },
  });
};
export default DeleteTypeConfirm;
