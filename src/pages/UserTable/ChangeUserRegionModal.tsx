import React from "react";
import { Modal } from "antd";
import ChangeUserRegionForm from "./ChangeUserRegionForm";

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  roles: string | undefined;
}
const ChangeUserRegionModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  roles,
}: Props) => {
  return (
    <Modal
      title="Редагування округи"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
    >
      <ChangeUserRegionForm
        record={record}
        showModal={showModal}
        setShowModal={setShowModal}
        onChange={onChange}
        roles={roles}
      />
    </Modal>
  );
};

export default ChangeUserRegionModal;
