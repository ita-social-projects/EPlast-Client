import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import documentsApi from '../../api/documentsApi';

const { confirm } = Modal;

const DeleteConfirm = (id: number, onDelete: any) => {

  return confirm({
    title: 'Ви справді хочете видалити документ?',
    icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
    okText: 'Так',
    cancelText: 'Ні',
    onOk() {
      const remove = async () => {
        await documentsApi.remove(id);
      };
      remove();
      onDelete(id);
    },
  });
}
export default DeleteConfirm; 