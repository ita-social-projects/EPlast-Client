import React from "react";
import { Modal } from "antd";
import FormEditDistinction from "./FormEditDistinction";
import UserDistinction from "../Interfaces/UserDistinction";
import Distinction from "../Interfaces/Distinction";

interface Props {
  record: number;
  distinction: UserDistinction;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onEdit: (
    id: number,
    distinction: Distinction,
    date: Date,
    reason: string,
    reporter: string,
    user: any,
    userId: string
  ) => void;
}
const EditDistinctionModal = ({
  record,
  showModal,
  setShowModal,
  onEdit,
  distinction,
}: Props) => {
  const handleCancel = () => setShowModal(false);
  return (
    <Modal
      title="Редагування відзначення"
      visible={showModal}
      footer={null}
      onCancel={handleCancel}
    >
      <FormEditDistinction
        record={record}
        distinction={distinction}
        setShowModal={setShowModal}
        onEdit={onEdit}
      />
    </Modal>
  );
};

export default EditDistinctionModal;
