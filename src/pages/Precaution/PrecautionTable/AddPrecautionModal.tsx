import React from "react";
import { Drawer } from "antd";
import FormAddPrecaution from "./FormAddPrecaution";
import PrecautionStore from "../PrecautionTable/PrecautionStore";
import { createHook } from "react-sweet-state";

const AddPrecautionModal = () => {
  const handleCancel = () => {
    actions.setVisibleAddModal(false);
  };
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  return (
    <Drawer
      title="Додати пересторогу"
      placement="right"
      width="auto"
      height={1000}
      visible={state.visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddPrecaution/>
    </Drawer>
  );
};

export default AddPrecautionModal;
