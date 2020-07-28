import React from 'react';
import { Menu } from 'antd';
import styles from './Menu.module.css';
import { useHistory } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/Auth';

export default function () {
  const history = useHistory();
  var user:any;
  const token = AuthStore.getToken() as string;
  if(token == null){
    history.push("/signin");
  }
  else{
    user  = jwt(token);
  }
    
  return (
    <div className={styles.wrapper}>
      <Menu mode="horizontal" className={styles.menu}>
        <Menu.Item key="main" onClick={() => history.push(`/userpage/main/${user.nameid}`)}>
          Персональні дані
        </Menu.Item>
        <Menu.Item key="Membership">Дійсне членство</Menu.Item>
        <Menu.Item key="second">Діловодства</Menu.Item>
        <Menu.Item key="Events" onClick={() => history.push(`/actions/eventuser`)}>
          Події
        </Menu.Item>
        <Menu.Item key="Congresses">З`їзди</Menu.Item>
        <Menu.Item key="Blanks">Бланки</Menu.Item>
        <Menu.Item key="Authorization" onClick={() => history.push(`/userpage/approvers/${user.nameid}`)}>Поручення</Menu.Item>
        <Menu.Item key="edit" onClick={() => history.push(`/userpage/edit/${user.nameid}`)}>
          Редагувати профіль
        </Menu.Item>
      </Menu>
    </div>
  );
}
