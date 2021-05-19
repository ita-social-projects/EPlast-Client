import React from "react";
import { Modal } from "antd";
import ChangeUserRoleForm from "./ChangeUserRoleForm";

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user:any;
}
const ChangeUserRoleModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user
}: Props) => {
  return (
    <Modal
      title="Редагування прав доступу користувача"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
    >
      <ChangeUserRoleForm
        record={record}
        setShowModal={setShowModal}
        onChange={onChange}
        user={user}
      />
    </Modal>
  );
};

export default ChangeUserRoleModal;
