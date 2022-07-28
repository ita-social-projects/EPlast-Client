import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import adminApi from "../../api/adminApi";
import notificationLogic from "../../components/Notifications/Notification";
import {
  failDeleteUser,
  successfulDeleteAction,
  tryAgain,
} from "../../components/Notifications/Messages";

const { confirm } = Modal;

const UserDeleteConfirm = (id: string, onDelete: any) => {
  return confirm({
    title: "Ви справді хочете видалити користувача?",
    icon: <ExclamationCircleOutlined style={{ color: "#3c5438" }} />,
    okText: "Так",
    cancelText: "Ні",
    onOk() {
      const remove = async () => {
        await adminApi
          .deleteUser(id)
          .then((response) => {
            notificationLogic("success", successfulDeleteAction("Користувача"));
            onDelete(id);
          })
          .catch((error) => {
            switch (error.response?.status)
            {
              case 400:
                notificationLogic("error", tryAgain);
                break;
              case 500:
                notificationLogic("error", failDeleteUser);
                break;
            }
          });
      };
      remove();
    },
  });
};
export default UserDeleteConfirm;
