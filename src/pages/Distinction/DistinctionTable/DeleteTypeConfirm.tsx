import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import distinctionApi from "../../../api/distinctionApi";

const { confirm } = Modal;

const DeleteTypeConfirm = (id: number, onDelete: any, deleteUsersWithDist: any) => {
  return confirm({
    title: "Ви справді хочете видалити цей тип відзначення? Це спричинить видалення всіх створених відзначень із цим типом.",
    icon: <ExclamationCircleOutlined style={{ color: "#FF0000" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        await distinctionApi.deleteDistinction(id);
        deleteUsersWithDist();
      };
      remove();
      onDelete(id);
    },
  });
};
export default DeleteTypeConfirm;
