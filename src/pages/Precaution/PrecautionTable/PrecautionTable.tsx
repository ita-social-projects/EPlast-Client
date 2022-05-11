import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import ClickAwayListener from "react-click-away-listener";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import PrecautionStore from "../PrecautionTable/PrecautionStore";
import { Roles } from "../../../models/Roles/Roles";
import "./Filter.less";
import { createHook } from "react-sweet-state";
const { Content } = Layout;

const PrecautionTable = () => {
  const classes = require("./Table.module.css");
  let user: any;
  let curToken = AuthStore.getToken() as string;
  let roles: string[] = [""];
  user = curToken !== null ? (jwt(curToken) as string) : "";
  roles =
    curToken !== null
      ? (user[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] as string[])
      : [""];
  const [recordObj, setRecordObj] = useState<any>(0);
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [userId, setUserId] = useState<any>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [canEdit] = useState(roles.includes(Roles.Admin));

  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();
    
  useEffect(() => {
    actions.handleFetchData();
  }, [
    state.sortByOrder,
    state.statusSorter,
    state.precautionNameSorter,
    state.dateSorter,
    state.searchedData,
    state.page,
    state.pageSize,
  ]);

  return (
    <Layout>
      <Content
        onClick={() => {
          state.showDropdown = false;
        }}
      >
        <h1 className={classes.titleTable}>Перестороги</h1>
        <>
          <Row gutter={[6, 12]} className={classes.buttonsSearchField}>
            <Col>
              {canEdit === true ? (
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
                className={classes.table}
                dataSource={state.precautions}
                columns={columns}
                scroll={{ x: 1300 }}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      state.showDropdown = false;
                    },
                    onContextMenu: (event) => {
                      event.preventDefault();
                      state.showDropdown = true;
                      setRecordObj(record.id);
                      setIsRecordActive(record.isActive);
                      setUserId(record.userId);
                      setX(event.pageX);
                      setY(event.pageY);
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
            <DropDownPrecautionTable
              showDropdown={state.showDropdown}
              record={recordObj}
              userId={userId}
              isRecordActive={isRecordActive}
              pageX={x}
              pageY={y}
              canEdit={canEdit}
              onDelete={actions.handleDeletePrecautionTable}
              onEdit={actions.handleEditPrecautionTable}
            />
          </ClickAwayListener>

          
        </>
      </Content>
    </Layout>
  );
};
/*
<AddPrecautionModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handleAdd}
          />
          <EditPrecautionTypesModal
            setVisibleModal={setVisibleModalEditDist}
            visibleModal={visibleModalEditDist}
          />
*/
export default PrecautionTable;
