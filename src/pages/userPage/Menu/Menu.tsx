import React from 'react';
import { Menu } from 'antd';
import styles from './Menu.module.css';
import { useHistory } from 'react-router-dom';

export default function () {
  const history = useHistory();
  return (
    <div className={styles.wrapper}>
      <Menu mode="horizontal" className={styles.menu}>
        <Menu.Item key="main" onClick={() => history.push("/userpage/main")}>
          Персональні дані
        </Menu.Item>
        <Menu.Item key="Membership">Дійсне членство</Menu.Item>
        <Menu.Item key="second">Діловодства</Menu.Item>
        <Menu.Item key="Events" onClick={() => history.push("/actions/eventuser")}>
          Події
          </Menu.Item>
        <Menu.Item key="Congresses">З`їзди</Menu.Item>
        <Menu.Item key="Blanks">Бланки</Menu.Item>
        <Menu.Item key="Authorization">Поручення</Menu.Item>
        <Menu.Item key="edit" onClick={() => history.push("/userpage/edit")}>
          Редагувати профіль
        </Menu.Item>
      </Menu>
    </div>
  );
}