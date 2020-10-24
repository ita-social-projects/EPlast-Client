import React from 'react';
import { Modal } from 'antd';
import ChangeUserRegionForm from './ChangeUserRegionForm';

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string) => void;
}
const ChangeUserRegionModal = ({ record, showModal, setShowModal, onChange }: Props) => {
    return (
        <Modal
            title="Редагування округу"
            visible={showModal}
            centered
            footer={null}
            onCancel={() => setShowModal(false)}
        >
            <ChangeUserRegionForm
                record={record}
                showModal={showModal}
                setShowModal={setShowModal}
                onChange={onChange} />
        </Modal>
    );
};

export default ChangeUserRegionModal;