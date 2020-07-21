import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import decisionsApi from '../../api/decisionsApi';

const { confirm } = Modal;
interface Props {
  id: number;

  onDelete :()=> void
}

 const DeleteConfirm = (id:number, onDelete: any) => {

 return confirm({
    title: 'Ви справді хочете видалити рішення?',
    icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
    okText: 'Так',
    cancelText: 'Ні',
    onOk () { 
      const remove = async () => {
       await decisionsApi.remove(id)
       .then(res => console.log(res))
       .catch(err => console.log(err))
      };
      remove();
      onDelete(id);
    },
  });
}
export default  DeleteConfirm; 