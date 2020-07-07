import React from "react";
import { Modal, Button } from "antd";
import FormEditDecision from "./FormEditDecision";
import classes from "./Table.module.css";

// eslint-disable-next-line react/prop-types
const EditDecisionModal = ({ record, showModal, setShowModal }) => {
  const handleOk = () => {};
  const handleCancel = () => setShowModal(false);

  return (
    <Modal
      title="Редагування рішення пластового проводу"
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Відміна
        </Button>,
        <Button
          key="submit"
          type="primary"
          className={classes.addDecision}
          onClick={handleOk}
        >
          Змінити
        </Button>,
      ]}
    >
      <FormEditDecision record={record} />
    </Modal>
  );
};

export default EditDecisionModal;
