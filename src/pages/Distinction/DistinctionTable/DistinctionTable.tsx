import { Button, Col, Layout, Row, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { batch } from "react-sweet-state";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import AddUserDistinctionModal from "./AddDistinctionModal";
import columns from "./columns";
import DropDownDistinctionTable from "./DropDownDistinctionTable";
const { Content } = Layout;

const DistinctionTable = () => {
  const classes = require("./Table.module.css");
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  const [state, actions] = useDistinctions();

  useEffect(() => {
    batch(() => {
      actions.getUserDistinctionsAccess();
      actions.fetchUserDistinctions();
    });
  }, [state.distinctionTableSettings]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.toLowerCase() === "") actions.setSearch("");
  };

  const handleClickAway = () => {
    setIsDropdownShown(false);
    setSelectedRow(-1);
  };

  return (
    <Layout>
      <Content
        onClick={() => {
          setIsDropdownShown(false);
        }}
      >
        <h1 className={classes.titleTable}>Відзначення</h1>
        <>
          <Row gutter={[6, 12]} className={classes.buttonsSearchField}>
            {state.userDistinctionsAccess["EditTypeDistinction"] ? (
              <>
                <Col>
                  <Button
                    type="primary"
                    onClick={actions.openUserDistinctionAddModal}
                  >
                    Додати відзначення
                  </Button>
                </Col>
              </>
            ) : null}
            <Col>
              <Search
                className={classes.distinctionSearchField}
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handleSearchChange}
                onSearch={actions.setSearch}
              />
            </Col>
          </Row>
          <div>
            <Table
              rowClassName={(record, index) =>
                index === selectedRow ? classes.selectedRow : null
              }
              className={classes.table}
              dataSource={state.userDistinctions}
              columns={columns}
              scroll={{ x: 1300 }}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    setIsDropdownShown(false);
                  },
                  onContextMenu: (event) => {
                    event.preventDefault();
                    setIsDropdownShown(true);
                    actions.setCurrentUserDistinction(record);
                    setX(event.pageX);
                    setY(event.pageY);
                    setSelectedRow(index as number);
                  },
                };
              }}
              pagination={{
                current: state.distinctionTableSettings.page,
                pageSize: state.distinctionTableSettings.pageSize,
                total: state.userDistinctions[0]?.total,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
              }}
              onChange={(...args) => actions.setTableSettings(args)}
              bordered
              rowKey="id"
            />
          </div>
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownDistinctionTable
              isDropdownShown={isDropdownShown}
              pageX={x}
              pageY={y}
            />
          </ClickAwayListener>

          <AddUserDistinctionModal />
        </>
      </Content>
    </Layout>
  );
};
export default DistinctionTable;
