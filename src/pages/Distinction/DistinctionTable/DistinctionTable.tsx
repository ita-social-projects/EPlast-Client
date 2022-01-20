import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Space, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import notificationLogic from "../../../components/Notifications/Notification";
import DropDownDistinctionTable from "./DropDownDistinctionTable";
import distinctionApi from "../../../api/distinctionApi";
import AddDistinctionModal from "../DistinctionTable/AddDistinctionModal";
import EditDistinctionTypesModal from "./EditDistinctionTypesModal";
import UserDistinctionTableInfo from "../Interfaces/UserDistinctionTableInfo";
import ClickAwayListener from "react-click-away-listener";
import Distinction from "../Interfaces/Distinction";
import DistionctionTableSettings from "../../../models/Distinction/DistinctionTableSettings";
//import Spinner from "../../Spinner/Spinner";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  successfulCreateAction,
  successfulDeleteAction,
  successfulUpdateAction
} from "../../../components/Notifications/Messages"
import { Roles } from "../../../models/Roles/Roles";
const { Content } = Layout;
const DistinctionTable = () => {
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
  const [userId, setUserId] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalEditDist, setVisibleModalEditDist] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<string>("");
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>({})
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  //const [count, setCount] = useState<number>(0);
  const [sortByOrder, setSortByOrder] = useState<any[]>(["number","ascend"]);
  const [distinctions, setDistinctions] = useState<UserDistinctionTableInfo[]>([
    {
      count: 0,
      total: 0,
      id: 0,
      number: 0,
      distinctionName: "",
      userId: "",
      userName: "",
      reporter: "",
      reason: "",
      date: new Date(),
    }
  ]);

  const getUserAccessesForDistinctions = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await distinctionApi.getUserDistinctionAccess(user.nameid).then(
      response => {
        setUserAccesses(response.data);
      }
    );
  }

  const fetchData = async () => { 
    const NewTableSettings: DistionctionTableSettings = {
      sortByOrder: sortByOrder,
      searchedData: searchedData,
      page: page,
      pageSize: pageSize
    };

    setLoading(true);
    const res: UserDistinctionTableInfo[] = await distinctionApi.getAllUsersDistinctions(NewTableSettings);    
    setTotal(res[0]?.total);
    //setCount(res[0]?.count);
    setDistinctions(res);
    setLoading(false);
    getUserAccessesForDistinctions();
  };

  useEffect(() => {    
    fetchData();    
  }, [sortByOrder, searchedData, page, pageSize]);

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.toLowerCase() === '') setSearchedData('');
  }

  const showModal = () => {
    setVisibleModal(true);
  };

  const handleAdd = async () => {
    setVisibleModal(false);
    /*const res: UserDistinctionTableInfo[] = await distinctionApi.getAllUsersDistinctions(searchedData, page, pageSize);
    setDistinctions(res);
    setTotal(res[0]?.total);
    //setCount(res[0]?.count);*/
    fetchData();
    notificationLogic("success", successfulCreateAction("Відзначення"));
  };

  const showModalEditTypes = () => {
    setVisibleModalEditDist(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  /*const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };*/

  const CreateDeleteNotification = (id: number) => {
    const userDistinction = distinctions.find(
      (d: { id: number }) => d.id === id
    );
    if (userDistinction) {
      NotificationBoxApi.createNotifications(
        [userDistinction.userId],
        `Ваше відзначення: '${userDistinction.distinctionName}' було видалено.`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
      NotificationBoxApi.getCitiesForUserAdmins(userDistinction.userId)
        .then(res => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' був позбавлений відзначення: '${userDistinction.distinctionName}'. `,
                NotificationBoxApi.NotificationTypes.UserNotifications
              );
            })
        });
    }
  }

  const CreateEditNotification = (userId: string, name: string) => {
    if (userId !== "" && name !== "") {
      NotificationBoxApi.createNotifications(
        [userId],
        `Ваше відзначення: '${name}' було змінено. `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/distinctions`,
        `Переглянути`
      );
      NotificationBoxApi.getCitiesForUserAdmins(userId)
        .then(res => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінене відзначення: '${name}'. `,
                NotificationBoxApi.NotificationTypes.UserNotifications,
                `/distinctions`,
                `Переглянути`
              );
            })
        });
    }
  }

  const handleDelete = (id: number) => {
    const filteredData = distinctions.filter(
      (d: { id: number }) => d.id !== id
    );
    setDistinctions([...filteredData]);
    setTotal(total - 1);
    //setCount(count - 1);
    notificationLogic("success", successfulDeleteAction("Відзначення"));
    CreateDeleteNotification(id);
  };

  const handleEdit = (
    id: number,
    distinction: Distinction,
    date: Date,
    reason: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => {
    /* eslint no-param-reassign: "error" */
    const editedData = distinctions.filter((d) => {
      if (d.id === id) {
        d.distinctionName = distinction.name;
        d.date = date;
        d.reason = reason;
        d.reporter = reporter;
        d.number = number;
        d.userId = userId;
        d.userName = user.firstName + ' ' + user.lastName;
      }
      return d;
    });
    setDistinctions([...editedData]);
    notificationLogic("success", successfulUpdateAction("Відзначення"));
    CreateEditNotification(userId, distinction.name);
  };

  const tableSettings = (res: any) =>{   
    setPage(res[0].current);
    setPageSize(res[0].pageSize);           

    if (res[2].order === undefined)
      setSortByOrder([res[2].field, null]);
    else
      setSortByOrder([res[2].field, res[2].order])
  }

  return (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Відзначення</h1>
        <>
          <Row gutter={[6, 12]} className={classes.buttonsSearchField}>
            {userAccesses["EditTypeDistinction"] ? (
              <>
                <Col>
                  <Button type="primary" onClick={showModal}>
                    Додати відзначення
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={showModalEditTypes}>
                    Редагування типів відзначень
                  </Button>
                </Col>
              </>
            ) : (null)}
            <Col>
              <Search
                className={classes.distinctionSearchField}
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handleSearchChange}
                onSearch={handleSearch}
              />
            </Col>
          </Row>
          {//loading ? (<Spinner />) : (
            <div>
            <Table
              className={classes.table}
              dataSource={distinctions}
              columns={columns}
              scroll={{ x: 1300 }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setShowDropdown(false);
                  },
                  onContextMenu: (event) => {
                    event.preventDefault();
                    setShowDropdown(true);
                    setRecordObj(record.id);
                    setUserId(record.userId);
                    setX(event.pageX);
                    setY(event.pageY);
                  },
                };
              }}
              /*onChange={(pagination) => {
                if (pagination) {
                  window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}*/
              pagination={{
                current: page,
                pageSize: pageSize,
                total: total,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                //onChange: (page) => handlePageChange(page),
                //onShowSizeChange: (page, size) => handleSizeChange(page, size),
              }}
              onChange={(...args) => tableSettings(args)}
              bordered
              rowKey="id"
            />
          </div>
          }
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownDistinctionTable
              showDropdown={showDropdown}
              record={recordObj}
              userId={userId}
              pageX={x}
              pageY={y}
              canEdit={userAccesses["EditTypeDistinction"]}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </ClickAwayListener>

          <AddDistinctionModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handleAdd}
          />
          <EditDistinctionTypesModal
            setVisibleModal={setVisibleModalEditDist}
            visibleModal={visibleModalEditDist}
          />
        </>
      </Content>
    </Layout>
  );
};
export default DistinctionTable;
