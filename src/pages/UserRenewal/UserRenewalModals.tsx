import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
import UserRenewal from "./Types/UserRenewal";
import userRenewalsApi from "../../api/userRenewalsApi";

const showRenewalConfirm = (data: UserRenewal, onConfirm: VoidFunction) => {
  const editRenewalHandler = async () => {
    await userRenewalsApi.renewUser(data);
    onConfirm();
  };

  return Modal.confirm({
    title: "Ви бажаєте відновити статус користувача?",
    icon: <ExclamationCircleOutlined />,
    okText: "Так",
    cancelText: "Ні",
    maskClosable: false,
    onOk: editRenewalHandler,
  });
};

const showUserRenewalModal = () => {
  return Modal.confirm({
    title: (
      <div style={{ textAlign: "justify" }}>
        <h4>
          Доступ до вашого аккаунту обмежено, оскільки ви є колишнім членом
          пласту. Ви можете надіслати запит на відновлення статусу.
        </h4>
      </div>
    ),
    icon: <ExclamationCircleOutlined />,
    okText: "Надіслати запит",
    cancelText: "Скасувати",
    onOk() {
      window.open("/userRenewal", "_self");
    },
  });
};

const showUserFormerInfoModal = (text: string, location?: string) => {
  return Modal.info({
    title: (
      <div style={{ textAlign: "justify" }}>
        <h4>{text}</h4>
      </div>
    ),
    icon: <ExclamationCircleOutlined />,
    okText: "Ок",
    maskClosable: false,
    onOk() {
      if (location != undefined) window.open(`${location}`, "_self");
    },
  });
};

export { showUserRenewalModal, showUserFormerInfoModal, showRenewalConfirm };
