import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Layout,
  Row,
  Col,
  Button,
  TreeSelect,
  Modal,
  Form,
  Card
} from "antd";
import "./Filter.less";
import { getUsersForTableByPage } from "../../api/adminApi";
import clubsApi from "../../api/clubsApi";
import DropDownUserTable from "./DropDownUserTable";
import Title from "antd/lib/typography/Title";
import ColumnsForUserTable from "./ColumnsForUserTable";
import UserTable from "../../models/UserTable/UserTable";
import Spinner from "../Spinner/Spinner";
import ClickAwayListener from "react-click-away-listener";
import { TreeNode } from "antd/lib/tree-select";
import City from "../Statistics/Interfaces/City";
import activeMembershipApi, {
  PlastDegree,
} from "../../api/activeMembershipApi";
import regionsApi from "../../api/regionsApi";
import Region from "../Statistics/Interfaces/Region";
import Club from "../AnnualReport/Interfaces/Club";
import { shouldContain } from "../../components/Notifications/Messages";
import classes from "./UserTable.module.css";
import citiesApi from "../../api/citiesApi"
import userApi from "../../api/UserApi";
import User from "../Distinction/Interfaces/User";
import AuthStore from "../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import { Roles } from "../../models/Roles/Roles";

const UsersTable = () => {
  const [recordObj, setRecordObj] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserTable[]>([]);
  const [updatedUser, setUpdatedUser] = useState<UserTable[]>([]);
  const [roles, setRoles] = useState<string>();
  const [cities, setCities] = useState<any>();
  const [regions, setRegions] = useState<any>();
  const [clubs, setClubs] = useState<any>();
  const [degrees, setDegrees] = useState<any>();
  const [searchData, setSearchData] = useState<string>("");
  const [sortKey, setSortKey] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [dynamicCities, setDynamicCities] = useState<any[]>([]);
  const [dynamicRegions, setDynamicRegions] = useState<any[]>([]);
  const [dynamicClubs, setDynamicClubs] = useState<any[]>([]);
  const [dynamicDegrees, setDynamicDegrees] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [canView, setCanView] = useState<boolean>(false);
  const [, forceUpdate] = useState({});
  const [currentTabName, setCurrentTabName] = useState<string>("confirmed");
  const [isInactive, setIsInactive] = useState(false);
  const [userArhive, setArhive] = useState();
  const [currentUser, setCurrentUser] = useState<User>();
  const [user, setUser] = useState<UserTable>();
  const { SHOW_PARENT } = TreeSelect;
  const { Search } = Input;

  useEffect(() => {
    fetchData();
  }, [page, pageSize, updatedUser, searchData, sortKey, filter, userArhive, currentTabName]);

  useEffect(() => {
    fetchCities();
    fetchRegions();
    fetchClubs();
    fetchDegrees();
    forceUpdate({});
  }, []);

  const searchFieldMaxLength: number = 200;

  const fetchCities = async () => {
    try {
      let response = await citiesApi.getCities();
      let cities = response.data as City[];
      setCities(cities.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      }))
    } catch (error) {
      showError(error.message);
    }
  };
  const fetchRegions = async () => {
    try {
      let response = await regionsApi.getRegions();
      let regions = response.data as Region[];
      setRegions(
        regions.map((item) => {
          return {
            label: item.regionName,
            value: item.id,
          };
        })
      );
    } catch (error) {
      showError(error.message);
    }
  };
  const fetchClubs = async () => {
    try {
      let response = await clubsApi.getClubs();
      let clubs = response.data as Club[];
      setClubs(
        clubs.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      );
    } catch (error) {
      showError(error.message);
    }
  };
  const fetchDegrees = async () => {
    try {
      let response = await activeMembershipApi.getAllPlastDegrees();
      let degrees = response as PlastDegree[];
      setDegrees(
        degrees.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const fetchData = async () => {
    setLoading(false);
    try {
      const response = await getUsersForTableByPage({
        Page: page,
        PageSize: pageSize,
        Cities: dynamicCities,
        Regions: dynamicRegions,
        Clubs: dynamicClubs,
        Degrees: dynamicDegrees,
        Tab: currentTabName,
        SortKey: sortKey,
        FilterRoles: filter,
        SearchData: searchData
      });
      let jwt = AuthStore.getToken() as string;
      let user = jwt_decode(jwt) as any;
      setCurrentUser((await userApi.getUserProfileById(user.nameid, user.nameid)).data.user);
      let roles = userApi.getActiveUserRoles();
      setCanView(roles.includes(Roles.Admin) || roles.includes(Roles.GoverningBodyHead)
        || roles.includes(Roles.OkrugaHead) || roles.includes(Roles.OkrugaHeadDeputy)
        || roles.includes(Roles.CityHead) || roles.includes(Roles.CityHeadDeputy)
        || roles.includes(Roles.KurinHead) || roles.includes(Roles.KurinHeadDeputy)
        || roles.includes(Roles.PlastMember)
        || roles.includes(Roles.Supporter));
      setUsers(response.data.users);
      setTotal(response.data.total);
    } finally {
      setLoading(true);
    }
  };

  const handleSearch = (e: any) => {
    setPage(1)
    setSearchData(e);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.toLowerCase() === '') {
      setSearchData('')
    };
  };

  const onSelect = (selectedKeys: any, e: any) => {
    if (e.value == 0) {
      setDynamicRegions([-10]);
    } else if (e.value == 1) {
      setDynamicCities([-1]);
    } else if (e.value == 2) {
      setDynamicClubs([-2]);
    } else if (e.value == 3) {
      setDynamicDegrees([-3]);
    } else if (e.value.startsWith("value1")) {
      setDynamicCities([...dynamicCities, e.value.split(' ')[1] as number]);
    } else if (e.value.startsWith("value2")) {
      setDynamicRegions([...dynamicRegions, e.value.split(' ')[1] as number]);
    } else if (e.value.startsWith("value3")) {
      setDynamicDegrees([...dynamicDegrees, e.value.split(' ')[1] as number]);
    } else if (e.value.startsWith("value4")) {
      setDynamicClubs([...dynamicClubs, e.value.split(' ')[1] as number]);
    }
  };

  const ondeSelect = (selectedKeys: any, e: any) => {
    if (e.value == 0) {
      setDynamicRegions((prev) => prev.filter((item) => item !== -10));
    } else if (e.value == 1) {
      setDynamicCities((prev) => prev.filter((item) => item !== -1));
    } else if (e.value == 2) {
      setDynamicClubs((prev) => prev.filter((item) => item !== -2));
    } else if (e.value == 3) {
      setDynamicDegrees((prev) => prev.filter((item) => item !== -3));
    } else if (e.value.includes("value1")) {
      setDynamicCities((prev) => prev.filter((item) => item !== e.value.split(' ')[1] as number));
    } else if (e.value.includes("value2")) {
      setDynamicRegions((prev) => prev.filter((item) => item !== e.value.split(' ')[1] as number));
    } else if (e.value.includes("value3")) {
      setDynamicDegrees((prev) => prev.filter((item) => e.value.split(' ')[1] as number));
    } else if (e.value.includes("value4")) {
      setDynamicClubs((prev) => prev.filter((item) => e.value.split(' ')[1] as number));
    }
  };

  const getDynamicCities = () => {
    var results = [];
    for (let x = 0; x < cities?.length; x++) {
      results.push(<TreeNode value={"value1 " + cities[x].value} title={cities[x].label} />);
    }
    return results;
  };

  const getDynamicRegions = () => {
    var results = [];

    for (let x = 0; x < regions?.length; x++) {
      results.push(<TreeNode value={"value2 " + regions[x].value} title={regions[x].label} />);
    }
    return results;
  };

  const getDynamicDegrees = () => {
    var results = [];
    for (let x = 0; x < degrees?.length; x++) {
      results.push(<TreeNode value={"value3 " + degrees[x].value} title={degrees[x].label} />);
    }
    return results;
  };

  const getDynamicClubs = () => {
    var results = [];

    for (let x = 0; x < clubs?.length; x++) {
      results.push(<TreeNode value={"value4 " + clubs[x].value} title={clubs[x].label} />);
    }
    return results;
  };

  const handleDelete = (id: string) => {
    fetchData();
    const filteredData = users.filter((d: any) => d.id !== id);
    setUsers([...filteredData]);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleChange = (id: string, userRole: string) => {
    const filteredData = users.filter((d: any) => {
      if (d.id === id) {
        d.userRoles += ", " + userRole;
      }
      return d;
    });
    setUpdatedUser([...filteredData]);
    setUsers([...filteredData]);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    setCurrentTabName(currentTabName);
    setShowDropdown(false);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleFilter = async () => {
    setPage(1);
    setCurrentTabName(currentTabName);
    if (
      dynamicCities.length == 0 &&
      dynamicRegions.length == 0 &&
      dynamicClubs.length == 0 &&
      dynamicRegions.length == 0
    ) {
      fetchData();
    } else {
      setLoading(false);
      try {
        let response = await getUsersForTableByPage({
          Page: page,
          PageSize: pageSize,
          Cities: dynamicCities,
          Regions: dynamicRegions,
          Clubs: dynamicClubs,
          Degrees: dynamicDegrees,
          Tab: currentTabName,
          SortKey: sortKey,
          SearchData: searchData
        });
        setUsers(response.data.users);
        setTotal(response.data.total);
      } finally {
        setLoading(true);
      }
    }
  };

  const tabList = [
    {
      key: "confirmed",
      tab: "Всі користувачі",
    },
    {
      key: "interested",
      tab: "Зацікавлені",
    },
    {
      key: "unconfirmed",
      tab: "Непідтверджені",
    },
  ];

  const onTabChange = async (key: string) => {
    setPage(page);
    setPageSize(pageSize);
    setCurrentTabName(key);
  };

  return (
    <Layout.Content onClick={() => { setShowDropdown(false); }}>
      <Title level={2}>Таблиця користувачів</Title>
      <Title level={4} style={{ textAlign: "left", margin: 10 }} underline={true}>Загальна кількість користувачів: {total}</Title>
      <div className={classes.searchContainer}>
        <div className={classes.filterContainer}>
          <Form form={form} onFinish={handleFilter}>
            <Row className={classes.rowForFilterSearch}>
              <Col className={classes.colForTreeSelect}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: shouldContain("хоча б одна опція"),
                      type: "array",
                    },
                  ]}
                >
                  <TreeSelect
                    placeholder="Фільтр"
                    maxTagCount={2}
                    showSearch
                    multiple
                    onDeselect={ondeSelect}
                    onSelect={onSelect}
                    treeCheckable={true}
                    showCheckedStrategy={SHOW_PARENT}
                    filterTreeNode={(input, option) =>
                      (option?.title as string)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear
                    onChange={(event: any) => {
                      if (event.length == 0) {
                        setDynamicRegions([]);
                        setDynamicCities([]);
                        setDynamicClubs([]);
                        setDynamicDegrees([]);
                      }
                    }}
                  >
                    <TreeNode value={0} title="Всі округи">
                      {getDynamicRegions()}
                    </TreeNode>
                    <TreeNode value={1} title="Всі станиці">
                      {getDynamicCities()}
                    </TreeNode>
                    <TreeNode value={2} title="Всі курені">
                      {getDynamicClubs()}
                    </TreeNode>
                    <TreeNode value={3} title="Всі ступені УПС/УСП">
                      {getDynamicDegrees()}
                    </TreeNode>
                  </TreeSelect>
                </Form.Item>
              </Col>
              <Col className={classes.colForButton}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={classes.okButton}
                  >
                    OK
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={classes.searchArea}>
          <Search placeholder="Пошук"
            allowClear
            enterButton
            maxLength={searchFieldMaxLength}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <Card
        className={classes.card}
        tabList={tabList}
        activeTabKey={currentTabName}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        <Table
          loading={!loading}
          className={classes.table}
          bordered
          rowKey="id"
          scroll={{ x: 1450 }}
          columns={ColumnsForUserTable(
            {
              sortKey: sortKey,
              setSortKey: setSortKey,
              setFilter: setFilter,
              filterRole: filter,
            })}
          dataSource={users}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                if (record.id && canView) window.open(`/userpage/main/${record.id}`);
              },
              onContextMenu: (event) => {
                event.preventDefault();
                setShowDropdown(false);
                if (canView) {
                  setRecordObj(record.id);
                  setRoles(record.userRoles);
                  setUser(users.find(x => x.id == record.id));
                  setX(event.pageX);
                  setY(event.pageY);
                  setShowDropdown(true);
                }
              },
            };
          }}
          onChange={(pagination) => {
            if (pagination) {
              window.scrollTo({
                left: 0,
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
            onChange: (page) => handlePageChange(page),
            onShowSizeChange: (page, size) => handleSizeChange(page, size),
          }}
        />
      </Card>
      <ClickAwayListener onClickAway={handleClickAway}>
        <DropDownUserTable
          showDropdown={showDropdown}
          record={recordObj}
          pageX={x}
          pageY={y}
          onDelete={handleDelete}
          onChange={handleChange}
          user={user}
          roles={roles}
          inActiveTab={isInactive}
          currentUser={currentUser}
          canView={canView}
        />
      </ClickAwayListener>
    </Layout.Content>
  );
};
export default UsersTable;