import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Table,
  TreeSelect,
} from "antd";
import { TreeNode } from "antd/lib/tree-select";
import Title from "antd/lib/typography/Title";
import jwt_decode from "jwt-decode";
import queryString from "querystring";
import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useLocation } from "react-router-dom";
import activeMembershipApi, {
  PlastDegree,
} from "../../api/activeMembershipApi";
import { getUsersForTableByPage } from "../../api/adminApi";
import citiesApi from "../../api/citiesApi";
import clubsApi from "../../api/clubsApi";
import regionsApi from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import AuthLocalStorage from "../../AuthLocalStorage";
import { shouldContain } from "../../components/Notifications/Messages";
import { Roles } from "../../models/Roles/Roles";
import User from "../../models/UserTable/User";
import UserTable from "../../models/UserTable/UserTable";
import Club from "../AnnualReport/Interfaces/Club";
import City from "../Statistics/Interfaces/City";
import Region from "../Statistics/Interfaces/Region";
import UserRenewalTable from "../UserRenewal/UserRenewalTable/UserRenewalTable";
import { useUserTableStore } from "../../stores/UserTableStore";
import ColumnsForUserTable from "./ColumnsForUserTable";
import DropDownUserTable from "./DropDownUserTable";
import "./Filter.less";
import classes from "./UserTable.module.css";

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
  const [form] = Form.useForm();
  const [canView, setCanView] = useState<boolean>(false);
  const [tabList, setTabList] = useState<any[]>([]);
  const [, forceUpdate] = useState({});

  const [currentTabName, setCurrentTabName] = useState<string>("");
  const activeUserIsAdmin = useRef(false);

  const cityList = useRef<Array<City>>([]);
  const clubList = useRef<Array<Club>>([]);
  // isQueryLoaded [<true if cities are loaded>, <true if clubs are loaded>]
  const [isQueryLoaded, setQueryLoaded] = useState<[boolean, boolean]>([
    false,
    false,
  ]);

  const [userArhive, setArhive] = useState();
  const [currentUser, setCurrentUser] = useState<User>();
  const [user, setUser] = useState<UserTable>();
  const [clearFilter, setClearFilter] = useState(false);
  const { SHOW_PARENT } = TreeSelect;
  const { Search } = Input;
  const location = useLocation();
  const queryParams = useRef<any>({});
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const tableBody = useRef<HTMLDivElement>(null);
  const [state, actions] = useUserTableStore();

  useEffect(() => {
    initializePage();
    fetchParametersFromUrl();
    fetchCities();
    fetchClubs();
    fetchRegions();
    fetchDegrees();
    forceUpdate({});
    return () => {actions.clearState();} 
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
    if (state.dynamicCities) {
      let city = state.dynamicCities[0];
      let cityExists = cityList.current.some((item) => item.id === city);

      if (cityExists) {
        let cityFilter = `city ${city}`;

        form.setFieldsValue({
          locationFilter: [cityFilter],
        });

        setDynamicCities([...dynamicCities, city]);
      }
    }
    setQueryLoaded((prev) => [true, prev[1]]);
  };

  const getClubFromQuery = () => {
    if (state.dynamicClubs) {
      let club = state.dynamicClubs[0];
      let clubExists = clubList.current.some((item) => item.id === club);

      if (clubExists) {
        let clubFilter = `club ${club}`;

        form.setFieldsValue({
          locationFilter: [...form.getFieldValue("locationFilter"), clubFilter],
        });

        setDynamicClubs([...dynamicClubs, club]);
      }
    }
    setQueryLoaded((prev) => [prev[0], true]);
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
      .getUserProfileById(user.nameid)
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
        },
        {
          key: "renewals",
          tab: "Очікують на відновлення членства",
        }
      );
    }
    setTabList(listOfTabs);
  };

  const fetchData = async () => {
    if (!(currentTabName && isQueryLoaded[0] && isQueryLoaded[1])) return;
    if (currentTabName === "renewals") return;

    try {
      const response = await getUsersForTableByPage({
        Page: page,
        PageSize: pageSize,
        Cities: state.dynamicCities,
        Regions: state.dynamicRegions,
        Clubs: state.dynamicClubs,
        Degrees: state.dynamicDegrees,
        Tab: currentTabName,
        SortKey: sortKey,
        FilterRoles: filter,
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
      actions.setRegions([-10]);
    } else if (e.value == 1) {
      actions.setCities([-1]);
    } else if (e.value == 2) {
      actions.setClubs([-2]);
    } else if (e.value == 3) {
      actions.setRegions([-3]);
    } else if (e.id.startsWith("city")) {
      actions.addDynamicCities(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("region")) {
      actions.addDynamicRegions(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("degree")) {
      actions.addDynamicDegrees(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("club")) {
      actions.addDynamicClubs(parseInt(e.value.split(" ")[1]));
    }
    console.log(state.dynamicCities);
  };

  const ondeSelect = (selectedKeys: any, e: any) => {
    if (e.value == 0) {
      actions.removeDynamicRegions(-10);
    } else if (e.value == 1) {
      actions.removeDynamicCities(-1);
    } else if (e.value == 2) {
      actions.removeDynamicClubs(-2);
    } else if (e.value == 3) {
      actions.removeDynamicDegrees(-3);
    } else if (e.id.startsWith("city")) {
      actions.removeDynamicCities(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("region")) {
      actions.removeDynamicRegions(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("degree")) {
      actions.removeDynamicDegrees(parseInt(e.value.split(" ")[1]));
    } else if (e.id.startsWith("club")) {
      actions.removeDynamicClubs(parseInt(e.value.split(" ")[1]));
    }
  };
  //change value
  const getDynamicCities = () => {
    var results = [];
    for (let x = 0; x < cities?.length; x++) {
      results.push(
        <TreeNode 
          id={'city_' + cities[x].value}
          value={"city " + cities[x].value}
          title={cities[x].label} />
      );
    }
    return results;
  };

  const getDynamicRegions = () => {
    var results = [];

    for (let x = 0; x < regions?.length; x++) {
      results.push(
        <TreeNode
          id={'region_' + regions[x].value}
          value={"region " + regions[x].value}
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
          id={'degree_' + degrees[x].value}
          value={"degree " + degrees[x].value}
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
        <TreeNode
          id={'club_' + clubs[x].value} 
          value={"club " + clubs[x].value} 
          title={clubs[x].label} 
        />
      );
    }
    return results;
  };

  const handleDelete = (id: string) => {
    const filteredData = users.filter((d: any) => d.id !== id);
    setUsers([...filteredData]);
    fetchData();
  };

  const handleClickAway = () => {
    setShowDropdown(false);
    setSelectedRow(-1);
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
    fetchData();
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

      <div ref={tableBody}>
        <Card
          className={classes.card}
          tabList={tabList}
          activeTabKey={currentTabName}
          onTabChange={(key) => {
            onTabChange(key);
          }}
        >
          <UserRenewalTable
            searchQuery={searchData}
            hidden={currentTabName !== "renewals"}
            setTotal={setTotal}
            relativePosition={[
              tableBody.current?.offsetLeft as number,
              tableBody.current?.offsetTop as number,
            ]}
            currentUser={currentUser}
          />
          <Table
            style={currentTabName === "renewals" ? { display: "none" } : {}}
            rowClassName={(record, index) =>
              index === selectedRow ? classes.selectedRow : ""
            }
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
              isZgolosheni: currentTabName === "registered",
              page: page,
              pageSize: pageSize,
            })}
            dataSource={users}
            onRow={(record, index) => {
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
                    setX(
                      event.pageX - (tableBody.current?.offsetLeft as number)
                    );
                    setY(
                      event.pageY - (tableBody.current?.offsetTop as number)
                    );
                    setShowDropdown(true);
                    setSelectedRow(index as number);
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
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownUserTable
              offsetTop={tableBody.current?.offsetTop as number}
              offsetLeft={tableBody.current?.offsetLeft as number}
              showDropdown={showDropdown}
              record={recordObj}
              pageX={x}
              pageY={y}
              inActiveTab={currentTabName === "confirmed"}
              onDelete={handleDelete}
              onChange={handleChange}
              selectedUser={user}
              selectedUserRoles={recordRoles}
              currentUser={currentUser}
              canView={canView}
            />
          </ClickAwayListener>
        </Card>
      </div>
    </Layout.Content>
  );
};

export default UsersTable;
