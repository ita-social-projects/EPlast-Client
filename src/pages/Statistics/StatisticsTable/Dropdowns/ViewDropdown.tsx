import React from 'react';
import { Menu } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import Props from './ViewDropdownProps';
import styles from './Dropdown.module.css';

const ViewDropdown = (props: Props) => {
    const { record, pageX, pageY, showDropdown, onView } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case '1':
                onView(record);
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
            </Menu>
        </>
    );
}

export default ViewDropdown;