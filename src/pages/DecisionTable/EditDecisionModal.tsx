import React from 'react';
import { Modal,Drawer} from 'antd';
import FormEditDecision from './FormEditDecision';
import { DecisionPost } from '../../api/decisionsApi';

interface Props {
  record: number;
  decision: DecisionPost;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onEdit :(id: number, name: string, description: string) => void;
}
const EditDecisionModal = ({ record, showModal, setShowModal, onEdit, decision }: Props) => {

  const handleCancel = () => setShowModal(false);

  return (
    <Drawer
      width="auto"
      title="Редагування рішення Пластового проводу"
      visible={showModal}
      onClose={handleCancel}
      footer = {null}
    >
      <FormEditDecision 
      record={record} 
      decision = {decision}
      setShowModal = { setShowModal}
      onEdit = {onEdit}/>
    </Drawer>
  );
};

export default EditDecisionModal;
