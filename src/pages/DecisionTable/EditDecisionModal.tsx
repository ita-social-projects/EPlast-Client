import React from 'react';
import { Modal} from 'antd';
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
  return (
    <Modal
      title="Редагування рішення пластового проводу"
      visible={showModal}
      footer = {null}
    >
      <FormEditDecision 
      record={record} 
      decision = {decision}
      setShowModal = { setShowModal}
      onEdit = {onEdit}/>
    </Modal>
  );
};

export default EditDecisionModal;
