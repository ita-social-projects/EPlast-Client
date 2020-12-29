import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Layout, Menu } from "antd";
import ClickAwayListener from 'react-click-away-listener';

import {
  SolutionOutlined,
  InfoCircleOutlined,
  SnippetsOutlined,
  PieChartOutlined,
  FileTextOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import classes from "./PrivateLayout.module.css";
import jwt from 'jwt-decode';
import AuthStore from '../../stores/AuthStore';
import userApi from '../../api/UserApi';
import jwt_decode from "jwt-decode";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const PrivateLayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(true);
  const history = useHistory();
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [onlyRegistered, setOnlyRegistered] = useState(false);

  const onCollapse = (collValue: boolean) => {
    setCollapsed(collValue);
  };

  const handleClickAway = () => {
    setCollapsed(true);
  };

  const [imageBase64, setImageBase64] = useState<string>();
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    if (token == null) {
      const str = window.location.pathname
      if(str !== "/signin")
      {
        localStorage.setItem('pathName',str);
      }
      history.push("/signin");
    }
    else {
      const user: any = jwt(token);
      await userApi.getById(user.nameid).then(async response => {
        await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
          setImageBase64(response.data);
        })
      })
    }
  };

  const fetchUser = async () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
    setUser(roles);
    setCanEdit(roles.includes("Admin"));
    setOnlyRegistered(roles.includes("Зареєстрований користувач"))
  }

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  return (

    <Layout style={{ minHeight: "calc(100vh-64px-82px)" }}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          className={classes.sidebar}
          breakpoint="xxl"
          width="250"
          collapsedWidth="0"
        >
          <div className={classes.profilePhoto}>
            <Avatar
              size={64}
              src={imageBase64}
              alt="User"
              style={{ marginRight: "10px" }}
            />
          </div>
          <Menu theme="dark" mode="inline" className={classes.leftMenu}>
            {(canEdit == true) ? (
            <Menu.Item
              key="1"
              icon={<SolutionOutlined />}
              onClick={() => { handleClickAway(); history.push("/decisions"); }}
              style={{ color: "white" }}
            >
              Рішення
          </Menu.Item>
            ) : (<> </>)
            }
            <SubMenu key="sub1" icon={<InfoCircleOutlined />} title="Інформація">
            {(canEdit == true) ? (
              <Menu.Item onClick={() => { handleClickAway(); history.push("/user/table"); }} key="2">
                Таблиця користувачів
              </Menu.Item>
                ) : (<> </>)
            }
              <Menu.Item onClick={() => { handleClickAway(); history.push("/regions");}} key="3">
                Округи
              </Menu.Item>
              <Menu.Item onClick={() => { handleClickAway(); history.push("/cities"); }} key="4">
                Станиці
              </Menu.Item>
            {(onlyRegistered == false)? (
              <Menu.Item onClick={() => { handleClickAway(); history.push('/clubs'); }} key="5">
                Курені
              </Menu.Item>) : (<> </>)
            }
              <Menu.Item onClick={() => { handleClickAway(); history.push('/events/types'); }} key="6">
                Події
              </Menu.Item>
            {(onlyRegistered == false)? (
              <Menu.Item onClick={() => { handleClickAway(); history.push('/distinctions'); }} key="7">
                Відзначення
              </Menu.Item>) : (<> </>)
            }
             {(onlyRegistered == false)? (
              <Menu.Item onClick={() => { handleClickAway(); history.push('/kadra'); }} key="8">
                Кадра виховників
              </Menu.Item>) : (<> </>)
            }
            </SubMenu>
            {(onlyRegistered == false)? (
            <SubMenu key="sub2" icon={<SnippetsOutlined />} title="Документи">
                <Menu.Item icon={<FileTextOutlined />} onClick={() => { handleClickAway(); history.push('/annualreport/table'); }} key="9">Річні звіти</Menu.Item>
              <SubMenu
                key="sub2.1"
                icon={<PieChartOutlined />}
                title="Статистика" >
                <Menu.Item icon={<BarChartOutlined />} onClick={() => { handleClickAway(); history.push('/statistics/cities'); }} key="10">Статистика станиць</Menu.Item>
                <Menu.Item icon={<BarChartOutlined />} onClick={() => { handleClickAway(); history.push('/statistics/regions'); }} key="11">Статистика округів</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2.3" title="Осередки">
                <Menu.Item onClick={() => { handleClickAway(); }} key="12">Осередки та адміни</Menu.Item>
                <Menu.Item onClick={() => { handleClickAway(); }} key="13">Порівняти осередки</Menu.Item>
              </SubMenu>
            </SubMenu>) : (<> </>)
            }
          </Menu>
        </Sider>
      </ClickAwayListener>

      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 20, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
      </Layout>

    </Layout>

  );
};

export default PrivateLayout;