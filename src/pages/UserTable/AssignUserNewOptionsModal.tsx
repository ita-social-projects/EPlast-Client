import React from 'react';
import { Modal } from 'antd';
import AssignUserNewOptionsForm from './AssignUserNewOptionsForm';

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string) => void;
}
const AssignUserNewOptionsModal = ({ record, showModal, setShowModal, onChange }: Props) => {
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
                onChange={onChange} />
        </Modal>
    );
};

export default AssignUserNewOptionsModal;