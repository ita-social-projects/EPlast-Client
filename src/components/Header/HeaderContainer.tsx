import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { LoginOutlined, LogoutOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/images/ePlastLogotype.png";
import LogoText from "../../assets/images/logo_PLAST.svg";
import classes from "./Header.module.css";
import AuthorizeApi from '../../api/authorizeApi';
import jwt from 'jwt-decode';
<<<<<<< HEAD
import AuthStore from '../../stores/Auth';
=======
import AuthStore from '../../stores/AuthStore';
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
import userApi from '../../api/UserApi';
let authService = new AuthorizeApi();

const HeaderContainer = () => {
<<<<<<< HEAD

  const user = AuthorizeApi.isSignedIn(); 

  const [imageBase64, setImageBase64] = useState<string>();
  const [name, setName] = useState<string>();
  const token = AuthStore.getToken() as string;
  const fetchData = async () => {

=======
  const user = AuthorizeApi.isSignedIn(); 
  const [imageBase64, setImageBase64] = useState<string>();
  const [name, setName] = useState<string>();
  const [id, setId] = useState<string>();
  const token = AuthStore.getToken() as string;
  const signedIn = AuthorizeApi.isSignedIn();
  const fetchData = async () => {
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    if (user) {
      const user: any = jwt(token);
      await userApi.getById(user.nameid).then(async response => {
        setName(response.data.user.firstName);
<<<<<<< HEAD
=======
        setId(response.data.user.id);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
        await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
          setImageBase64(response.data);
        })
      })
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const primaryMenu = (
    <Menu
      mode="vertical"
      className={`${classes.headerMenu} ${classes.dropDownMenu}`}
    >
      <Menu.Item className={classes.headerDropDownItem} key="5">
        <NavLink
<<<<<<< HEAD
          to="/edit-profile"
=======
          to={`/userpage/edit/${id}`}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
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
          onClick={authService.logout}
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
<<<<<<< HEAD
      {user ? (
=======
      {signedIn ? (
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
        <Menu mode="horizontal" className={classes.headerMenu}>
          <Menu.Item
            className={classes.headerItem}
            key="4"
            icon={<BellOutlined style={{ fontSize: "22px" }} />}
          />
          <Dropdown overlay={primaryMenu}>
            <NavLink
<<<<<<< HEAD
              to="/userpage/main"
=======
              to={`/userpage/main/${id}`}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
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
