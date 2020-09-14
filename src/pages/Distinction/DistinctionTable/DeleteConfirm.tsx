import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import distinctionApi from '../../../api/distinctionApi';

const { confirm } = Modal;

 const DeleteConfirm = (id:number, onDelete: any) => {

 return confirm({
    title: 'Ви справді хочете видалити відзначення цього користувача?',
    icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
    okText: 'Так',
    cancelText: 'Ні',
    onOk () { 
      const remove = async () => {
       await distinctionApi.deleteUserDistinction(id);
      };
      remove();
      onDelete(id);
    },
  });
}
export default  DeleteConfirm; 