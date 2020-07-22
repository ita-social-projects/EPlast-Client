import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import decisionsApi from '../../api/decisionsApi';

const { confirm } = Modal;

 const DeleteConfirm = (id:number, onDelete: any) => {

 return confirm({
    title: 'Ви справді хочете видалити рішення?',
    icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
    okText: 'Так',
    cancelText: 'Ні',
    onOk () { 
      const remove = async () => {
       await decisionsApi.remove(id);
      };
      remove();
      onDelete(id);
    },
  });
}
export default  DeleteConfirm; 