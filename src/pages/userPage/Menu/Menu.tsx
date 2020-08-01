import React from 'react';
import { Menu } from 'antd';
import styles from './Menu.module.css';
import { useHistory } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/AuthStore';

type CustomMenuProps={
  id:string;
}
const CustomMenu:React.FC<CustomMenuProps>=(props:CustomMenuProps)=>{
  let user:any;
  const history = useHistory();
  const token = AuthStore.getToken() as string;
  if(token != null){
    user  = jwt(token);
  }
  return (
    <div className={styles.wrapper}>
      <Menu mode="horizontal" className={styles.menu}>
        <Menu.Item key="main" onClick={() => history.push(`/userpage/main/${props.id}`)}>
          Персональні дані
        </Menu.Item>
        <Menu.Item key="Membership">Дійсне членство</Menu.Item>
        <Menu.Item key="second">Діловодства</Menu.Item>
        <Menu.Item key="Events" onClick={() => history.push(`/actions/eventuser`)}>
          Події
        </Menu.Item>
        <Menu.Item key="Congresses">З`їзди</Menu.Item>
        <Menu.Item key="Blanks">Бланки</Menu.Item>
        <Menu.Item key="Authorization" onClick={() => history.push(`/userpage/approvers/${props.id}`)}>Поручення</Menu.Item>
        {props.id==user.nameid && 
          <Menu.Item key="edit" onClick={() => history.push(`/userpage/edit/${props.id}`)}>
          Редагувати профіль
        </Menu.Item>
        }
        
      </Menu>
    </div>
  );
}
export default CustomMenu;