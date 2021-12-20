import React, { useContext } from 'react';
import { Menu } from 'antd';
import './Menu.less';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { PersonalDataContext } from '../personalData/PersonalData';

type CustomMenuProps = {
  id: string;
}
const CustomMenu: React.FC<CustomMenuProps> = (props: CustomMenuProps) => {
  let { url } = useRouteMatch();
  const { activeUserId , userProfileAccess } = useContext(PersonalDataContext);
  const history = useHistory();

  url = (url.replace(`/userpage/`, "")).replace(`/${props.id}`, "");

  return (
    <div className="wrapperMenu">
      <Menu mode="horizontal" className="menu" selectedKeys={[url]}>
        <Menu.Item className="menuItem" key="main" onClick={() => history.push(`/userpage/main/${props.id}`)}>
          Персональні дані
        </Menu.Item>
        <Menu.Item className="menuItem" key="activeMembership" onClick={() => history.push(`/userpage/activeMembership/${props.id}`)}>
          Дійсне членство
        </Menu.Item>
        <Menu.Item className="menuItem" key="secretaries" onClick={() => history.push(`/userpage/secretaries/${props.id}`)}>
          Діловодства
        </Menu.Item>
        {(userProfileAccess["CanSeeUserEvents"] || props.id === activeUserId) &&
          <Menu.Item className="menuItem" key="eventuser" onClick={() => history.push(`/userpage/eventuser/${props.id}`)}>
            Події
          </Menu.Item>}
        {(userProfileAccess["CanSeeUserBlankPage"] || props.id === activeUserId) &&
          <Menu.Item className="menuItem" key="blank" onClick={() => history.push(`/userpage/blank/${props.id}`)}>
            Бланки
          </Menu.Item>}
        <Menu.Item className="menuItem" key="approvers" onClick={() => history.push(`/userpage/approvers/${props.id}`)}>
          Поручення
        </Menu.Item>
      </Menu>
    </div>
  );
}
export default CustomMenu;