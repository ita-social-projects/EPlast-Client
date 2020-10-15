import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Button } from "antd";
import { LoginOutlined, LogoutOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/images/ePlastLogotype.png";
import LogoText from "../../assets/images/logo_PLAST.svg";
import classes from "./Header.module.css";
import AuthorizeApi from '../../api/authorizeApi';
import jwt from 'jwt-decode';
import AuthStore from '../../stores/AuthStore';
import userApi from '../../api/UserApi';
import NotificationBox from '../NotificationBox/NotificationBox';
import NotificationBoxApi, {UserNotification } from '../../api/NotificationBoxApi';
let authService = new AuthorizeApi();

const HeaderContainer = () => {
  const user = AuthorizeApi.isSignedIn();
  const [imageBase64, setImageBase64] = useState<string>();
  const [name, setName] = useState<string>();
  const [id, setId] = useState<string>();
  const token = AuthStore.getToken() as string;
  const signedIn = AuthorizeApi.isSignedIn();
  const [userState, setUserState] = useState(signedIn);
  const [notifications, setNotifications] = useState<Array<UserNotification>>([]);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  
  const fetchData = async () => {
    if (user) {
      const user: any = jwt(token);
      await userApi.getById(user.nameid).then(async response => {
        setName(response.data.user.firstName);
        if(name !== undefined){
          setUserState(true);
        }
        setId(response.data.user.id);
        await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
          setImageBase64(response.data);
        })
      })
      setNotifications([
        { 
          id: 2,
          checked : false,
          message : "Петро вступив до вашого куреня",
          OwneruserId : id ? id : "111",
          userName : "User",
          userLink : "234234-234234-2-3-423-4-23-4",
          date : "23-10-2020",
        }
      ])
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const onLogoutClick = async () => {
    await authService.logout();
    setUserState(false);
  }

  const ShowNotifications = () => setVisibleDrawer(true)

  const primaryMenu = (
    <Menu
      mode="vertical"
      className={`${classes.headerMenu} ${classes.dropDownMenu}`}
    >
      <Menu.Item className={classes.headerDropDownItem} key="5">
        <NavLink
          to={`/userpage/edit/${id}`}
          className={classes.headerLink}
          activeClassName={classes.activeLink}
        >
          <EditOutlined className={classes.dropDownIcon} />
          Редагувати профіль
        </NavLink>
      </Menu.Item>
      <Menu.Item className={classes.headerDropDownItem} key="7">
        <NavLink
          to="/changePassword"
          className={classes.headerLink}
          activeClassName={classes.activeLink}
        >
          <EditOutlined className={classes.dropDownIcon} />
          Змінити пароль
        </NavLink>
      </Menu.Item>
      <Menu.Item className={classes.headerDropDownItem} key="6" >
        <NavLink
          className={classes.headerLink}
          activeClassName={classes.activeLink}
          to="/signin"
          onClick={onLogoutClick}
        >
          <LogoutOutlined className={classes.dropDownIcon} />
          Вийти
        </NavLink>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout.Header className={classes.headerContainer}>
      <Menu mode="horizontal" className={classes.headerMenu}>
        <Menu.Item className={classes.headerItem} key="1">
          <div className={classes.headerLogo}>
            <NavLink to="/">
              <img src={LogoImg} alt="Logo" />
              <img src={LogoText} alt="Logo" />
            </NavLink>
          </div>
        </Menu.Item>
      </Menu>
      {signedIn && userState ? (
        <>
          <Menu mode="horizontal" className={classes.headerMenu}>
            <Menu.Item
              className={classes.headerItem}
              key="4"
            >
              <Badge count={notifications.length}>
                <Button ghost
                  icon={<BellOutlined style={{ fontSize: "26px" }} />}
                  onClick={ShowNotifications}
                >
                </Button>
              </Badge>
            </Menu.Item>
            <Dropdown overlay={primaryMenu}>
              <NavLink
                to={`/userpage/main/${id}`}
                className={classes.userMenu}
                activeClassName={classes.activeLink}
              >
                <Avatar
                  size={36}
                  src={imageBase64}
                  alt="User"
                  style={{ marginRight: "10px" }}
                />
                Привіт, {name}
              </NavLink>
            </Dropdown>
          </Menu>
          <NotificationBox
            userId={id}
            Notifications={notifications}
            VisibleDrawer={visibleDrawer}
            setVisibleDrawer={setVisibleDrawer}
            handleNotificationBox={()=>{}}
          />
        </>
      ) : (
          <Menu mode="horizontal" className={classes.headerMenu}>
            <Menu.Item className={classes.headerItem} key="2">
              <NavLink
                to="/contacts"
                className={classes.headerLink}
                activeClassName={classes.activeLink}
              >
                Контакти
            </NavLink>
            </Menu.Item>
            <Menu.Item className={classes.headerItem} key="3">
              <NavLink
                to="/signin"
                className={classes.headerLink}
                activeClassName={classes.activeLink}
              >
                Увійти
              <LoginOutlined className={classes.headerIcon} />
              </NavLink>
            </Menu.Item>
          </Menu>
        )}
    </Layout.Header>
  );
};
export default HeaderContainer;
