import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Card } from "antd";
import columns from "./columns";
import DropDown from "./DropDownDocuments";
import documentsApi, { TypeGetParser } from "../../api/documentsApi";
import notificationLogic from "../../components/Notifications/Notification";
import ClickAwayListener from "react-click-away-listener";
import Spinner from "../Spinner/Spinner";
import AuthStore from "../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import AddDocumentsModal from "./AddDocumetsModal";
import { Roles } from "../../models/Roles/Roles";
import DocumentsTableInfo from "../../models/Documents/DocumentsTableInfo";
import Search from "antd/lib/input/Search";
import classes from "./Table.module.css";

const { Content } = Layout;

const DocumentsTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordId, setRecordId] = useState<number>(0);
  const [data, setData] = useState<DocumentsTableInfo[]>(
    Array<DocumentsTableInfo>()
  );
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<string>("legislation");


  const jwt = AuthStore.getToken() as string;
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
    const fetchData = async () => {

      setLoading(true);
      const res: DocumentsTableInfo[] = await documentsApi.getAllDocuments(
        searchedData,
        page,
        pageSize,
        status
      );
      setTotal(res[0]?.total);
      setCount(res[0]?.count);
      setData(res);
      setLoading(false);
    };
    fetchData();
  }, [searchedData, page, pageSize, status]);

  const handler = {
    add: {
      documentsModal: async () => {
        const lastId = data[data.length - 1].id;
        try {
          const res = await documentsApi.getById(lastId + 1)
          const dec: DocumentsTableInfo = {
            id: res.id,
            name: res.name,
            governingBody: res.governingBody.governingBodyName,
            type: TypeGetParser(res.type),
            description: res.description,
            fileName: res.fileName,
            date: res.date,
            total: total + 1,
            count: count + 1,
          };
          setTotal(total + 1);
          setCount(count + 1);
          setData([...data, dec]);
        } catch (error) {
          notificationLogic("error", "Документу не існує");
        }
      }
    },
    delete: {
      dropDown: (id: number) => {
        const filteredData = data.filter((d) => d.id !== id);
        setData([...filteredData]);
        setTotal(total - 1);
        setCount(count - 1);
      }
    },
    search: {
      searchBar: (event: any) => {
        setPage(1);
        setSearchedData(event);
        setData(data);
      }
    },
    change: {
      searchBar: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.toLowerCase() === "")
          setSearchedData("");
        setData(data);
      },
      table: (page: number) => {
        setPage(page);
      },
      showSize: () => {
        setPage(page);
        setPageSize(pageSize);
      },
      tabCard: (key: string) => {
        setPageSize(pageSize);
        setStatus(key);
      }
    },
    click: {
      addBtn: () => setVisibleModal(true),
      away: () => setShowDropdown(false)
    }
  }

  const tabList = [
    {
      key: "legislation",
      tab: "Нормативні акти",
    },
    {
      key: "Methodics",
      tab: "Методичні документи",
    },
    {
      key: "Other",
      tab: "Різне",
    },
  ];

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
              tabList={tabList}
              activeTabKey={status}
              onTabChange={handler.change.tabCard}
            />
          ) : (
            <Card style={{ width: "100%" }} activeTabKey={status} />
          )}
          {loading ? (
            <Spinner />
          ) : (
            <Table
              className={classes.table}
              dataSource={data}
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
                    setRecordId(record.id);
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
                pageSize: pageSize,
                total: count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: handler.change.table,
                onShowSizeChange: handler.change.showSize,
              }}
            />
          )}

          <ClickAwayListener onClickAway={handler.click.away}>
            <DropDown
              showDropdown={showDropdown}
              record={recordId}
              pageX={x}
              pageY={y}
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
