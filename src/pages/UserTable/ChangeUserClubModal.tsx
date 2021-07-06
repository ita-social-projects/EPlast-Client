import React from "react";
import { Modal } from "antd";
import ChangeUserClubForm from "./ChangeUserClubForm";
import User from "../Distinction/Interfaces/User";

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user: User
}
const ChangeUserClubModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user
}: Props) => {
  return (
    <Modal
      title="Редагування куреня"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
    >
      <ChangeUserClubForm
        record={record}
        showModal={showModal}
        setShowModal={setShowModal}
        onChange={onChange}
        user={user}
      />
    </Modal>
  );
};

export default ChangeUserClubModal;
