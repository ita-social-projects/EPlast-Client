import React from "react";
import { Modal } from "antd";
import ChangeUserGoverningBodyForm from "./ChangeUserGoverningBodyForm";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  user: any;
}
const ChangeUserGoverningBodyModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user,
}: Props) => {
  return (
    <Modal
      title="Додати в Провід Пласту"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
      destroyOnClose
    >
      <ChangeUserGoverningBodyForm
        onChange={onChange}
        record={record}
        setShowModal={setShowModal}
        user={user}
      />
    </Modal>
  );
};

export default ChangeUserGoverningBodyModal;
