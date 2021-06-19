import React, {useEffect, useState} from 'react';
import { Menu } from 'antd';
import './Menu.less';
import { useHistory, useRouteMatch } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/AuthStore';
import jwt_decode from "jwt-decode";
import { Roles } from '../../../models/Roles/Roles';

type CustomMenuProps = {
  id: string;
}
const CustomMenu: React.FC<CustomMenuProps> = (props: CustomMenuProps) => {
  let { url } = useRouteMatch();
  const [roles, setRoles]=useState<string[]>([]);
  let user: any;
  const history = useHistory();
  const token = AuthStore.getToken() as string;

  if (token != null) {
    user = jwt(token);
  }

  useEffect(()=>{checkAccessToManage();},[]);

  const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    setRoles(decodedJwt[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]);
  };

  url = (url.replace(`/userpage/`, "")).replace(`/${props.id}`, "");
  return (
    <div className="wrapperMenu">
      <Menu mode="horizontal" className="menu" selectedKeys={[url]}>
        <Menu.Item className="menuItem" key="main" onClick={() => history.push(`/userpage/main/${props.id}`)}>
          Персональні дані
        </Menu.Item>
        <Menu.Item className="menuItem" key="activeMembership" onClick={() => history.push(`/userpage/activeMembership/${props.id}`)}>Дійсне членство</Menu.Item>
        <Menu.Item className="menuItem" key="secretaries" onClick={()=>history.push(`/userpage/secretaries/${props.id}`)}>Діловодства</Menu.Item>
        {(props.id===user?.nameid ||
        (props.id!==user?.nameid && !(roles==[Roles.Supporter] || roles==[Roles.RegisteredUser] || roles==[Roles.Supporter, Roles.RegisteredUser])))
            && <Menu.Item className="menuItem" key="eventuser" onClick={() => history.push(`/userpage/eventuser/${props.id}`)}>
          Події
        </Menu.Item>
        }
        {(props.id===user?.nameid ||
            (props.id!==user?.nameid && !(roles==[Roles.Supporter] || roles==[Roles.RegisteredUser] || roles==[Roles.Supporter, Roles.RegisteredUser])))
        && <Menu.Item className="menuItem" key="blank"onClick={() => history.push(`/userpage/blank/${props.id}`)}>
          Бланки
        </Menu.Item>
        }
        <Menu.Item className="menuItem" key="approvers" onClick={() => history.push(`/userpage/approvers/${props.id}`)}>Поручення</Menu.Item>
        {(props.id == user?.nameid || roles.includes(Roles.Admin)) &&
          <Menu.Item className="menuItem" key="edit" onClick={() => history.push(`/userpage/edit/${props.id}`)}>
            Редагувати профіль
        </Menu.Item>}
      </Menu>
    </div>
  );
}
export default CustomMenu;