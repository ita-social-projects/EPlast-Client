import { Drawer } from "antd";
import React from "react";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import FormListOfDistinctionTypes from "./FormEditDistinctionTypes/FormListOfDistinctionTypes";

const EditDistinctionTypesModal = () => {
  const [state, actions] = useDistinctions();

  return (
    <Drawer
      title="Редагування типів відзначень"
      placement="right"
      width={420}
      height={1000}
      visible={state.editDistinctionTypesModalIsVisible}
      onClose={actions.closeEditDistinctionTypesModal}
      footer={null}
    >
      <FormListOfDistinctionTypes />
    </Drawer>
  );
};

export default EditDistinctionTypesModal;
