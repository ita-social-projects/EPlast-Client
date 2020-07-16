import React from 'react';
import { Menu } from 'antd';
import styles from './Menu.module.css';

export default function () {
  return (
    <div className={styles.wrapper}>
      <Menu mode="horizontal" className={styles.menu}>
        <Menu.Item key="Personal data">Персональні дані</Menu.Item>
        <Menu.Item key="Membership">Дійсне членство</Menu.Item>
        <Menu.Item key="second">Діловодства</Menu.Item>
        <Menu.Item key="Events">Події</Menu.Item>
        <Menu.Item key="Congresses">З`їзди</Menu.Item>
        <Menu.Item key="Blanks">Бланки</Menu.Item>
        <Menu.Item key="Authorization">Поручення</Menu.Item>
        <Menu.Item key="Edit profile">Редагувати профіль</Menu.Item>
      </Menu>
    </div>
  );
}