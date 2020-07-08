import React from 'react';
import { Modal, Button } from 'antd';
import FormAddDecision from './FormAddDecision';

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const AddDecisionModal = ({ visibleModal, setVisibleModal }: Props) => {
 
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
        <Button key="submit" type="primary" >
          Опублікувати
        </Button>,
      ]}
    >
      <FormAddDecision  setVisibleModal = {setVisibleModal} />
    </Modal>
  );
};

export default AddDecisionModal;
