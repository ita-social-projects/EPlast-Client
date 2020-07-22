import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import classes from './Table.module.css';
import EditDecisionModal from './EditDecisionModal';
import deleteConfirm from './DeleteConfirm';
import decisionsApi, { DecisionPost } from '../../api/decisionsApi';

interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete :(id: number)=> void;
  onEdit :(id: number, name: string, description: string) => void;
}

const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown, onDelete, onEdit } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState<DecisionPost>({
    id: 0,
    name: "",
    decisionStatusType: 0,
    organization: {organizationName: "", id : 0},
    decisionTarget: {id : 0 ,targetName : ""},
    description: "",
    date: "",
    fileName: null,
});
  useEffect(() => {
  if(showEditModal){
    const fetchData = async () =>{
      await decisionsApi.getById(record).then(res => {console.log(res);
        setData(res)});
    }
    fetchData();
  }
  },[showEditModal]);
  /* eslint no-param-reassign: "error" */
  const handleItemClick =async (item: any) => {
    switch (item.key) {
      case '1':
        setShowEditModal(true);
        break;
      case '2':{
        const pdf = await decisionsApi.getPdf(record);
        window.open(pdf,"_blank");
        break;
      }
      case '3':
        deleteConfirm(record, onDelete);
        break;
      default:
        break;
    }
    item.key = '0'
  };

  return (
    <>
      <Menu
        theme="dark"
        onClick={handleItemClick}
        className={classes.menu}
        style={{
          top: pageY,
          left: pageX,
          display: showDropdown ? 'block' : 'none',
        }
        }
      >
        <Menu.Item key="1">
          <EditOutlined />
          Редагувати
        </Menu.Item>
        <Menu.Item key="2">
          <FilePdfOutlined />
          Конвертувати в PDF
        </Menu.Item>
        <Menu.Item key="3">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      </Menu>
      <EditDecisionModal
        record={record}
        decision ={ data}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        onEdit = {onEdit}
      />
    </>
  );
};

export default DropDown;
