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
import DocumentsTableInfo from "../../models/Documents/DocumentsTableInfo";
import documentsApi from "../../api/documentsApi";
import { DocumentPost } from "../../models/Documents/DocumentPost";
import openNotificationWithIcon from "../../components/Notifications/Notification";

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

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const documents: DocumentsTableInfo[] = await documentsApi.getAllDocuments(
          state.searchedData,
          state.page,
          state.pageSize,
          state.status
        );
        await actions.init(documents);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, [state.searchedData, state.page, state.pageSize, state.status]);

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

  const canEdit = (
    accesser.canEdit ||
    accesser.regionAdm ||
    accesser.regionAdmDep ||
    accesser.cityAdm ||
    accesser.cityAdmDep ||
    accesser.clubAdm ||
    accesser.clubAdmDep
  )

  const canView = (
    accesser.canEdit ||
    accesser.regionAdm ||
    accesser.regionAdmDep ||
    accesser.cityAdm ||
    accesser.cityAdmDep ||
    accesser.clubAdm ||
    accesser.clubAdmDep ||
    accesser.supporter ||
    accesser.plastMember
  )

  const handler = {
    add: {
      documentsModal: async () => {
        try {
          const document: DocumentPost = await documentsApi.getLast();
          actions.add(document)
        } catch (error) {
          openNotificationWithIcon("error", "Документу не існує");
        }
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
      away: () => actions.hideDropdown()
    }
  }

  return (
    <Layout>
      <Content
        onClick={() => {
          actions.hideDropdown();
        }}
      >
        <h1 className={classes.titleTable}>Репозитарій</h1>
        <>
          <div className={classes.searchContainer}>
            {canEdit ? (
              <Button type="primary" onClick={handler.click.addBtn}>
                Додати документ
              </Button>
            ) : (
              <> </>
            )}
            {canView ? (
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

          <Card
              style={{ width: "100%", position: "static" }}
              tabList={canView ? state.tabList : undefined}
              activeTabKey={state.status}
              onTabChange={canView ? handler.change.tabCard : undefined}
            >
          
          <Table
            rowClassName={(record, index) => index === state.selectedRow ? classes.selectedRow : ""}
            loading={loading}
            className={classes.table}
            dataSource={state.data}
            scroll={{ x: 1300 }}
            columns={columns}
            bordered
            rowKey="id"
            onRow={(record, index) => {
              return {
                onClick: () => {
                  actions.hideDropdown()
                },
                onContextMenu: (event) => {
                  event.preventDefault();
                  actions.showDropdown(index as number)
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

          <ClickAwayListener onClickAway={handler.click.away}>
            <DropDown
              showDropdown={state.isDropdownVisible}
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
          </Card>
        </>
      </Content>
    </Layout>
  );
};

export default DocumentsTable;
