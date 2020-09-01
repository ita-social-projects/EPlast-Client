import React from 'react';
import { Modal } from 'antd';
import UserDistinction from '../../../api/distinctionApi';
import FormAddDistinction from './FormAddDistinction';

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    onAdd: () => void;
}

const AddDistinctionModal = ({ visibleModal, setVisibleModal, onAdd }: Props) => {
 
    const handleCancel = () => setVisibleModal(false);
  
    return (
        <Modal
            title="Додати рішення пластового проводу"
            visible={visibleModal}
            onCancel={handleCancel}
            footer={null}
        >
        <FormAddDistinction  
            setVisibleModal = {setVisibleModal}
            onAdd ={onAdd} />
        </Modal>
    );
};

export default AddDistinctionModal;