import React from 'react';
import { Modal } from 'antd';
import ChangeUserRoleForm from './ChangeUserRoleForm';

interface Props {
    record: string;
    showModal: any;
    setShowModal: (showModal: any) => void;
    onChange: (id: string, userRoles: string[]) => void;
}
const ChangeUserRoleModal = ({ record, showModal, setShowModal, onChange }: Props) => {
    return (
        <Modal
            title="Редагування прав доступу користувача"
            visible={showModal}
            footer={null}
        >
            <ChangeUserRoleForm
                record={record}
                setShowModal={setShowModal}
                onChange={onChange} />
        </Modal>
    );
};

export default ChangeUserRoleModal;
