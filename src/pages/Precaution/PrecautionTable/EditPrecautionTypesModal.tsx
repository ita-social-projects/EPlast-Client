import React from "react";
import { Drawer, Modal } from "antd";
import FormEditPrecautionTypes from "./FormEditPrecautionTypes";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const EditPrecautionTypesModal = ({
  visibleModal,
  setVisibleModal,
}: Props) => {
  const handleCancel = () => setVisibleModal(false);

  return (
    <Drawer
      title="Редагування типів пересторог"
      placement="right"
      width="auto"
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditPrecautionTypes
        setVisibleModal={setVisibleModal}
      ></FormEditPrecautionTypes>
    </Drawer>
  );
};

export default EditPrecautionTypesModal;
