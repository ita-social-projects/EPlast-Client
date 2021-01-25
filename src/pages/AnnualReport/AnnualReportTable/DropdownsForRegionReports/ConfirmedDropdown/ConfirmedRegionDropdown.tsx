import React from 'react';
import { Menu } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import Props from './ConfirmedRegionDropdownProps';
import styles from '../Dropdown.module.css';
import moment from 'moment';

const ConfirmedRegionDropdown = (props: Props) => {
    const { regionRecord,  pageX, pageY, showDropdown, onView } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case '1':
                onView(regionRecord.regionId, Number(JSON.stringify(regionRecord).slice(17, 21)));
                break;
            default:
                break;
        }
    }

    return (
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
            </Menu>
    );
}

export default ConfirmedRegionDropdown;