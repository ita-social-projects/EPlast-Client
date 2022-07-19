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
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>();
  const [userAnnualReportAccess, setUserAnnualReportAccess] = useState<IUserAnnualReportAccess>();

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
      const annualReportAccessPromise = AnnualReportApi.getUserAnnualReportAccess(user.id);
      const statisticsAccessPromise = StatisticsApi.getUserStatisticsAccess(user.id);

      setCurrentUser(user);
      setImageBase64((await imagePromise).data);
      setUserAccesses((await menuAccessPromise).data);
      setUserAnnualReportAccess({
        ...(await annualReportAccessPromise).data,
        ...(await statisticsAccessPromise).data
      });
    }
  };

  useEffect(() => {
    if (!collapsed) {
      fetchData();
    }
  }, [collapsed]);

  useEffect(() => { fetchData(); }, []);

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

            {userAccesses?.decisions
              ? (
              <Menu.Item
                key="0"
                icon={<SolutionOutlined />}
                onClick={() => {
                  setCollapsed(true);
                  history.push("/decisions");
                }}
                title=""
              >
                  <a href="/decisions" onClick={() => setCollapsed(true)}>Рішення</a>
              </Menu.Item>
              )
              : null
            }

            {userAccesses?.announcements
              ? (
              <Menu.Item
                key="announcements"
                icon={<InsertRowAboveOutlined />}
                onClick={() => {
                  setCollapsed(true);
                  history.push("/announcements/1");
                }}
                title=""
              >
                Дошка оголошень
              </Menu.Item>
              )
              : null
            }

            {userAccesses?.regionBoard
              ? (
              <Menu.Item
                key="1"
                icon={<BankOutlined />}
                onClick={() => {
                  setCollapsed(true);
                  history.push("/regionsBoard");
                }}
                title=""
              >
                Крайовий Провід Пласту
              </Menu.Item>
              )
              : null
            }

            {userAccesses?.directory
              ? (
            <SubMenu key="sub1" icon={<BookOutlined />} title="Довідник">

                  {userAccesses.userTable
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/user/table");
                  }}
                  key="2"
                >
                  Таблиця користувачів
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.regions || currentUser?.region
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/regions/page/1");
                  }}
                  key="3"
                >
                  Округи
                </Menu.Item>
                    )
                    : null
                  }

              <Menu.Item
                onClick={() => {
                      setCollapsed(true);
                  history.push("/cities/page/1");
                }}
                key="4"
              >
                Станиці
              </Menu.Item>

                  {userAccesses.clubs
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/clubs/page/1");
                  }}
                  key="5"
                >
                  Курені
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.events
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/events/types");
                  }}
                  key="6"
                >
                  Події
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.distinctions
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/distinctions");
                  }}
                  key="7"
                >
                  Відзначення
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.precaution
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/precautions");
                  }}
                  key="15"
                >
                  Перестороги
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.kadra
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/kadra");
                  }}
                  key="8"
                >
                  Кадра виховників
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.renewals
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/renewals");
                  }}
                  key="18"
                >
                  Відновлення статусу
                </Menu.Item>
                    )
                    : null
                  }

                  {userAccesses.legislation
                    ? (
                <Menu.Item
                  onClick={() => {
                          setCollapsed(true);
                    history.push("/legislation");
                  }}
                  key="14"
                >
                  Репозитарій
                </Menu.Item>
                    )
                    : null
                  }

                </SubMenu>)
              : null
            }

            {userAnnualReportAccess?.CanViewReportsPage
              && userAnnualReportAccess?.CanCityStatisticsFormReport
              ? (
              <SubMenu
                key="sub2"
                icon={<SnippetsOutlined />}
                title="Звітування та Статистика"
              >

                  {userAnnualReportAccess?.CanViewRegionReportsTable
                    ? (
                  <Menu.Item
                    icon={<FileTextOutlined />}
                    onClick={() => {
                      setCollapsed(true);
                      history.push(`/annualreport/table/region`);
                    }}
                    key="9"
                  >
                    Річні звіти
                  </Menu.Item>
                    )
                    : null
                  }

                  {userAnnualReportAccess?.CanViewCityReportsTable
                    ? (
                    <Menu.Item
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        setCollapsed(true);
                        history.push(`/annualreport/table/city`);
                      }}
                      key="9"
                    >
                      Річні звіти
                    </Menu.Item>
                    )
                    : null
                  }

                <SubMenu
                  key="sub2.1"
                  icon={<PieChartOutlined />}
                  title="Статистика"
                >

                  <Menu.Item
                    icon={<BarChartOutlined />}
                    onClick={() => {
                      setCollapsed(true);
                      history.push("/statistics/cities");
                    }}
                    key="10"
                  >
                    Статистика станиць
                  </Menu.Item>

                  <Menu.Item
                    icon={<BarChartOutlined />}
                    onClick={() => {
                      setCollapsed(true);
                      history.push("/statistics/regions");
                    }}
                    key="11"
                  >
                    Статистика округ
                  </Menu.Item>

                </SubMenu>

              </SubMenu>
              )
              : userAnnualReportAccess?.CanViewClubReportsTable
                ? (
              <Menu.Item
                icon={<FileTextOutlined />}
                onClick={() => {
                  setCollapsed(true);
                  history.push(`/annualreport/table/hovel`);
                }}
                key="16"
              >
                Річні звіти
              </Menu.Item>
                )
                : null
            }

            {userAccesses?.aboutBase
              ? (
              <Menu.Item
                onClick={() => {
                    setCollapsed(true);
                  history.push("/aboutBase");
                }}
                key="17"
                title=""
              >
                <QuestionOutlined />
                Про Базу
              </Menu.Item>
              )
              : null
            }

            {userAccesses?.terms
              ? (
              <Menu.Item
                onClick={() => {
                    setCollapsed(true);
                  history.push("/terms");
                }}
                key="18"
                title=""
              >
                <AlignLeftOutlined />
                Політика конфіденційності
              </Menu.Item>
              )
              : null
            }

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
