import React, { useEffect, useRef, useState } from "react";
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
  Card,
} from "antd";
import "./Filter.less";
import { getUsersForTableByPage } from "../../api/adminApi";
import clubsApi from "../../api/clubsApi";
import DropDownUserTable from "./DropDownUserTable";
import Title from "antd/lib/typography/Title";
import ColumnsForUserTable from "./ColumnsForUserTable";
import UserTable from "../../models/UserTable/UserTable";
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
import citiesApi from "../../api/citiesApi";
import userApi from "../../api/UserApi";
import User from "../Distinction/Interfaces/User";
import AuthLocalStorage from "../../AuthLocalStorage";
import jwt_decode from "jwt-decode";
import { Roles } from "../../models/Roles/Roles";
import { useLocation } from "react-router-dom";
import queryString from "querystring";

const UsersTable = () => {
  const [recordObj, setRecordObj] = useState<any>(0);
  const [recordRoles, setRecordRoles] = useState<Array<string>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserTable[]>([]);
  const [updatedUser, setUpdatedUser] = useState<UserTable[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<string>();
  const [cities, setCities] = useState<any>();
  const [regions, setRegions] = useState<any>();
  const [clubs, setClubs] = useState<any>();
  const [degrees, setDegrees] = useState<any>();
  const [searchData, setSearchData] = useState<string>("");
  const [sortKey, setSortKey] = useState<number>(1);
  const [filter, setFilter] = useState<any[]>([]);
  const [dynamicCities, setDynamicCities] = useState<any[]>([]);
  const [dynamicRegions, setDynamicRegions] = useState<any[]>([]);
  const [dynamicClubs, setDynamicClubs] = useState<any[]>([]);
  const [dynamicDegrees, setDynamicDegrees] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [canView, setCanView] = useState<boolean>(false);
  const [tabList, setTabList] = useState<any[]>([]);
  const [, forceUpdate] = useState({});

  const [currentTabName, setCurrentTabName] = useState<string>("");
  const activeUserIsAdmin = useRef(false);

  const cityList = useRef<Array<City>>([]);
  const clubList = useRef<Array<Club>>([]);
  const [isQueryLoaded, setQueryLoaded] = useState(false);

  const [isInactive, setIsInactive] = useState(false);
  const [userArhive, setArhive] = useState();
  const [currentUser, setCurrentUser] = useState<User>();
  const [user, setUser] = useState<UserTable>();
  const [clearFilter, setClearFilter] = useState(false);
  const { SHOW_PARENT } = TreeSelect;
  const { Search } = Input;
  const location = useLocation();
  const queryParams = useRef<any>({});

  useEffect(() => {
    initializePage();
    fetchParametersFromUrl();
    fetchCities();
    fetchClubs();
    fetchRegions();
    fetchDegrees();
    forceUpdate({});
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    page,
    pageSize,
    updatedUser,
    searchData,
    sortKey,
    filter,
    userArhive,
    currentTabName,
    clearFilter,
    isQueryLoaded,
  ]);

  const searchFieldMaxLength: number = 150;

  const fetchCities = async () => {
    try {
      let response = await citiesApi.getCities();
      setCities(
        response.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      );
      cityList.current = response.data;
      getCityFromQuery();
    } catch (error) {
      //don't set value type, check on github will fail
      showError(error.message);
    }
  };

  const fetchRegions = async () => {
    try {
      let response = await regionsApi.getRegionsNames();
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
      //don't set value type, check on github will fail
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
      clubList.current = response.data;
      getClubFromQuery();
    } catch (error) {
      //don't set value type, check on github will fail
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
      //don't set value type, check on github will fail
      showError(error.message);
    }
  };

  const fetchParametersFromUrl = () => {
    // for some reason queryString won't remove the ? at the start
    // of a query, so we have to slice that manually...
    let query = location.search.slice(1, location.search.length);
    let queryParamsArray = queryString.parse(query);

    let params = {
      tab: (queryParamsArray.tab as string) ?? undefined,
      city: parseInt(queryParamsArray.city as string) ?? undefined,
      club: parseInt(queryParamsArray.club as string) ?? undefined,
    };

    // doing this to avoid exception on getClubFromQuery
    form.setFieldsValue({
      locationFilter: [],
    });

    queryParams.current = params;
    getTabFromQuery();
  };

  const getTabFromQuery = () => {
    let acceptableTabs = ["confirmed", "registered", "unconfirmed"];

    let tab = queryParams.current.tab;
    setCurrentTabName(
      tab && acceptableTabs.includes(tab) && activeUserIsAdmin.current
        ? tab
        : "confirmed"
    );
  };

  const getCityFromQuery = () => {
    let city = queryParams.current.city;
    if (city) {
      let cityExists = cityList.current.some((item) => item.id === city);

      if (cityExists) {
        let cityFilter = `value1 ${city}`;

        form.setFieldsValue({
          locationFilter: [cityFilter],
        });

        setDynamicCities([...dynamicCities, city]);
      }
    }
  };

  const getClubFromQuery = () => {
    let club = queryParams.current.club;
    if (club) {
      let clubExists = clubList.current.some((item) => item.id === club);

      if (clubExists) {
        let clubFilter = `value4 ${club}`;

        form.setFieldsValue({
          locationFilter: [...form.getFieldValue("locationFilter"), clubFilter],
        });

        setDynamicClubs([...dynamicClubs, club]);
      }
    }

    setQueryLoaded(true);
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const initializePage = () => {
    let jwt = AuthLocalStorage.getToken() as string;
    let user = jwt_decode(jwt) as any;
    userApi
      .getUserProfileById(user.nameid, user.nameid)
      .then((response) => setCurrentUser(response.data.user));

    let roles = userApi.getActiveUserRoles();
    let rolesThatCanView = [
      Roles.Admin,
      Roles.GoverningBodyAdmin,
      Roles.GoverningBodyHead,
      Roles.OkrugaHead,
      Roles.OkrugaHeadDeputy,
      Roles.CityHead,
      Roles.CityHeadDeputy,
      Roles.KurinHead,
      Roles.KurinHeadDeputy,
      Roles.PlastMember,
      Roles.Supporter,
    ] as string[];

    setCanView(roles.some((v) => rolesThatCanView.includes(v)));

    let userIsAdmin =
      roles.includes(Roles.Admin) ||
      roles.includes(Roles.GoverningBodyAdmin) ||
      roles.includes(Roles.OkrugaHead) ||
      roles.includes(Roles.OkrugaHeadDeputy) ||
      roles.includes(Roles.OkrugaReferentUPS) ||
      roles.includes(Roles.OkrugaReferentUSP) ||
      roles.includes(Roles.OkrugaReferentOfActiveMembership) ||
      roles.includes(Roles.CityHead) ||
      roles.includes(Roles.CityHeadDeputy) ||
      roles.includes(Roles.CityReferentUPS) ||
      roles.includes(Roles.CityReferentUSP) ||
      roles.includes(Roles.CityReferentOfActiveMembership);
    activeUserIsAdmin.current = userIsAdmin;

    let listOfTabs = [
      {
        key: "confirmed",
        tab: "Всі користувачі",
      },
    ];

    if (userIsAdmin) {
      listOfTabs.push(
        {
          key: "registered",
          tab: "Зголошені",
        },
        {
          key: "unconfirmed",
          tab: "Непідтверджені",
        }
      );
    }
    setTabList(listOfTabs);
  };

  const fetchData = async () => {
    if (!(currentTabName && isQueryLoaded)) return;

    try {
      let registeredUsers;

      if (currentTabName === "registered") {
        registeredUsers = new Array<string>();
        registeredUsers.push(Roles.RegisteredUser);
      }

      const response = await getUsersForTableByPage({
        Page: page,
        PageSize: pageSize,
        Cities: dynamicCities,
        Regions: dynamicRegions,
        Clubs: dynamicClubs,
        Degrees: dynamicDegrees,
        Tab: currentTabName,
        SortKey: sortKey,
        FilterRoles: registeredUsers ?? filter,
        SearchData: searchData,
      });

      setUsers(response.data.users);
      setTotal(response.data.total);
      setLoading(true);
    } catch (error) {
      //don't set value type, check on github will fail
      showError(error.message);
    }
  };

  const handleSearch = (e: any) => {
    setPage(1);
    setSearchData(e);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.toLowerCase() === "") {
      setSearchData("");
    }
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
      setDynamicCities([...dynamicCities, e.value.split(" ")[1] as number]);
    } else if (e.value.startsWith("value2")) {
      setDynamicRegions([...dynamicRegions, e.value.split(" ")[1] as number]);
    } else if (e.value.startsWith("value3")) {
      setDynamicDegrees([...dynamicDegrees, e.value.split(" ")[1] as number]);
    } else if (e.value.startsWith("value4")) {
      setDynamicClubs([...dynamicClubs, e.value.split(" ")[1] as number]);
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
      setDynamicCities((prev) =>
        prev.filter((item) => item !== (e.value.split(" ")[1] as number))
      );
    } else if (e.value.includes("value2")) {
      setDynamicRegions((prev) =>
        prev.filter((item) => item !== (e.value.split(" ")[1] as number))
      );
    } else if (e.value.includes("value3")) {
      setDynamicDegrees((prev) =>
        prev.filter((item) => item !== (e.value.split(" ")[1] as number))
      );
    } else if (e.value.includes("value4")) {
      setDynamicClubs((prev) =>
        prev.filter((item) => item !== (e.value.split(" ")[1] as number))
      );
    }
  };

  const getDynamicCities = () => {
    var results = [];
    for (let x = 0; x < cities?.length; x++) {
      results.push(
        <TreeNode value={"value1 " + cities[x].value} title={cities[x].label} />
      );
    }
    return results;
  };

  const getDynamicRegions = () => {
    var results = [];

    for (let x = 0; x < regions?.length; x++) {
      results.push(
        <TreeNode
          value={"value2 " + regions[x].value}
          title={regions[x].label}
        />
      );
    }
    return results;
  };

  const getDynamicDegrees = () => {
    var results = [];
    for (let x = 0; x < degrees?.length; x++) {
      results.push(
        <TreeNode
          value={"value3 " + degrees[x].value}
          title={degrees[x].label}
        />
      );
    }
    return results;
  };

  const getDynamicClubs = () => {
    var results = [];

    for (let x = 0; x < clubs?.length; x++) {
      results.push(
        <TreeNode value={"value4 " + clubs[x].value} title={clubs[x].label} />
      );
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
        d.userCurrentUserRoles += ", " + userRole;
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
    setLoading(false);
    fetchData();
  };

  const onTabChange = (key: string) => {
    setLoading(false);
    setPage(1);
    setPageSize(pageSize);
    setCurrentTabName(key);
  };

  const parseUserRolesString = (roles: string) => {
    return roles !== null ? roles.split(", ") : roles;
  };

  return (
    <Layout.Content
      onClick={() => {
        setShowDropdown(false);
      }}
    >
      <Title level={2}>Таблиця користувачів</Title>
      <Title
        level={4}
        style={{ textAlign: "left", margin: 10 }}
        underline={true}
      >
        Загальна кількість користувачів: {total}
      </Title>
      <div className={classes.searchContainer}>
        {loading ? (
          <div className={classes.filterContainer}>
            <Form form={form} onFinish={handleFilter}>
              <Row className={classes.rowForFilterSearch}>
                <Col className={classes.colForTreeSelect}>
                  <Form.Item
                    name="locationFilter"
                    rules={[
                      {
                        required: true,
                        message: shouldContain("хоча б одну опцію"),
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
                          setClearFilter(!clearFilter);
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
        ) : (
          <div></div>
        )}
        <div className={classes.searchArea}>
          <Search
            placeholder="Пошук"
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
          columns={ColumnsForUserTable({
            sortKey: sortKey,
            setSortKey: setSortKey,
            setFilter: setFilter,
            setPage: setPage,
            filterRole: filter,
            isZgolosheni: currentTabName === "registered"
          })}
          dataSource={users}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                if (record.id && canView)
                  window.open(`/userpage/main/${record.id}`);
              },
              onContextMenu: (event) => {
                event.preventDefault();
                setShowDropdown(false);
                if (canView) {
                  setRecordObj(record.id);
                  setRecordRoles(parseUserRolesString(record.userRoles));
                  setCurrentUserRoles(record.userRoles);
                  setUser(users.find((x) => x.id == record.id));
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
          inActiveTab={isInactive}
          onDelete={handleDelete}
          onChange={handleChange}
          selectedUser={user}
          selectedUserRoles={recordRoles}
          currentUser={currentUser}
          canView={canView}
        />
      </ClickAwayListener>
    </Layout.Content>
  );
};

export default UsersTable;
