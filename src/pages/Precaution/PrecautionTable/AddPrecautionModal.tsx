import React from "react";
import { Drawer } from "antd";
import FormAddPrecaution from "./FormAddPrecaution";
import PrecautionStore from "../PrecautionTable/PrecautionStore";
import { createHook } from "react-sweet-state";

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
  };
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

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
