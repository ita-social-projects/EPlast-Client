import React from "react";
import { Drawer } from "antd";
import FormEditPrecaution from "./FormEditPrecaution";
import { createHook } from "react-sweet-state";
import PrecautionStore from "../../../stores/StorePrecaution";

const EditPrecautionModal = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  return (
    <Drawer
      title="Редагувати пересторогу"
      placement="right"
      width="auto"
      height={1000}
      visible={state.showEditModal}
      onClose={() => actions.setShowEditModal(false)}
      footer={null}
    >
      <FormEditPrecaution/>
    </Drawer>
  );
};

export default EditPrecautionModal;
