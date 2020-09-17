import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
    FileSearchOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import deleteConfirm from './DeleteConfirm';
import classes from '../../DecisionTable/Table.module.css';
import UserDistinction from '../Interfaces/UserDistinction';
import User from '../../../models/UserTable/User';
import distinctionApi from '../../../api/distinctionApi';
import Distinction from '../Interfaces/Distinction';
import EditDistinctionModal from './EditDistinctionModal';
import ClickAwayListener from 'react-click-away-listener';

interface Props {
    record: number;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    onDelete :(id: number)=> void;
    onEdit: (id: number, distinction: Distinction, date: Date, reason: string, reporter: string, user: any, userId: string) => void;

}

const DropDown = (props: Props) => {
    const history = useHistory();
    const { record, pageX, pageY, showDropdown, onDelete, onEdit} = props;
    const [showEditModal, setShowEditModal] = useState(false);
    const [userRole, setUser] = useState({
        userID: '',
        userEmail: '',
        allRoles: [{
            id: '',
            name: ''
        }],
        userRoles: ['']
    })
    const [UserDistinctions, setData] = useState<UserDistinction>({
        id: 0,
        distinction: 
        {
          id: 0,
          name: ''
        },
          distinctionId: 0,
          userId: '',
          reporter: '',
          reason: '',
          date: new Date(),
          user: new User()
      });

      useEffect(() => {
        if(showEditModal){
          const fetchData = async () =>{
            await distinctionApi.getUserDistinctionById(record).then(res => setData(res.data));
        }
          fetchData();
        }
        },[showEditModal]);
    const handleItemClick =async (item: any) => {
        switch (item.key) {
            case '2':
                deleteConfirm(record, onDelete);
                break;
            case '3':
                setShowEditModal(true)
                break;
            default:
                break;
        }
    }
    return (
        <>
            <Menu
                onClick = {handleItemClick}
                theme="dark"
                className={classes.menu}
                style={{
                    top: pageY,
                    left: pageX,
                    display: showDropdown ? 'block' : 'none',
                }
                }
            >
                <Menu.Item key="1" >
                    <FileSearchOutlined />
                        Переглянути профіль
                </Menu.Item>
                {(userRole?.userRoles as string[]).some(role => role !== 'Admin') &&
                    <Menu.Item key="2">
                        <DeleteOutlined />
                        Видалити
                </Menu.Item>
                }
                {(userRole?.userRoles as string[]).some(role => role !== 'Admin') &&
                <Menu.Item key="3">
                    <EditOutlined />
                        Редагувати
                </Menu.Item>
                }
            </Menu>
                <EditDistinctionModal
                record={record}
                distinction ={UserDistinctions}
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                onEdit = {onEdit}
                />
       
        </>
    );
};

export default DropDown;
