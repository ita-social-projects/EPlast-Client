import React from 'react';
import { Modal, Button } from 'antd';
import FormAddDecision from './FormAddDecision';

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const AddDecisionModal = ({ visibleModal, setVisibleModal }: Props) => {
  const handleOk = () => {};

  const handleCancel = () => setVisibleModal(false);

  return (
    <Modal
      title="Додати рішення пластового проводу"
      visible={visibleModal}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Відміна
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Опублікувати
        </Button>,
      ]}
    >
      <FormAddDecision />
    </Modal>
  );
};

export default AddDecisionModal;
