import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  BellOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/images/ePlastLogotype.png";
import LogoText from "../../assets/images/logo_PLAST.svg";
import User from "../../assets/images/user.jpg";
import classes from "./Header.module.css";

const HeaderContainer = () => {
  const user = true;
  const primaryMenu = (
    <Menu
      mode="vertical"
      className={`${classes.headerMenu} ${classes.dropDownMenu}`}
    >
      <Menu.Item className={classes.headerDropDownItem} key="5">
        <NavLink
          to="/edit-profile"
          className={classes.headerLink}
          activeClassName={classes.activeLink}
        >
          <EditOutlined className={classes.dropDownIcon} />
          Редагувати профіль
        </NavLink>
      </Menu.Item>
      <Menu.Item className={classes.headerDropDownItem} key="6">
        <NavLink
          to="/signout"
          className={classes.headerLink}
          activeClassName={classes.activeLink}
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
      {user ? (
        <Menu mode="horizontal" className={classes.headerMenu}>
          <Menu.Item
            className={classes.headerItem}
            key="4"
            icon={<BellOutlined style={{ fontSize: "22px" }} />}
          />
          <Dropdown overlay={primaryMenu}>
            <NavLink
              to="/userpage/main"
              className={classes.userMenu}
              activeClassName={classes.activeLink}
            >
              <Avatar
                size={36}
                src={User}
                alt="User"
                style={{ marginRight: "10px" }}
              />
              Привіт, юзер
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
