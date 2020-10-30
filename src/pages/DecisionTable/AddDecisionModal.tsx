import React from 'react';
import { Modal,Drawer } from 'antd';
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
    <Drawer
      width="auto"
      title="Додати рішення пластового проводу"
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddDecision  
        setVisibleModal = {setVisibleModal}
        onAdd ={onAdd} />
    </Drawer>
  );
};

export default AddDecisionModal;
