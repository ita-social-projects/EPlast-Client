import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Layout, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import ClickAwayListener from "react-click-away-listener";
import PrecautionStore from "../../../stores/StorePrecaution";
import "./Filter.less";
import { createHook } from "react-sweet-state";
import AddPrecautionModal from "./AddPrecautionModal";
import { getUserPrecautionStatusStr } from "../Interfaces/UserPrecautionStatus";
import { useLocation } from "react-router-dom";
import queryString from "querystring";

const { Content } = Layout;

const PrecautionTable = () => {
  const classes = require("./Table.module.css");

  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();
  const location = useLocation();
  const queryParams = useRef<any>({});

  useEffect(() => {
    fetchParametersFromUrl();
  }, []);

  useEffect(() => {
    actions.handleGetPrecautionTable();
  }, [
    state.sortByOrder,
    state.statusSorter,
    state.precautionNameSorter,
    state.dateSorter,
    state.searchedData,
    state.page,
    state.pageSize,
  ]);

  const fetchParametersFromUrl = () => {
    let query = location.search.slice(1, location.search.length);
    let queryParamsArray = queryString.parse(query);

    let params = {
      userName: (queryParamsArray.name as string) ?? "",
    };

    queryParams.current = params;
    actions.handleSearchPrecautionTable(queryParams.current.userName);
  };

  return (
    <Layout>
      <Content
        onClick={() => {
          actions.setShowDropdown(false, -1);
        }}
      >
        <h1 className={classes.titleTable}>Перестороги</h1>
        <>
          <Row gutter={[6, 12]} className={classes.buttonsSearchField}>
            <Col>
              {state.userAccess["AddPrecaution"] === true ? (
                <>
                  <Button type="primary" onClick={actions.showModalPrecautionTable}>
                    Додати пересторогу
                  </Button>
                </>
              ) : null}
            </Col>
            <Col>
              <Search
                enterButton
                value={state.searchedData}
                placeholder="Пошук"
                allowClear
                onChange={actions.handleSearchChangePrecautionTable}
                onSearch={actions.handleSearchPrecautionTable}
              />
            </Col>
          </Row>
          {
            <div>
              <Table
                rowClassName={(record, index) => index === state.selectedRow ? classes.selectedRow : null}
                className={classes.table}
                dataSource={state.tableData.userPrecautions}
                columns={columns}
                scroll={{ x: 1300 }}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      actions.setShowDropdown(false, -1);
                    },
                    onContextMenu: (event) => {
                      event.preventDefault();
                      actions.setShowDropdown(true, index as number);
                      actions.setRecordObj(record);
                      actions.setUserId(record.userId);
                      actions.setPageX(event.pageX);
                      actions.setPageY(event.pageY);
                    },
                  };
                }}
                pagination={{
                  current: state.page,
                  pageSize: state.pageSize,
                  total: state.total,
                  showLessItems: true,
                  responsive: true,
                  showSizeChanger: true,
                }}
                onChange={(...args) => actions.tableSettings(args)}
                loading={state.loading}
                bordered
                rowKey="id"
              />
            </div>
          }
          <ClickAwayListener onClickAway={actions.handleClickAway}>
            <DropDownPrecautionTable />
          </ClickAwayListener>
          <AddPrecautionModal />
        </>
      </Content>
    </Layout>
  );
};

export default PrecautionTable;
