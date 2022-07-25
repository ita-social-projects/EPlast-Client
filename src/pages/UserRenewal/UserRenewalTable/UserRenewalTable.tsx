import { Table, Layout } from "antd";
import AuthLocalStorage from "../../../AuthLocalStorage";
import ClickAwayListener from "react-click-away-listener";
import columns from "./columns";
import DropDownRenewalTable from "./DropDownRenewalTable";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Search from "antd/lib/input/Search";
import Spinner from "../../Spinner/Spinner";
import Title from "antd/lib/typography/Title";
import UserApi from "../../../api/UserApi";
import userRenewalsApi from "../../../api/userRenewalsApi";
import UserRenewalTableData from "../Types/UserRenewalTableData";

const { Content } = Layout;

const UserRenewalTable = () => {
  const classes = require("./Table.module.css");
  const [currentCityAdmin, setcurrentCityAdmin] = useState<number>(0);
  const [currentRole, setCurrentRole] = useState<string[]>([]);
  const [userRenewals, setUserRenewals] = useState<UserRenewalTableData[]>([
    {
      id: 0,
      subtotal: 0,
      total: 0,
      userId: "",
      userName: "",
      cityId: 0,
      cityName: "",
      regionName: "",
      requestDate: new Date(),
      email: "",
      approved: false,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [recordObj, setRecordObj] = useState<number>(0);
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [cityId, setCityId] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [updateTable, setUpdateTable] = useState<boolean>(false);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  const getRenewals = async () => {
    setLoading(true);
    const data: UserRenewalTableData[] = await userRenewalsApi.getUserRenewalsTableData(
      searchedData,
      page,
      pageSize
    );
    setSubtotal(data[0]?.subtotal);
    setTotal(data[0]?.total);
    setUserRenewals(data);
    setLoading(false);
  };

  const getUser = async () => {
    let jwt = AuthLocalStorage.getToken() as string;
    let user = jwt_decode(jwt) as any;
    setcurrentCityAdmin(
      (await UserApi.getUserProfileById(user.nameid, user.nameid)).data.user
        .cityId
    );
    let roles = UserApi.getActiveUserRoles();
    setCurrentRole(roles);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getRenewals();
  }, [searchedData, page, pageSize, updateTable]);

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.toLowerCase() === "") setSearchedData("");
  };

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
    setSelectedRow(-1);
  };

  const handleConfirm = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <Layout>
      <Content>
        <Title level={2} style={{ marginTop: 50, textAlign: "center" }}>
          Запити на відновлення статусу
        </Title>
        <div className={classes.searchContainer}>
          <Search
            enterButton
            placeholder="Пошук"
            allowClear
            maxLength={30}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <Title level={4} style={{ textAlign: "right" }} underline={true}>
              Кількість запитів: {subtotal} / {total}
            </Title>
            <Table
              rowClassName={(record, index) => index === selectedRow ? classes.selectedRow : ""}
              className={classes.table}
              dataSource={userRenewals}
              columns={columns}
              scroll={{ x: 1300 }}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    handleClickAway();
                  },
                  onContextMenu: (event) => {
                    event.preventDefault();
                    setShowDropdown(true);
                    setRecordObj(record.id);
                    setUserId(record.userId);
                    setCityId(record.cityId);
                    setIsRecordActive(record.approved);
                    setX(event.pageX);
                    setY(event.pageY);
                    setSelectedRow(index as number);
                  },
                };
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
              bordered
              rowKey="id"
            />
          </div>
        )}
        <ClickAwayListener onClickAway={handleClickAway}>
          <DropDownRenewalTable
            showDropdown={showDropdown}
            id={recordObj}
            userId={userId}
            cityId={cityId}
            isRecordActive={isRecordActive}
            pageX={x}
            pageY={y}
            roles={currentRole}
            currentCity={currentCityAdmin}
            onConfirm={handleConfirm}
          />
        </ClickAwayListener>
      </Content>
    </Layout>
  );
};

export default UserRenewalTable;
