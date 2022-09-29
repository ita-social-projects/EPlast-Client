import { Drawer } from "antd";
import React from "react";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import FormEditDistinction from "./FormEditDistinction";

const EditDistinctionModal = () => {
  const [state, actions] = useDistinctions();
  return (
    <Drawer
      title="Редагувати відзначення"
      placement="right"
      width="auto"
      height={1000}
      visible={state.isEditUserDistinctionFormVisible}
      onClose={actions.closeUserDistinctionEditModal}
      footer={null}
    >
      <FormEditDistinction />
    </Drawer>
  );
};

export default EditDistinctionModal;
