import React from "react";
import { Modal, Drawer } from "antd";
import AddRegionBoardMainAdminForm from "./AddRegionBoardMainAdminForm";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  handleAddGoverningBodyAdmin: (values: any) => void;
}

const AddRegionBoardMainAdminModal = ({
  visibleModal,
  setVisibleModal,
  handleAddGoverningBodyAdmin,
}: Props) => {
  const handleCancel = () => setVisibleModal(false);

  return (
    <Modal
      title="Додати крайового адміністратора"
      visible={visibleModal}
      onCancel={handleCancel}
      footer={null}
    >
      <AddRegionBoardMainAdminForm
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        handleAddGoverningBodyAdmin={handleAddGoverningBodyAdmin}
      ></AddRegionBoardMainAdminForm>
    </Modal>
  );
};

export default AddRegionBoardMainAdminModal;
