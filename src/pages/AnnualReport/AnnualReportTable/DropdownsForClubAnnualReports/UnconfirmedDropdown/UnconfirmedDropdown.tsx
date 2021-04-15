import React from 'react';
import { Menu } from 'antd';
import { FileSearchOutlined, FileSyncOutlined, FileDoneOutlined, DeleteOutlined } from '@ant-design/icons';
import Props from './UnconfirmedDropdownProps';
import styles from '../Dropdown.module.css';

const UnconfirmedDropdown = (props: Props) => {
    const { record, pageX, pageY, showDropdown, canManage, onView, onEdit, onConfirm, onRemove } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case '1':
                onView(record.id);
                break;
            case '2':
                onEdit(record.id);
                break;
            case '3':
                if (canManage) {
                    onConfirm(record.id);
                }
                break;
            case '4':
                if (canManage) {
                    onRemove(record.id);
                }
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
                    left: (window.innerWidth - (pageX + 170)) < 0 ? window.innerWidth - 220 : pageX ,
                }} >
                <Menu.Item
                    key='1' >
                    <FileSearchOutlined />Переглянути
                </Menu.Item>
                {record.canManage? (
                    <Menu.Item
                        key='2' >
                        <FileSyncOutlined />Редагувати
                    </Menu.Item>
                ):null}
                {canManage ? (
                    <Menu.Item
                        key='3' >
                        <FileDoneOutlined />Підтвердити
                    </Menu.Item>
                ) : null}
                {canManage ? (
                    <Menu.Item
                        key='4' >
                        <DeleteOutlined />Видалити
                    </Menu.Item>
                ) : null}
            </Menu>
        </>
    );
}

export default UnconfirmedDropdown;