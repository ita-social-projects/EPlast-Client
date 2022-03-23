import React from "react";
import { Drawer } from "antd";
import FormAddDistinction from "./FormAddDistinction";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
  onDelete: () => void;
}

const AddDistinctionModal = ({
  visibleModal,
  setVisibleModal,
  onAdd,
  onDelete,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  };
  return (
    <Drawer
      title="Додати відзначення"
      placement="right"
      width={417}
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddDistinction
        setVisibleModal={setVisibleModal}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    </Drawer>
  );
};

export default AddDistinctionModal;
