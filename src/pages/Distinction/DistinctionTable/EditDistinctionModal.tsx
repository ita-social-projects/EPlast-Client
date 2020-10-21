import React from "react";
import { Drawer } from "antd";
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
    number: number,
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
    <Drawer
      title="Редагувати відзначення"
      placement="right"
      width="auto"
      height={1000}
      visible={showModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditDistinction
        record={record}
        distinction={distinction}
        setShowModal={setShowModal}
        onEdit={onEdit}
      />
    </Drawer>
  );
};

export default EditDistinctionModal;
