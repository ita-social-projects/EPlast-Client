import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';
import notificationLogic from '../../components/Notifications/Notification';

const { confirm } = Modal;

const UserDeleteConfirm = (id: string, onDelete: any) => {
    return confirm({
        title: 'Ви справді хочете видалити користувача?',
        icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
        okText: 'Так',
        cancelText: 'Ні',
        onOk() {
            const remove = async () => {
                await adminApi.deleteUser(id).then(response => {
                    notificationLogic('success', 'Користувач успішно видалений');
                }).catch(error => {
                    if (error.response?.status === 400) {
                        notificationLogic('error', 'Спробуйте ще раз');
                    }
                });
            };
            remove();
            onDelete(id);
        },
    });
}
export default UserDeleteConfirm; 