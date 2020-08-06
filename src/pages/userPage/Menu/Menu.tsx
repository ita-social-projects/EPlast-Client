import React from 'react';
import { Menu } from 'antd';
import './Menu.less';
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
    <div className="wrapperMenu">
      <Menu mode="horizontal" className="menu">
        <Menu.Item className="menuItem" key="main" onClick={() => history.push(`/userpage/main/${props.id}`)}>
          Персональні дані
        </Menu.Item>
        <Menu.Item className="menuItem" key="Membership">Дійсне членство</Menu.Item>
        <Menu.Item className="menuItem" key="second">Діловодства</Menu.Item>
        <Menu.Item className="menuItem" key="Events" onClick={() => history.push(`/actions/eventuser`)}>
          Події
        </Menu.Item>
        <Menu.Item className="menuItem" key="Congresses">З`їзди</Menu.Item>
        <Menu.Item className="menuItem" key="Blanks">Бланки</Menu.Item>
        <Menu.Item className="menuItem" key="Authorization" onClick={() => history.push(`/userpage/approvers/${props.id}`)}>Поручення</Menu.Item>
        {props.id==user.nameid && 
          <Menu.Item className="menuItem" key="edit" onClick={() => history.push(`/userpage/edit/${props.id}`)}>
          Редагувати профіль
        </Menu.Item>
        }
        
      </Menu>
    </div>
  );
}
export default CustomMenu;