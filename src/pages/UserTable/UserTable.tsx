import React, { useEffect, useState } from "react";
import { Table, Input, Layout, Card } from "antd";
import adminApi from "../../api/adminApi";
import DropDownUserTable from "./DropDownUserTable";
import Title from "antd/lib/typography/Title";
import ColumnsForUserTable from "./ColumnsForUserTable";
import UserTable from "../../models/UserTable/UserTable";
import Spinner from "../Spinner/Spinner";
import ClickAwayListener from "react-click-away-listener";
import classes from "./UserTable.module.css";

const UsersTable = () => {
  const [recordObj, setRecordObj] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [users, setUsers] = useState<UserTable[]>([]);
  const [updatedUser, setUpdatedUser] = useState<UserTable[]>([]);
  const [roles, setRoles] = useState<string>();
  const [viewedUsers, setViewedUsers] = useState<UserTable[]>([]);
  const [currentTabName, setCurrentTabName] = useState<string>("confirmed");
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    fetchData();
  }, [updatedUser]);

  const fetchData = async () => {
    await adminApi.getUsersForTable().then((response) => {
      setUsers(response.data);
    });
    setLoading(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value.toLowerCase());
  };

  let filteredData = searchedData
    ? viewedUsers.filter((item) => {
        return Object.values([
          item.regionName,
          item.cityName,
          item.clubName,
          item.userPlastDegreeName,
          item.userRoles,
          item.user.userProfileId,
        ]).find((element) => {
          return String(element).toLowerCase().includes(searchedData);
        });
      })
    : viewedUsers;

  filteredData = filteredData.concat(
    viewedUsers.filter(
      (item) =>
        (item.user.firstName?.toLowerCase()?.includes(searchedData) ||
          item.user.lastName?.toLowerCase()?.includes(searchedData) ||
          item.user.firstName?.includes(searchedData) ||
          item.user.lastName?.includes(searchedData)) &&
        !filteredData.includes(item)
    )
  );

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

  const onTabChange = (key: string) => {
    setCurrentTabName(key);
    switch (key) {
      case "confirmed":
        setIsInactive(false);
        filteredData = users.filter((u) => u.user.emailConfirmed === true);
        break;
      case "interested":
        setIsInactive(false);
        filteredData = users.filter((u) => u.userRoles.includes("Зацікавлений"));
        break;
      case "unconfirmed":
        setIsInactive(true);
        filteredData = users.filter((u) => u.user.emailConfirmed === false);
        break;
      default:
        break;
    }
    setViewedUsers(filteredData);
  };

  useEffect(() => {
    onTabChange("confirmed");
  }, [users]);

  return loading === false ? (
    <Spinner />
  ) : (
    <Layout.Content
      onClick={() => {
        setShowDropdown(false);
      }}
    >
      <Title level={2}>Таблиця користувачів</Title>
      <div className={classes.searchContainer}>
        <Input placeholder="Пошук" onChange={handleSearch} allowClear />
      </div>
      <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={currentTabName}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        <Table
          className={classes.table}
          bordered
          rowKey="id"
          scroll={{ x: 1450 }}
          columns={ColumnsForUserTable}
          dataSource={filteredData}
          onRow={(record) => {
            return {
              onClick: () => {
                setShowDropdown(false);
              },
              onContextMenu: (event) => {
                event.preventDefault();
                setShowDropdown(true);
                setRecordObj(record.user.id);
                setRoles(record.userRoles);
                setX(event.pageX);
                setY(event.pageY);
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
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
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
          roles={roles}
          inActiveTab={isInactive}
        />
      </ClickAwayListener>
    </Layout.Content>
  );
};
export default UsersTable;
