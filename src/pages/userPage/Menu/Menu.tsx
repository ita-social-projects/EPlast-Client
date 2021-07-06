import React, {useEffect, useState} from 'react';
import { Menu } from 'antd';
import './Menu.less';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Roles } from '../../../models/Roles/Roles';
import UserApi from '../../../api/UserApi';
import { User } from '../Interface/Interface';

type CustomMenuProps = {
  id: string;
}
const CustomMenu: React.FC<CustomMenuProps> = (props: CustomMenuProps) => {
  let { url } = useRouteMatch();
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [activeUserProfile, setActiveUserProfile] = useState<User>();
  const history = useHistory();

  useEffect(() => {
    checkAccessToManage();
  },[]);

  const checkAccessToManage = async () => {
    let userRoles = UserApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
    let userId = UserApi.getActiveUserId();
      setActiveUserId(userId);
    let userProfile = await UserApi.getActiveUserProfile();
      setActiveUserProfile(userProfile);
  };

  url = (url.replace(`/userpage/`, "")).replace(`/${props.id}`, "");

  return (
    <div className="wrapperMenu">
      <Menu mode="horizontal" className="menu" selectedKeys={[url]}>
        <Menu.Item className="menuItem" key="main" onClick={() => history.push(`/userpage/main/${props.id}`)}>
          Персональні дані
        </Menu.Item>
        {(props.id === activeUserId && activeUserProfile?.city) &&
        <Menu.Item className="menuItem" key="activeMembership" onClick={() => history.push(`/userpage/activeMembership/${props.id}`)}>
          Дійсне членство
        </Menu.Item>}
        {(props.id === activeUserId && activeUserProfile?.city) &&
        <Menu.Item className="menuItem" key="secretaries" onClick={()=>history.push(`/userpage/secretaries/${props.id}`)}>
          Діловодства
        </Menu.Item>}
        {((props.id === activeUserId && activeUserProfile?.city) ||
          (props.id !== activeUserId && !(activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.RegisteredUser)))) && 
        <Menu.Item className="menuItem" key="eventuser" onClick={() => history.push(`/userpage/eventuser/${props.id}`)}>
          Події
        </Menu.Item>}
        {((props.id === activeUserId && activeUserProfile?.city) ||
          (props.id !== activeUserId && !(activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.RegisteredUser)))) && 
        <Menu.Item className="menuItem" key="blank"onClick={() => history.push(`/userpage/blank/${props.id}`)}>
          Бланки
        </Menu.Item>}
        {(props.id === activeUserId && activeUserProfile?.city) &&
        <Menu.Item className="menuItem" key="approvers" onClick={() => history.push(`/userpage/approvers/${props.id}`)}>
          Поручення
        </Menu.Item>}
      </Menu>
    </div>
  );
}
export default CustomMenu;