import React, { useState, useEffect } from 'react';
import { Menu , Modal} from 'antd';
import {
    FileSearchOutlined,
    DeleteOutlined,
    EditOutlined,
    ScissorOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import classes from './Table.module.css'
import deleteConfirm from './DeleteConfirm';

import UpdateKadraForm from './UpdateKadraForm';
import ClickAwayListener from 'react-click-away-listener';

import kadrasApi from "../../api/KadraVykhovnykivApi";


interface Props {
    record: number;
    pageX: number;
    pageY: number;
    setShowDropdown:(view: boolean)=>void;
    onDelete :(id: number)=> void;
    showDropdown: boolean;
    onEdit:()=>void;
}

const DropDown = (props: Props) => {
    const history = useHistory();

    const { record, pageX, pageY, showDropdown, onDelete, setShowDropdown, onEdit} = props;
    
    const [visibleEdit, setvisibleEdit]= useState<boolean>(false) ;
    
    const [selectUserId, SetselectUserId] = useState<string>();
    
    const handleOkEdit = () => {
      
      setvisibleEdit(false);
     
    };
    
    const handleCancelEdit = () => {
    
      setvisibleEdit(false);
    };


    const handleItemClick =async (item: any) => {
        switch (item.key) {
          case '2':
            setvisibleEdit(true);
            setShowDropdown(false);
            break;
          case '1':
            deleteConfirm(record, onDelete);
            setShowDropdown(false);
            break;
            case '3':
              await kadrasApi.findUserByEduStaff(record).then(response => {
                
                 history.push(`/userpage/main/${response.data}`)
              })
              
            break;
          default:
            break;
        }
        item.key = '0'
      };
    



    return (
     
        <> 
            <Menu
                onClick={handleItemClick}
                className = {classes.menu}
                theme="dark"
                style={{
                    top: pageY,
                    left: pageX,
                    display: showDropdown ? 'block' : 'none',
                }
                }
            >

                <Menu.Item key="1">
                    <DeleteOutlined />
                    Видалити
                </Menu.Item>
                
                <Menu.Item key="2">
                    <EditOutlined />
                        Редагувати
                </Menu.Item>

                <Menu.Item key="3">
                    <FileSearchOutlined />
                        Переглянути профіль
                </Menu.Item>
            </Menu>

         <Modal
          title="Змінити кадру виховників"
          visible={visibleEdit}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
          footer={null}

        >
          <UpdateKadraForm record={record} onAdd={handleCancelEdit} onEdit={onEdit}></UpdateKadraForm>
        </Modal>
        </>
      
    );
};

export default DropDown;