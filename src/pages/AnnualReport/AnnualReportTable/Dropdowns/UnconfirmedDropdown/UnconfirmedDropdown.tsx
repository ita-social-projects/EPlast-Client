import React from 'react';
import { Menu } from 'antd';
import { FileSearchOutlined, FileSyncOutlined, FileDoneOutlined, DeleteOutlined } from '@ant-design/icons';
import Props from './UnconfirmedDropdownProps';
import styles from '../Dropdown.module.css';

const UnconfirmedDropdown = (props: Props) => {
    const { record, pageX, pageY, showDropdown, onView, onEdit, onConfirm, onRemove } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case '1':
                onView(record.id);
                break;
            case '2':
                onEdit(record.id);
                break;
            case '3':
                onConfirm(record.id);
                break;
            case '4':
                onRemove(record.id);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Menu
                theme='dark'
                onClick={handleClick}
                className={showDropdown ? styles.menu : styles.menuHidden}
                style={{
                    top: pageY,
                    left: pageX
                }} >
                <Menu.Item
                    key='1' >
                    <FileSearchOutlined />Переглянути
                </Menu.Item>
                <Menu.Item
                    key='2' >
                    <FileSyncOutlined />Редагувати
                </Menu.Item>
                <Menu.Item
                    key='3' >
                    <FileDoneOutlined />Підтвердити
                </Menu.Item>
                <Menu.Item
                    key='4' >
                    <DeleteOutlined />Видалити
                </Menu.Item>
            </Menu>
        </>
    );
}

export default UnconfirmedDropdown;