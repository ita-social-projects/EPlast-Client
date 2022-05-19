import React from "react";
import { Drawer, Modal } from "antd";
import FormEditPrecautionTypes from "./FormEditPrecautionTypes";
import PrecautionStore from "./PrecautionStore";
import { createHook } from "react-sweet-state";

const EditPrecautionTypesModal = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();
  
  const handleCancel = () => actions.setVisibleModal(false);

  return (
    <Drawer
      title="Редагування типів пересторог"
      placement="right"
      width="auto"
      height={1000}
      visible={state.editVisibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditPrecautionTypes/>
    </Drawer>
  );
};

export default EditPrecautionTypesModal;
