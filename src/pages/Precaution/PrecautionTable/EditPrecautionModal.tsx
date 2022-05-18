import React from "react";
import { Drawer } from "antd";
import FormEditPrecaution from "./FormEditPrecaution";
import UserPrecaution from "../Interfaces/UserPrecaution";
import Precaution from "../Interfaces/Precaution";

interface Props {
  record: number;
  Precaution: UserPrecaution;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onEdit: (userPrecaution: UserPrecaution) => void;
}
const EditPrecautionModal = ({
  record,
  showModal,
  setShowModal,
  onEdit,
  Precaution,
}: Props) => {
  const handleCancel = () => setShowModal(false);
  return (
    <Drawer
      title="Редагувати пересторогу"
      placement="right"
      width="auto"
      height={1000}
      visible={showModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditPrecaution
        record={record}
        Precaution={Precaution}
        setShowModal={setShowModal}
        onEdit={onEdit}
      />
    </Drawer>
  );
};

export default EditPrecautionModal;
