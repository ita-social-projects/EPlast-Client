import React from 'react';
import { Menu } from 'antd';
import { FileSearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import Props from './ConfirmedDropdownProps';
import styles from '../Dropdown.module.css';

const ConfirmedDropdown = (props: Props) => {
    const { record, pageX, pageY, showDropdown, onView, onCancel } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case '1':
                onView(record.id);
                break;
            case '2':
                onCancel(record.id);
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
                    <FileExcelOutlined />Скасувати
                </Menu.Item>
            </Menu>
        </>
    );
}

export default ConfirmedDropdown;