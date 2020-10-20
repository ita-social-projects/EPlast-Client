import React from "react";
import { Drawer, Modal } from "antd";
import FormEditDistinctionTypes from "./FormEditDistinctionTypes";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const EditDistinctionTypesModal = ({
  visibleModal,
  setVisibleModal,
}: Props) => {
  const handleCancel = () => setVisibleModal(false);

  return (
    <Drawer
      title="Редагування типів відзначень"
      placement="right"
      width="auto"
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditDistinctionTypes
        setVisibleModal={setVisibleModal}
      ></FormEditDistinctionTypes>
    </Drawer>
  );
};

export default EditDistinctionTypesModal;
