import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
    FileSearchOutlined,
    DeleteOutlined,
    EditOutlined,
    ScissorOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import deleteConfirm from './DeleteConfirm';
import classes from '../../DecisionTable/Table.module.css';


interface Props {
    record: number;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    onDelete :(id: number)=> void;

}

const DropDown = (props: Props) => {
    const history = useHistory();
    const { record, pageX, pageY, showDropdown, onDelete} = props;
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

    
    const handleItemClick =async (item: any) => {
        switch (item.key) {
          case '2':
            deleteConfirm(record, onDelete);
            setShowEditModal(false);
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
                <Menu.Item key="3">
                    <EditOutlined />
                        Редагувати
                </Menu.Item>
            </Menu>

        </>
    );
};

export default DropDown;
