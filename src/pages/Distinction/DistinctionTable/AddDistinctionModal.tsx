import { Drawer } from "antd";
import React from "react";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import FormAddUserDistinction from "./FormAddDistinction";

const AddUserDistinctionModal = () => {
  const [state, actions] = useDistinctions();
  return (
    <Drawer
      title="Додати відзначення"
      placement="right"
      width={417}
      height={1000}
      visible={state.addUserDistinctionModalIsVisible}
      onClose={actions.closeUserDistinctionAddModal}
      footer={null}
    >
      <FormAddUserDistinction />
    </Drawer>
  );
};

export default AddUserDistinctionModal;
