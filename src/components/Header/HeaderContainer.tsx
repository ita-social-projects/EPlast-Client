import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Drawer } from "antd";
import { LoginOutlined, LogoutOutlined, BellOutlined, EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/images/ePlastLogotype.png";
import LogoText from "../../assets/images/logo_PLAST.svg";
import classes from "./Header.module.css";
import AuthorizeApi from '../../api/authorizeApi';
import jwt from 'jwt-decode';
import AuthStore from '../../stores/AuthStore';
import userApi from '../../api/UserApi';
import NotificationBox from '../NotificationBox/NotificationBox';
import NotificationBoxApi, { NotificationType, UserNotification } from '../../api/NotificationBoxApi';
import WebSocketConnection from '../NotificationBox/WebSocketConnection';
import HistoryDrawer from "../HistoryNavi/HistoryDrawer";
import { useLocation } from 'react-router-dom';

let authService = new AuthorizeApi();

const HeaderContainer = () => {
  const user = AuthorizeApi.isSignedIn();
  const [imageBase64, setImageBase64] = useState<string>();
  const [name, setName] = useState<string>();
  const [id, setId] = useState<string>("");
  const token = AuthStore.getToken() as string;
  const signedIn = AuthorizeApi.isSignedIn();
  const userState = useRef(signedIn);
  const [notificationTypes, setNotificationTypes] = useState<Array<NotificationType>>([]);
  const [notifications, setNotifications] = useState<Array<UserNotification>>([]);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleHistoryDrawer, setVisibleHistoryDrawer] = useState(false);
  const location = useLocation().pathname;

  const fetchData = async () => {
    if (user) {
      const user: any = jwt(token);
      await userApi.getById(user.nameid).then(async response => {
        setName(response.data.user.firstName);
        if (name !== undefined) {
          userState.current = true;
        }
        setId(response.data.user.id);

        if (response.data.user.id !== undefined) {
          getNotifications(response.data.user.id);
          getNotificationTypes();
          let connection = WebSocketConnection.ManageConnection(response.data.user.id);

          connection.onmessage = function (event) {
            const result = JSON.parse(decodeURIComponent(event.data));
            setNotifications(t => [result as UserNotification].concat(t))
          };
        }
        await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
          setImageBase64(response.data);
        })
      })
    }
  };
  const userHistory: string[] = sessionStorage.getItem(`${name}`) !== null ? JSON.parse(sessionStorage[`${name}`]) : [];
  useEffect(() => {
    if (!userHistory.includes(location) && location !== "/signin") {
      userHistory.push(location)
    }
    if (userHistory.length > 25) {
      userHistory.shift();
    }
    sessionStorage.setItem(`${name}`, JSON.stringify(userHistory));
  }, [location])

  const getNotifications = async (userId: string) => {
    await NotificationBoxApi.getAllUserNotifications(userId)
      .then((response) => {
        setNotifications(response)
      })
      .catch(err => console.log(err))
  }

  const RemoveNotification = async (notificationId: number) => {
    await NotificationBoxApi.removeNotification(notificationId)
      .then(() => setNotifications(arr => arr.filter(elem => elem.id !== notificationId)));
  }

  const RemoveAllUserNotifications = async (userId: string) => {
    await NotificationBoxApi.removeUserNotifications(userId)
      .then(() => setNotifications([]));
  }

  const getNotificationTypes = async () => {
    await NotificationBoxApi.getAllNotificationTypes()
      .then((response) => {
        setNotificationTypes(response)
      })
      .catch(err => console.log(err))
  }

  const handleNotificationBox = async () => {
    if (id !== "") {
      getNotifications(id);
    }
  }

  const ShowNotifications = () => {
    setVisibleDrawer(true);
    NotificationBoxApi.SetCheckedAllUserNotification(id)
  }

  useEffect(() => {
    if((location.includes("signin") || location.includes("signup")) && signedIn){
      onLogoutClick();
    }
    fetchData();
  }, [location]);

  const onLogoutClick = async () => {
    await authService.logout();
    userState.current = false;
  }

  const primaryMenu = (
    <Menu
      mode="vertical"
      className={`${classes.headerMenu} ${classes.dropDownMenu}`}
      theme="light"
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
      <Menu mode="horizontal" className={classes.headerMenu} theme="light">
        <Menu.Item className={classes.headerItem} key="1">
          <div className={classes.headerLogo}>
            <NavLink to="/">
              <img src={LogoImg} alt="Logo" />
              <img src={LogoText} alt="Logo" />
            </NavLink>
          </div>
        </Menu.Item>
      </Menu>
      {console.log("signed in: " + signedIn)}
      {signedIn && userState.current ? (
        <>
          <Menu mode="horizontal" className={classes.headerMenu + " " + classes.MenuWidth}>
            <Button ghost
              icon={<BellOutlined style={{ fontSize: "24px", margin: "auto" }} />}
              onClick={ShowNotifications}
            >
            </Button>
            <Badge count={notifications.filter(n => n.checked === false).length}>
            </Badge>
            <Menu.Item
              className={classes.headerItem}
              key="4"
            >
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
                    style={{ marginRight: "10px", marginTop: "-5px"  }}
                  />
                  Привіт, {name !== undefined ? (name?.length > 12 ? name.slice(0, 10) + "..." : name) : ""}
                </NavLink>
              </Dropdown>
            </Menu.Item>
            <Menu.Item
              className={classes.headerItem}
              key="5"
            >
              <Button icon={< HistoryOutlined style={{ color: "white", fontSize: "23px", margin: "auto" }} />} type="ghost"
                onClick={() => setVisibleHistoryDrawer(true)}
              ></Button>
            </Menu.Item>
          </Menu>
          {id !== "" &&
            <NotificationBox
              userId={id}
              Notifications={notifications}
              VisibleDrawer={visibleDrawer}
              setVisibleDrawer={setVisibleDrawer}
              RemoveNotification={RemoveNotification}
              RemoveAllNotifications={RemoveAllUserNotifications}
              handleNotificationBox={handleNotificationBox}
            />
          }
          <HistoryDrawer
            history={userHistory}
            setVisibleHistoryDrawer={setVisibleHistoryDrawer}
            visibleHistoryDrawer={visibleHistoryDrawer}
          ></HistoryDrawer>
        </>
      ) : (
          <Menu mode="horizontal" className={classes.headerMenu} theme="light">
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
