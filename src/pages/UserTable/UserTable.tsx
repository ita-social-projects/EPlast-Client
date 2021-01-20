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
  const [updatedUser, setUpdatedUser] = useState<UserTable[]>([]);
  const [users, setUsers] = useState<UserTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [viewedUsers, setViewedUsers] = useState<UserTable[]>([]);
  const [noTitleKey, setKey] = useState<string>("confirmed");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [roles, setRoles] = useState<string>();

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
    onTabChange(noTitleKey);
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
    const usersAfterDeleting = users.filter((d: any) => d.id !== id);
    setUsers([...usersAfterDeleting]);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleChange = (id: string, userRole: string) => {
    const usersAfterRoleChanging = users.filter((d: any) => {
      if (d.id === id) {
        d.userRoles += ", " + userRole;
      }
      return d;
    });
    setUpdatedUser([...usersAfterRoleChanging]);
    setUsers([...usersAfterRoleChanging]);
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
    setKey(key);
    key == "confirmed"
      ? (filteredData = users.filter((u) => u.user.emailConfirmed == true))
      : key == "interested"
      ? (filteredData = users.filter((u) =>
          u.userRoles.includes("Зацікавлений")
        ))
      : (filteredData = users.filter((u) => u.user.emailConfirmed == false));

    setViewedUsers(
      key == "confirmed"
        ? users.filter((u) => u.user.emailConfirmed == true)
        : key == "interested"
        ? users.filter((u) => u.userRoles.includes("Зацікавлений"))
        : users.filter((u) => u.user.emailConfirmed == false)
    );
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
        activeTabKey={noTitleKey}
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
        />
      </ClickAwayListener>
    </Layout.Content>
  );
};
export default UsersTable;
