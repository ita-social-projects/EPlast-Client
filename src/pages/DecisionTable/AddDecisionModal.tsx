import React from 'react';
import { Modal, Button } from 'antd';
import FormAddDecision from './FormAddDecision';
import decisionsApi, {DecisionWrapper} from '../../api/decisionsApi'

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const AddDecisionModal = ({ visibleModal, setVisibleModal }: Props) => {
  const handleOk = async(data: DecisionWrapper) => {
    console.log(data);
    await decisionsApi.post(data).then( res => console.log(res));
  };

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
      <FormAddDecision onSubmit ={handleOk} />
    </Modal>
  );
};

export default AddDecisionModal;
