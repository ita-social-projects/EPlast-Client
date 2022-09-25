import { Table, Layout } from "antd";
import AuthLocalStorage from "../../../AuthLocalStorage";
import ClickAwayListener from "react-click-away-listener";
import columns from "./columns";
import DropDownRenewalTable from "./DropDownRenewalTable";
import jwt_decode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import Search from "antd/lib/input/Search";
import Spinner from "../../Spinner/Spinner";
import Title from "antd/lib/typography/Title";
import UserApi from "../../../api/UserApi";
import userRenewalsApi from "../../../api/userRenewalsApi";
import UserRenewalTableData from "../Types/UserRenewalTableData";
import User from "../../../models/UserTable/User";

interface Properties {
  currentUser: any;
  
  searchQuery: string;
  setTotal: any;

  hidden: boolean;
  relativePosition: [number, number];
}

const UserRenewalTable = (props: Properties) => {
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
      comment: "",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [recordObj, setRecordObj] = useState<number>(0);
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [cityId, setCityId] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [updateTable, setUpdateTable] = useState<boolean>(false);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [localTotal, setLocalTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const getRenewals = async () => {
    setLoading(true);
    const data: UserRenewalTableData[] = await userRenewalsApi.getUserRenewalsTableData(
      searchQuery,
      page,
      pageSize
    );
    setSubtotal(data[0]?.subtotal);
    if (!props.hidden) props.setTotal(data[0]?.subtotal ?? 0);
    setLocalTotal(data[0]?.subtotal ?? 0);
    setUserRenewals(data);
    setLoading(false);
  };

  const getUser = async () => {
    setcurrentCityAdmin(props.currentUser?.cityId);
    let roles = UserApi.getActiveUserRoles();
    setCurrentRole(roles);
  };

  useEffect(() => {
    getUser();
  }, [props.currentUser]);

  useEffect(() => {
    if (props.hidden) {
      handleSizeChange(1);
      return;
    }
    getRenewals();
  }, [searchQuery, page, pageSize, updateTable, props.hidden]);

  useEffect(() => {
    if (searchQuery != props.searchQuery) { 
      setPage(1)
    };
    setSearchQuery(props.searchQuery)
  }, [props.searchQuery])

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
    setSelectedRow(-1);
  };

  const handleConfirm = () => {
    setUpdateTable(!updateTable);
  };

  return (
    <>
      <Table
        style={props.hidden ? {display: "none"} : {}}
        rowClassName={(record, index) => index === selectedRow ? classes.selectedRow : ""}
        loading={loading}
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
              setX(event.pageX - props.relativePosition[0]);
              setY(event.pageY - props.relativePosition[1]);
              setSelectedRow(index as number);
            },
          };
        }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: localTotal,
          showLessItems: true,
          responsive: true,
          showSizeChanger: true,
          onChange: (page) => handlePageChange(page),
          onShowSizeChange: (page, size) => handleSizeChange(page, size),
        }}
        bordered
        rowKey="id"
      />
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
    </>
  );
};

export default UserRenewalTable;
