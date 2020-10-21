import React from 'react';
import { Modal } from 'antd';
import AssignUserNewOptionsForm from './AssignUserNewOptionsForm';

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string) => void;
    nameOfRoles: any;
}
const AssignUserNewOptionsModal = ({ record, showModal, setShowModal, onChange, nameOfRoles }: Props) => {
    return (
        <Modal
            title="Редагування інформації користувача"
            visible={showModal}
            centered
            footer={null}
            onCancel={() => setShowModal(false)}
        >
            <AssignUserNewOptionsForm
                record={record}
                setShowModal={setShowModal}
                onChange={onChange} 
                nameOfRoles={nameOfRoles}/>
        </Modal>
    );
};

export default AssignUserNewOptionsModal;