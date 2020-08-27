import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
    FileSearchOutlined,
    DeleteOutlined,
    EditOutlined,
    ScissorOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import classes from '../../DecisionTable/Table.module.css';


interface Props {
    record: string;
    pageX: number;
    pageY: number;
    showDropdown: boolean;

}

const DropDown = (props: Props) => {
    const history = useHistory();
    const { record, pageX, pageY, showDropdown} = props;
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

    return (
        <>
            <Menu
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
