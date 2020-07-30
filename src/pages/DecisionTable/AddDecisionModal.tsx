import React from 'react';
import { Modal } from 'antd';
import FormAddDecision from './FormAddDecision';
import { Decision } from '../../api/decisionsApi';

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
}

const AddDecisionModal = ({ visibleModal, setVisibleModal, onAdd }: Props) => {
 
  const handleCancel = () => setVisibleModal(false);

  return (
    <Modal
      title="Додати рішення пластового проводу"
      visible={visibleModal}
      onCancel={handleCancel}
      footer={null}
    >
      <FormAddDecision  
        setVisibleModal = {setVisibleModal}
        onAdd ={onAdd} />
    </Modal>
  );
};

export default AddDecisionModal;
