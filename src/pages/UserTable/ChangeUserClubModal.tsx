import React from 'react';
import { Modal } from 'antd';
import ChangeUserClubForm from './ChangeUserClubForm';

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string) => void;
}
const ChangeUserClubModal = ({ record, showModal, setShowModal, onChange }: Props) => {
    return (
        <Modal
            title="Редагування куреня"
            visible={showModal}
            centered
            footer={null}
            onCancel={() => setShowModal(false)}
        >
            <ChangeUserClubForm
                record={record}
                showModal={showModal}
                setShowModal={setShowModal}
                onChange={onChange} />
        </Modal>
    );
};

export default ChangeUserClubModal;