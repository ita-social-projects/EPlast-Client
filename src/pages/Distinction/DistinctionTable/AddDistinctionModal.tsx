import React from 'react';
import { Modal } from 'antd';
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
            title="Додати відзначення"
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