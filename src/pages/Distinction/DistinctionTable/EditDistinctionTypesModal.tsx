import React from 'react';
import { Modal } from 'antd';
import FormEditDistinctionTypes from './FormEditDistinctionTypes';

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
}


const EditDistinctionTypesModal = ({visibleModal, setVisibleModal}: Props) => {
    const handleCancel = () => setVisibleModal(false);
  
    return (
        <Modal
            title="Редагування типів відзначень"
            visible={visibleModal}
            onCancel={handleCancel}
            footer={null}
        >
            <FormEditDistinctionTypes 
                setVisibleModal = {setVisibleModal}>
            </FormEditDistinctionTypes>
        </Modal>
    )
} 

export default EditDistinctionTypesModal;