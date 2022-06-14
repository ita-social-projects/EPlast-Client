import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import ClickAwayListener from "react-click-away-listener";
import PrecautionStore from "../PrecautionTable/PrecautionStore";
import "./Filter.less";
import { createHook } from "react-sweet-state";
import AddPrecautionModal from "./AddPrecautionModal";
import EditPrecautionTypesModal from "./EditPrecautionTypesModal";
import UserPrecautionTableItem from "../Interfaces/UserPrecautionTableItem";

const { Content } = Layout;

const PrecautionTable = () => {
  const classes = require("./Table.module.css");
  
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  const [recordObj, setRecordObj] = useState<UserPrecautionTableItem>(
    state.EmptyUserPrecautionTableItem
  );
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [userId, setUserId] = useState<any>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

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
                dataSource={state.tableData.userPrecautions}
                columns={columns}
                scroll={{ x: 1300 }}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      state.showDropdown = false;
                    },
                    onContextMenu: (event) => {
                      event.preventDefault();
                      actions.setShowDropdown(true);
                      setRecordObj(record);
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
              recordId={recordObj.id}
              userId={userId}
              pageX={x}
              pageY={y}              
              onDelete={actions.handleDeletePrecautionTable}
              onEdit={actions.handleEditPrecautionTable}
              userAccess={state.userAccess}
              isActive={recordObj.isActive}
            />
          </ClickAwayListener>        
          <AddPrecautionModal/>
          <EditPrecautionTypesModal/>                    
        </>
      </Content>
    </Layout>
  );
};

export default PrecautionTable;
