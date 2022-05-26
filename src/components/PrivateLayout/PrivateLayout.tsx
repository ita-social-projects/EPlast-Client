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

import jwt from "jwt-decode";
import classes from "./PrivateLayout.module.css";
import AuthStore from "../../stores/AuthStore";
import { Roles } from "../../models/Roles/Roles";
import useOnClickOutside from "./useOneClickOutside";
import { User } from "../../pages/userPage/Interface/Interface";
import UserApi from "../../api/UserApi";
import IUserAnnualReportAccess from "../../models/UserAccess/IUserAccess";
import IUserStatisticsAccess from "../../models/UserAccess/IUserAccess";
import AnnualReportApi from "../../api/AnnualReportApi";
import StatisticsApi from "../../api/StatisticsApi";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const PrivateLayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(true);
  const history = useHistory();
  const [id, setId] = useState<string>("");
  const [onlyRegistered, setOnlyRegistered] = useState(false);
  const [activeUserProfile, setActiveUserProfile] = useState<User>();
  const [plastMember, setPlastMember] = useState(false);
  const [reload, setReload] = useState<boolean>(false);
  const ref = useRef(null);
  const [userAnnualReportAccess, setUserAnnualReportAccess] = useState<
    IUserAnnualReportAccess
  >();
  const [userStatisticsAccess, setUserStatisticsAccess] = useState<
    IUserStatisticsAccess
  >();
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleClickOutside = () => {
    setCollapsed(true);
  };
  useOnClickOutside(ref, handleClickOutside);

  const onCollapse = (collValue: boolean) => {
    setReload(!reload);
    setCollapsed(collValue);
  };

  const handleClickAway = () => {
    setCollapsed(true);
  };

  const getUserAccessesForMenu = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await UserApi.getUserMenuAccess(user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const [imageBase64, setImageBase64] = useState<string>();
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    getUserAccessesForMenu();
    if (token == null) {
      const str = window.location.pathname;
      if (str !== "/signin") {
        localStorage.setItem("pathName", str);
      }
      history.push("/signin");
    } else {
      const user: any = jwt(token);
      await UserApi.getById(user.nameid).then(async (response) => {
        await UserApi.getImage(response.data?.user.imagePath).then(
          (response: { data: any }) => {
            setImageBase64(response.data);
          }
        );
        setId(response.data.user.id);
      });
    }
  };

  const fetchUser = async () => {
    let roles = UserApi.getActiveUserRoles();
    setOnlyRegistered(roles.includes(Roles.RegisteredUser));
    setPlastMember(roles.includes(Roles.PlastMember));
    let userProfile = await UserApi.getActiveUserProfile();
    setActiveUserProfile(userProfile);
    setUserAnnualReportAccess(
      await (
        await AnnualReportApi.getUserAnnualReportAccess(
          UserApi.getActiveUserId()
        )
      ).data
    );
    setUserStatisticsAccess(
      await (
        await StatisticsApi.getUserStatisticsAccess(UserApi.getActiveUserId())
      ).data
    );
  };

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [reload]);

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
            <Link to={`/userpage/main/${id}`}>
              <Avatar
                size={64}
                src={imageBase64}
                alt="User"
                style={{ marginRight: "10px" }}
              />
            </Link>
          </div>
          <Menu theme="dark" mode="inline" className={classes.leftMenu}>
            {userAccesses["decisions"] ? (
              <Menu.Item
                key="0"
                icon={<SolutionOutlined />}
                onClick={() => {
                  handleClickAway();
                  history.push("/decisions");
                }}
                title=""
              >
                Рішення
              </Menu.Item>
            ) : (
              <> </>
            )}
            {userAccesses["announcements"] ? (
              <Menu.Item
                key="announcements"
                icon={<InsertRowAboveOutlined />}
                onClick={() => {
                  handleClickAway();
                  history.push("/announcements/1");
                }}
                title=""
              >
                Дошка оголошень
              </Menu.Item>
            ) : (
              <> </>
            )}
            {userAccesses["regionBoard"] ? (
              <Menu.Item
                key="1"
                icon={<BankOutlined />}
                onClick={() => {
                  handleClickAway();
                  history.push("/regionsBoard");
                }}
                title=""
              >
                Крайовий Провід Пласту
              </Menu.Item>
            ) : (
              <> </>
            )}

            <SubMenu key="sub1" icon={<BookOutlined />} title="Довідник">
              {userAccesses["userTable"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/user/table");
                  }}
                  key="2"
                >
                  Таблиця користувачів
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["regions"] || activeUserProfile?.region ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/regions/page/1");
                  }}
                  key="3"
                >
                  Округи
                </Menu.Item>
              ) : (
                <> </>
              )}
              <Menu.Item
                onClick={() => {
                  handleClickAway();
                  history.push("/cities/page/1");
                }}
                key="4"
              >
                Станиці
              </Menu.Item>
              {userAccesses["clubs"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/clubs/page/1");
                  }}
                  key="5"
                >
                  Курені
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["events"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/events/types");
                  }}
                  key="6"
                >
                  Події
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["distinctions"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/distinctions");
                  }}
                  key="7"
                >
                  Відзначення
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["precaution"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/precautions");
                  }}
                  key="15"
                >
                  Перестороги
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["kadra"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/kadra");
                  }}
                  key="8"
                >
                  Кадра виховників
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["renewals"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/renewals");
                  }}
                  key="18"
                >
                  Відновлення статусу
                </Menu.Item>
              ) : (
                <> </>
              )}
              {userAccesses["legislation"] ? (
                <Menu.Item
                  onClick={() => {
                    handleClickAway();
                    history.push("/legislation");
                  }}
                  key="14"
                >
                  Репозитарій
                </Menu.Item>
              ) : (
                <> </>
              )}
            </SubMenu>
            {userAnnualReportAccess?.CanViewReportsPage &&
            userStatisticsAccess?.CanCityStatisticsFormReport ? (
              <SubMenu
                key="sub2"
                icon={<SnippetsOutlined />}
                title="Звітування та Статистика"
              >
                {(userAnnualReportAccess?.CanViewRegionReportsTable && (
                  <Menu.Item
                    icon={<FileTextOutlined />}
                    onClick={() => {
                      handleClickAway();
                      history.push(`/annualreport/table/country`);
                    }}
                    key="9"
                  >
                    Річні звіти
                  </Menu.Item>
                )) ||
                  (userAnnualReportAccess?.CanViewCityReportsTable && (
                    <Menu.Item
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        handleClickAway();
                        history.push(`/annualreport/table/city`);
                      }}
                      key="9"
                    >
                      Річні звіти
                    </Menu.Item>
                  ))}
                <SubMenu
                  key="sub2.1"
                  icon={<PieChartOutlined />}
                  title="Статистика"
                >
                  <Menu.Item
                    icon={<BarChartOutlined />}
                    onClick={() => {
                      handleClickAway();
                      history.push("/statistics/cities");
                    }}
                    key="10"
                  >
                    Статистика станиць
                  </Menu.Item>
                  <Menu.Item
                    icon={<BarChartOutlined />}
                    onClick={() => {
                      handleClickAway();
                      history.push("/statistics/regions");
                    }}
                    key="11"
                  >
                    Статистика округ
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            ) : userAnnualReportAccess?.CanViewClubReportsTable ? (
              <Menu.Item
                icon={<FileTextOutlined />}
                onClick={() => {
                  handleClickAway();
                  history.push(`/annualreport/table/hovel`);
                }}
                key="16"
              >
                Річні звіти
              </Menu.Item>
            ) : (
              <> </>
            )}
            {userAccesses["aboutBase"] ? (
              <Menu.Item
                onClick={() => {
                  handleClickAway();
                  history.push("/aboutBase");
                }}
                key="17"
                title=""
              >
                <QuestionOutlined />
                Про Базу
              </Menu.Item>
            ) : (
              <> </>
            )}
            {userAccesses["terms"] ? (
              <Menu.Item
                onClick={() => {
                  handleClickAway();
                  history.push("/terms");
                }}
                key="18"
                title=""
              >
                <AlignLeftOutlined />
                Політика конфіденційності
              </Menu.Item>
            ) : (
              <> </>
            )}
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
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
          style={{}}
        ></Button>
      </div>
    </Layout>
  );
};

export default PrivateLayout;
