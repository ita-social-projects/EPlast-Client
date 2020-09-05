import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import kadrasApi from '../../api/KadraVykhovnykivApi';

const { confirm } = Modal;

 const DeleteConfirm = (id:number, onDelete: any) => {

 return confirm({
    title: 'Ви справді хочете забрати кадру у цього користувача?',
    icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
    okText: 'Так',
    cancelText: 'Ні',
    onOk () { 
      const remove = async () => {
       await kadrasApi.deleteKadra(id);
      };
      remove();
      onDelete(id);
    },
  });
}
export default  DeleteConfirm; 