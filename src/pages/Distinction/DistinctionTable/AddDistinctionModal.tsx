import React from "react";
import { Drawer } from "antd";
import FormAddDistinction from "./FormAddDistinction";
import classes from "./Form.module.css";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
}

const AddDistinctionModal = ({
  visibleModal,
  setVisibleModal,
  onAdd,
}: Props) => {
  const handleCancel = () => setVisibleModal(false);

  return (
    <Drawer
    className={classes.drawer}
      title="Додати відзначення"
      placement="right"
      width={520}
      height={1000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddDistinction setVisibleModal={setVisibleModal} onAdd={onAdd} />
    </Drawer>
  );
};

export default AddDistinctionModal;
