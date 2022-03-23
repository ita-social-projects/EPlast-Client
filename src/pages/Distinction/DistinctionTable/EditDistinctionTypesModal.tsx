import React from "react";
import { Drawer } from "antd";
import FormEditDistinctionTypes from "./FormEditDistinctionTypes";

interface Props {
  visibleModalEdit: boolean;
  setVisibleModalAddDist: (visibleModal: boolean) => void;
  setVisibleModalEditDist: (visibleModal: boolean) => void;
  onDelete: () => void;
}

const EditDistinctionTypesModal = ({
  visibleModalEdit,
  setVisibleModalAddDist,
  setVisibleModalEditDist,
  onDelete,
}: Props) => {
  const handleCancel = () => {
    setVisibleModalEditDist(false);
    setVisibleModalAddDist(true);
  };

  return (
    <Drawer
      title="Редагування типів відзначень"
      placement="right"
      width={420}
      height={1000}
      visible={visibleModalEdit}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditDistinctionTypes
        setVisibleModal={setVisibleModalEditDist}
        onDelete={onDelete}
      />
    </Drawer>
  );
};

export default EditDistinctionTypesModal;
