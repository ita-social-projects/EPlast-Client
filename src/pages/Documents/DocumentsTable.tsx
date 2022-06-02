import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Card } from "antd";
import columns from "./columns";
import DropDown from "./DropDownDocuments";
import ClickAwayListener from "react-click-away-listener";
import Spinner from "../Spinner/Spinner";
import jwt_decode from "jwt-decode";
import AddDocumentsModal from "./AddDocumetsModal";
import { Roles } from "../../models/Roles/Roles";
import Search from "antd/lib/input/Search";
import classes from "./Table.module.css";
import AuthLocalStorage from "../../AuthLocalStorage";
import { DocumentsStore } from "../../stores/DocumentsStore";

const { Content } = Layout;

const DocumentsTable: React.FC = () => {

  const [state, actions] = DocumentsStore();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const jwt = AuthLocalStorage.getToken() as string;
  const decodedJwt = jwt_decode(jwt) as any;
  const roles = decodedJwt[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ] as string[];

  const accesser = {
    canEdit: roles.includes(Roles.Admin)
      || roles.includes(Roles.GoverningBodyAdmin),
    regionAdm: roles.includes(Roles.OkrugaHead),
    regionAdmDep: roles.includes(Roles.OkrugaHeadDeputy),
    cityAdm: roles.includes(Roles.CityHead),
    cityAdmDep: roles.includes(Roles.CityHeadDeputy),
    clubAdm: roles.includes(Roles.KurinHead),
    clubAdmDep: roles.includes(Roles.KurinHeadDeputy),
    supporter: roles.includes(Roles.Supporter),
    plastMember: roles.includes(Roles.PlastMember),
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await actions.init();
      setLoading(false);
    };
    fetchData();
  }, [state.searchedData, state.page, state.pageSize, state.status]);

  const handler = {
    add: {
      documentsModal: async () => {
        actions.add()
      }
    },
    delete: {
      dropDown: (id: number) => {
        actions.delete(id)
      }
    },
    search: {
      searchBar: (event: any) => {
        actions.search(event)
      }
    },
    change: {
      searchBar: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.toLowerCase() === "")
          actions.resetSearchedData()
      },
      table: (page: number) => {
        actions.changePagination(page, state.pageSize);
      },
      tabCard: (key: string) => {
        actions.changePagination(1, state.pageSize);
        actions.changeStatus(key)
      }
    },
    click: {
      addBtn: () => setVisibleModal(true),
      away: () => setShowDropdown(false)
    }
  }

  return (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Репозитарій</h1>
        <>
          <div className={classes.searchContainer}>
            {accesser.canEdit == true ||
              accesser.regionAdm == true ||
              accesser.regionAdmDep == true ||
              accesser.cityAdm == true ||
              accesser.cityAdmDep == true ||
              accesser.clubAdm == true ||
              accesser.clubAdmDep == true ? (
              <Button type="primary" onClick={handler.click.addBtn}>
                Додати документ
              </Button>
            ) : (
              <> </>
            )}
            {accesser.canEdit == true ||
              accesser.regionAdm == true ||
              accesser.regionAdmDep == true ||
              accesser.cityAdm == true ||
              accesser.cityAdmDep == true ||
              accesser.clubAdm == true ||
              accesser.clubAdmDep == true ||
              accesser.supporter == true ||
              accesser.plastMember == true ? (
              <Search
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handler.change.searchBar}
                onSearch={handler.search.searchBar}
              />
            ) : (
              <> </>
            )}
          </div>

          {accesser.canEdit == true ||
            accesser.regionAdm == true ||
            accesser.regionAdmDep == true ||
            accesser.cityAdm == true ||
            accesser.cityAdmDep == true ||
            accesser.clubAdm == true ||
            accesser.clubAdmDep == true ||
            accesser.supporter == true ||
            accesser.plastMember == true ? (
            <Card
              style={{ width: "100%" }}
              tabList={state.tabList}
              activeTabKey={state.status}
              onTabChange={handler.change.tabCard}
            />
          ) : (
            <Card style={{ width: "100%" }} activeTabKey={state.status} />
          )}
          {loading ? (
            <Spinner />
          ) : (
            <Table
              className={classes.table}
              dataSource={state.data}
              scroll={{ x: 1300 }}
              columns={columns}
              bordered
              rowKey="id"
              onRow={(record) => {
                return {
                  onClick: () => {
                    setShowDropdown(false);
                  },
                  onContextMenu: (event) => {
                    event.preventDefault();
                    setShowDropdown(true);
                    actions.setXY(event.pageX, event.pageY);
                    actions.setRecord(record.id);
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
                current: state.page,
                pageSize: state.pageSize,
                total: state.count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: handler.change.table,
              }}
            />
          )}

          <ClickAwayListener onClickAway={handler.click.away}>
            <DropDown
              showDropdown={showDropdown}
              record={state.recordId}
              pageX={state.x}
              pageY={state.y}
              onDelete={handler.delete.dropDown}
            />
          </ClickAwayListener>
          <AddDocumentsModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handler.add.documentsModal}
          />
        </>
      </Content>
    </Layout>
  );
};

export default DocumentsTable;
