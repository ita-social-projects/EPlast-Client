import React from 'react';
import { Modal } from 'antd';
import ChangeUserCityForm from './ChangeUserCityForm';

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string) => void;
}
const ChangeUserCityModal = ({ record, showModal, setShowModal, onChange }: Props) => {
    return (
        <Modal
            title="Редагування станиці"
            visible={showModal}
            centered
            footer={null}
            onCancel={() => setShowModal(false)}
        >
            <ChangeUserCityForm
                record={record}
                showModal={showModal}
                setShowModal={setShowModal}
                onChange={onChange} />
        </Modal>
    );
};

export default ChangeUserCityModal;