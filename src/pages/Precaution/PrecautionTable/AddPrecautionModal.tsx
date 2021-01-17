import React from "react";
import { Drawer } from "antd";
import FormAddPrecaution from "./FormAddPrecaution";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
}

const AddPrecautionModal = ({
  visibleModal,
  setVisibleModal,
  onAdd,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  }
  return (
    <Drawer
      title="Додати пересторогу"
      placement="right"
      width="auto"
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddPrecaution setVisibleModal={setVisibleModal} onAdd={onAdd} />
    </Drawer>
  );
};

export default AddPrecautionModal;
