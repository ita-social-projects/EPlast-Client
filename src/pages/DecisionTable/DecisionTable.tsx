import React, { useEffect, useState } from "react";
import { Table, Button, Layout } from "antd";
import ClickAwayListener from "react-click-away-listener";
import jwtDecode from "jwt-decode";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import DropDown from "./DropDownDecision";
import decisionsApi, { Decision } from "../../api/decisionsApi";
import Spinner from "../Spinner/Spinner";
import AuthLocalStorage from "../../AuthLocalStorage";
import { DecisionTableInfo } from "./Interfaces/DecisionTableInfo";
import { Roles } from "../../models/Roles/Roles";
import classes from "./Table.module.css";
import FormAddDecision from "./FormAddDecision";

const { Content } = Layout;

const DecisionTable = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [recordCreator, setRecordCreator] = useState<string>("");
  const [data, setData] = useState<DecisionTableInfo[]>(Array<DecisionTableInfo>());
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [addDecisionModalVisible, setAddDecisionModalVisible] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const count = data[0]?.count ?? 0;
  const rolesUrl: string = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";



  const fetchData = async () => {
    const jwt = jwtDecode(AuthLocalStorage.getToken() ?? "") as any;
    setRoles(jwt[rolesUrl]);

    const res: DecisionTableInfo[] = await decisionsApi.getAllDecisionsForTable(searchString, page, pageSize);

    setData(res);
  };

  const handleDelete = () => {
    setDataLoaded(false);
    if (page !== 1 && data.length === 1) setPage(page - 1);
    else fetchData();
  };

  const handleEdit = (
    id: number,
    name: string,
    description: string,
    statusType: string
  ) => {
    setDataLoaded(false);
    const filteredData = data.map(d => {
      if (d.id === id) {
        return {
          ...d,
          name,
          description,
          decisionStatusType: statusType,
        }
      }
      return d;
    });
    setData([...filteredData]);
  };

  const handleAdd = async () => {
    setDataLoaded(false);
    if (page !== 1) {
      setPage(1);
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
    setDataLoaded(true);
  }, [searchString, page, pageSize, dataLoaded]);

  const handleSearch = (value: string) => {
    if (value.trim() !== searchString) {
      setPage(1);
      setSearchString(value.trim());
    }
  };

  return (<Layout>
    <Content
      onClick={() => setShowDropdown(false)}
    >
      <h1 className={classes.titleTable}>Рішення керівних органів</h1>
      <div className={classes.searchContainer}>
        {[
          Roles.Admin,
          Roles.GoverningBodyAdmin,
          Roles.OkrugaHead,
          Roles.OkrugaHeadDeputy,
          Roles.CityHead,
          Roles.CityHeadDeputy,
          Roles.KurinHead,
          Roles.KurinHeadDeputy
        ].some(r => roles.includes(r))
          ? <Button type="primary" onClick={() => setAddDecisionModalVisible(true)}>
            Додати рішення
          </Button>
          : null
        }
        <Search
          enterButton
          placeholder="Пошук"
          allowClear
          onSearch={handleSearch}
        />
      </div>
      {dataLoaded
        ? <Table
          className={classes.table}
          dataSource={data}
          scroll={{ x: 1300 }}
          columns={columns}
          bordered
          rowKey="id"
          onRow={(record: Decision) => {
            return {
              onClick: () => {
                setShowDropdown(false);
              },
              onContextMenu: (event) => {
                event.preventDefault();
                setShowDropdown(true);
                setRecordCreator(record.userId);
                setRecordObj(record.id);
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
            current: page,
            pageSize,
            total: count,
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
            onChange: (p: number) => setPage(p),
            onShowSizeChange: (p: number, ps: number = 10) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
        : <Spinner />}
      <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
        <DropDown
          showDropdown={showDropdown}
          record={recordObj}
          recordCreatorId={recordCreator}
          pageX={x}
          pageY={y}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ClickAwayListener>
      <FormAddDecision
        setModalVisible={setAddDecisionModalVisible}
        modalVisible={addDecisionModalVisible}
        onSubmit={handleAdd}
      />
    </Content>
  </Layout>);
};

export default DecisionTable;
