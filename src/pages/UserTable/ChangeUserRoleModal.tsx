import React from "react";
import { Modal } from "antd";
import ChangeUserRoleForm from "./ChangeUserRoleForm";
import Form from "antd/lib/form/Form";

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
      destroyOnClose={true}
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
