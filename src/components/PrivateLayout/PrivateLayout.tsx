import React, { useState, useEffect, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import { Avatar, Layout, Menu, Button } from "antd";
import {
  BankOutlined,
  BookOutlined,
  RollbackOutlined,
  AlignLeftOutlined,
  QuestionOutlined,
  SolutionOutlined,
  SnippetsOutlined,
  PieChartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  InsertRowAboveOutlined,
} from "@ant-design/icons";
import classes from "./PrivateLayout.module.css";
import AuthLocalStorage from "../../AuthLocalStorage";
import useOnClickOutside from "./useOneClickOutside";
import { User } from "../../pages/userPage/Interface/Interface";
import UserApi from "../../api/UserApi";
import IUserAnnualReportAccess from "../../models/UserAccess/IUserAccess";
import AnnualReportApi from "../../api/AnnualReportApi";
import StatisticsApi from "../../api/StatisticsApi";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const PrivateLayout = ({ children }: any) => {
  const history = useHistory();
  const ref = useRef(null);

  const [collapsed, setCollapsed] = useState(true);
  const [imageBase64, setImageBase64] = useState<string>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [userAccesses, setUserAccesses] = useState<{
    [key: string]: boolean;
  }>();
  const [userAnnualReportAccess, setUserAnnualReportAccess] = useState<
    IUserAnnualReportAccess
  >();

  useOnClickOutside(ref, () => setCollapsed(true));

  const onCollapse = (collValue: boolean) => {
    setCollapsed(collValue);
  };

  const fetchData = async () => {
    const token = AuthLocalStorage.getToken() as string;

    if (token == null) {
      if (window.location.pathname !== "/signin") {
        history.push("/signin");
      }
    } else {
      const user = await UserApi.getActiveUserProfile();

      const imagePromise = UserApi.getImage(user.imagePath);
      const menuAccessPromise = UserApi.getUserMenuAccess(user.id);
      const annualReportAccessPromise = AnnualReportApi.getUserAnnualReportAccess(
        user.id
      );
      const statisticsAccessPromise = StatisticsApi.getUserStatisticsAccess(
        user.id
      );

      setCurrentUser(user);
      setImageBase64((await imagePromise).data);
      setUserAccesses((await menuAccessPromise).data);
      setUserAnnualReportAccess({
        ...(await annualReportAccessPromise).data,
        ...(await statisticsAccessPromise).data,
      });
    }
  };

  useEffect(() => {
    if (!collapsed) {
      fetchData();
    }
  }, [collapsed]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout style={{ minHeight: "calc(100vh-64px-82px)" }}>
      <div ref={ref}>
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
            <Link to={`/userpage/main/${currentUser?.id}`}>
              <Avatar
                size={64}
                src={imageBase64}
                alt="User"
                style={{ marginRight: "10px" }}
              />
            </Link>
          </div>

          <Menu theme="dark" mode="inline" className={classes.leftMenu}>
            {userAccesses?.decisions ? (
              <Menu.Item key="decisions" icon={<SolutionOutlined />}>
                <a // 'a' tag is used to make possible to open item in new tab
                  href="/decisions"
                  onClick={(e) => {
                    e.preventDefault(); // To prevent page reload on item clicking
                    setCollapsed(true);
                    history.push("/decisions");
                  }}
                >
                  Рішення
                </a>
              </Menu.Item>
            ) : null}

            {userAccesses?.announcements ? (
              <Menu.Item key="announcements" icon={<InsertRowAboveOutlined />}>
                <a
                  href="/announcements/1"
                  onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(true);
                    history.push("/announcements/1");
                  }}
                >
                  Дошка оголошень
                </a>
              </Menu.Item>
            ) : null}

            {userAccesses?.regionBoard ? (
              <Menu.Item key="regionsBoard" icon={<BankOutlined />}>
                <a
                  href="/regionalBoard"
                  onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(true);
                    history.push("/regionalBoard");
                  }}
                >
                  Крайовий Провід Пласту
                </a>
              </Menu.Item>
            ) : null}

            {userAccesses?.directory ? (
              <SubMenu key="sub1" icon={<BookOutlined />} title="Довідник">
                {userAccesses.userTable ? (
                  <Menu.Item key="usertable">
                    <a
                      href="/user/table"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/user/table");
                      }}
                    >
                      Таблиця користувачів
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.regions || currentUser?.region ? (
                  <Menu.Item key="regions">
                    <a
                      href="/regions/page/1"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/regions/page/1");
                      }}
                    >
                      Округи
                    </a>
                  </Menu.Item>
                ) : null}

                <Menu.Item key="cities">
                  <a
                    href="/cities/page/1"
                    onClick={(e) => {
                      e.preventDefault();
                      setCollapsed(true);
                      history.push("/cities/page/1");
                    }}
                  >
                    Станиці
                  </a>
                </Menu.Item>

                {userAccesses.clubs ? (
                  <Menu.Item key="clubs">
                    <a
                      href="/clubs/page/1"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/clubs/page/1");
                      }}
                    >
                      Курені
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.events ? (
                  <Menu.Item key="events">
                    <a
                      href="/events/types"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/events/types");
                      }}
                    >
                      Події
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.distinctions ? (
                  <Menu.Item key="distinctions">
                    <a
                      href="/distinctions"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/distinctions");
                      }}
                    >
                      Відзначення
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.precaution ? (
                  <Menu.Item key="precautions">
                    <a
                      href="/precautions"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/precautions");
                      }}
                    >
                      Перестороги

                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.kadra ? (
                  <Menu.Item key="kadra">
                    <a
                      href="/kadra"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/kadra");
                      }}
                    >
                      Кадра виховників
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.renewals ? (
                  <Menu.Item key="renewals">
                    <a
                      href="/renewals"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/renewals");
                      }}
                    >
                      Відновлення статусу
                    </a>
                  </Menu.Item>
                ) : null}

                {userAccesses.legislation ? (
                  <Menu.Item key="legislation">
                    <a
                      href="/legislation"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/legislation");
                      }}
                    >
                      Репозитарій
                    </a>
                  </Menu.Item>
                ) : null}
              </SubMenu>
            ) : null}

            {userAnnualReportAccess?.CanViewReportsPage &&
            userAnnualReportAccess?.CanCityStatisticsFormReport ? (
              <SubMenu
                key="sub2"
                icon={<SnippetsOutlined />}
                title="Звітування та Статистика"
              >
                {userAnnualReportAccess?.CanViewRegionReportsTable ? (
                  <Menu.Item
                    icon={<FileTextOutlined />}
                    key="annualreportregion"
                  >
                    <a
                      href="/annualreport/table/region"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/annualreport/table/region");
                      }}
                    >
                      Річні звіти округ
                    </a>
                  </Menu.Item>
                ) : null}


                {userAnnualReportAccess?.CanViewCityReportsTable ? (
                  <Menu.Item icon={<FileTextOutlined />} key="annualreportcity">
                    <a
                      href="/annualreport/table/city"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/annualreport/table/city");
                      }}
                    >
                      Річні звіти станиць
                    </a>
                  </Menu.Item>
                ) : null}

                <SubMenu
                  key="sub2.1"
                  icon={<PieChartOutlined />}
                  title="Статистика"
                >
                  <Menu.Item icon={<BarChartOutlined />} key="statisticscities">
                    <a
                      href="/statistics/cities"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/statistics/cities");
                      }}
                    >
                      Статистика станиць
                    </a>
                  </Menu.Item>

                  <Menu.Item
                    icon={<BarChartOutlined />}
                    key="statisticsregions"
                  >
                    <a
                      href="/statistics/regions"
                      onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(true);
                        history.push("/statistics/regions");
                      }}
                    >
                      Статистика округ
                    </a>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>

            ) : userAnnualReportAccess?.CanViewClubReportsTable ? (
              <Menu.Item icon={<FileTextOutlined />} key="annualreporthovel">
                <a
                  href="/annualreport/table/hovel"
                  onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(true);
                    history.push("/annualreport/table/hovel");
                  }}
                >
                  Річні звіти куренів
                </a>
              </Menu.Item>
            ) : null}

            {userAccesses?.aboutBase ? (
              <Menu.Item key="aboutBase">
                <a
                  href="/aboutBase"
                  onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(true);
                    history.push("/aboutBase");
                  }}
                >
                  <QuestionOutlined />
                  Про Базу
                </a>
              </Menu.Item>
            ) : null}

            {userAccesses?.terms ? (
              <Menu.Item key="terms">
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    setCollapsed(true);
                    history.push("/terms");
                  }}
                >
                  <AlignLeftOutlined />
                  Політика конфіденційності
                </a>
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>
      </div>

      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }} key="content">
          <div
            className="site-layout-background"
            style={{ padding: 20, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
      </Layout>

      <div>
        <Button
          icon={<RollbackOutlined />}
          className={classes.backButton}
          size="large"
          onClick={() => history.goBack()}
          type="primary"
          style={{}}
        />
      </div>
    </Layout>
  );
};

export default PrivateLayout;
