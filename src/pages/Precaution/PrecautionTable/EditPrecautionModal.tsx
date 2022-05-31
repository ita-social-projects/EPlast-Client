import React from "react";
import { Drawer } from "antd";
import FormEditPrecaution from "./FormEditPrecaution";
import UserPrecaution from "../Interfaces/UserPrecaution";
import Precaution from "../Interfaces/Precaution";
import UserPrecautionTableItem from "../Interfaces/UserPrecautionTableItem";

interface Props {
  userPrecaution: UserPrecaution;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onEdit: (
    id: number,
    Precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => void;
}
const EditPrecautionModal = ({
  userPrecaution,
  showModal,
  setShowModal,
  onEdit,
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
        oldUserPrecaution={userPrecaution}
        setShowModal={setShowModal}
        onEdit={onEdit}
      />
    </Drawer>
  );
};

export default EditPrecautionModal;
