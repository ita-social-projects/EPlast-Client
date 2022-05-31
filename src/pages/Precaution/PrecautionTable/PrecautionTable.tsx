import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import notificationLogic from "../../../components/Notifications/Notification";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import precautionApi from "../../../api/precautionApi";
import AddPrecautionModal from "../PrecautionTable/AddPrecautionModal";
import EditPrecautionTypesModal from "./EditPrecautionTypesModal";
import UserPrecautionTableInfo from "../Interfaces/UserPrecauctionsTableInfo";
import ClickAwayListener from "react-click-away-listener";
import Precaution from "../Interfaces/Precaution";
import PrecautionTableSettings from "../../../models/Precaution/PrecautionTableSettings";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  successfulCreateAction,
  successfulDeleteAction,
  successfulUpdateAction,
} from "../../../components/Notifications/Messages";
import { Roles } from "../../../models/Roles/Roles";
import "./Filter.less";
import UserPrecaution from "../Interfaces/UserPrecaution";
import UserPrecautionTableItem from "../Interfaces/UserPrecautionTableItem";
import UserPrecautionsTableInfo from "../Interfaces/UserPrecauctionsTableInfo";

const { Content } = Layout;

const PrecautionTable = () => {
  const EmptyUserPrecautionTableItem: UserPrecautionTableItem = {
    id: 0,
    number: 0,
    precautionId: 0,
    precautionName: "",
    userId: "",
    userName: "",
    reporter: "",
    reason: "",
    status: "",
    date: new Date(),
    endDate: new Date(),
    isActive: false,
  };
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
  const [recordObj, setRecordObj] = useState<UserPrecautionTableItem>(
    EmptyUserPrecautionTableItem
  );
  const [isRecordActive, setIsRecordActive] = useState<boolean>(false);
  const [userId, setUserId] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalEditDist, setVisibleModalEditDist] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchedData, setSearchedData] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [statusSorter, setStatusSorter] = useState<any[]>([]);
  const [precautionNameSorter, setPrecautionNameSorter] = useState<any[]>([]);
  const [dateSorter, setDateSorter] = useState<any[]>([]);
  const [sortByOrder, setSortByOrder] = useState<any[]>(["number", "ascend"]);
  const [tableData, setPrecautions] = useState<UserPrecautionsTableInfo>({
    totalItems: 0,
    userPrecautions: [EmptyUserPrecautionTableItem],
  });
  const [userAccess, setUserAccess] = useState<{ [key: string]: boolean }>({});

  const getPrecautionTable = async () => {
    const NewTableSettings: PrecautionTableSettings = {
      sortByOrder: sortByOrder,
      statusFilter: statusSorter,
      precautionNameFilter: precautionNameSorter,
      dateFilter: dateSorter,
      searchedData: searchedData,
      page: page,
      pageSize: pageSize,
    };

    setLoading(true);
    await getUserAccesses();
    const result: UserPrecautionsTableInfo = await precautionApi.getAllUsersPrecautions(
      NewTableSettings
    );
    setPrecautions(result);
    setTotalItems(result.totalItems);
    setLoading(false);
  };

  const getUserAccesses = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    let result: any;
    precautionApi.getUserAccess(user.nameid).then((response) => {
      result = response;
      setUserAccess(response.data);
    });
    return result;
  };

  useEffect(() => {
    getPrecautionTable();
  }, [
    sortByOrder,
    statusSorter,
    precautionNameSorter,
    dateSorter,
    searchedData,
    page,
    pageSize,
  ]);

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.toLowerCase() === "") setSearchedData("");
  };

  const showModal = () => {
    setVisibleModal(true);
  };

  const handleAdd = async () => {
    setVisibleModal(false);
    getPrecautionTable();
    notificationLogic("success", successfulCreateAction("Догану"));
  };

  const showModalEditTypes = () => {
    setVisibleModalEditDist(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const CreateDeleteNotification = (id: number) => {
    const userPrecaution = tableData.userPrecautions.find(
      (d: { id: number }) => d.id === id
    );
    if (userPrecaution) {
      NotificationBoxApi.createNotifications(
        [userPrecaution.userId],
        `Вашу пересторогу: '${userPrecaution.precautionName}' було видалено.`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
      NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId).then(
        (res) => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' було знято пересторогу: '${userPrecaution.precautionName}'. `,
                NotificationBoxApi.NotificationTypes.UserNotifications
              );
            });
        }
      );
    }
  };

  const CreateEditNotification = (userId: string, name: string) => {
    if (userId !== "" && name !== "") {
      NotificationBoxApi.createNotifications(
        [userId],
        `Вашу пересторогу: '${name}' було змінено. `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/tableData`,
        `Переглянути`
      );
      NotificationBoxApi.getCitiesForUserAdmins(userId).then((res) => {
        res.cityRegionAdmins.length !== 0 &&
          res.cityRegionAdmins.forEach(async (cra) => {
            await NotificationBoxApi.createNotifications(
              [cra.cityAdminId, cra.regionAdminId],
              `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінену пересторогу: '${name}'. `,
              NotificationBoxApi.NotificationTypes.UserNotifications,
              `/tableData`,
              `Переглянути`
            );
          });
      });
    }
  };

  const handleDelete = (id: number) => {
    const filteredData = tableData.userPrecautions.filter(
      (d: { id: number }) => d.id !== id
    );
    const filteredInfo: UserPrecautionTableInfo = {
      totalItems: totalItems,
      userPrecautions: filteredData,
    };
    setPrecautions({
      ...tableData,
      ...filteredInfo,
    });

    if (page != 1 && tableData.userPrecautions.length == 1) setPage(page - 1);

    setTotalItems(totalItems - 1);
    notificationLogic("success", successfulDeleteAction("Пересторогу"));
    CreateDeleteNotification(id);
  };

  const handleEdit = (
    id: number,
    precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => {
    /* eslint no-param-reassign: "error" */
    const editedData = tableData.userPrecautions.filter((d) => {
      if (d.id === id) {
        d.precautionName = precaution.name;
        d.date = date;
        d.endDate = endDate;
        d.isActive = isActive;
        d.reason = reason;
        d.reporter = reporter;
        d.status = status;
        d.number = number;
        d.userId = userId;
        d.userName = user.firstName + " " + user.lastName;
      }
      return d;
    });

    const editedTableInfo: UserPrecautionTableInfo = {
      totalItems: tableData.totalItems,
      userPrecautions: editedData,
    };

    setPrecautions({
      ...tableData,
      ...editedTableInfo,
    });
    notificationLogic("success", successfulUpdateAction("Пересторогу"));
    CreateEditNotification(userId, precaution.name);
  };
  const tableSettings = (res: any) => {
    setPage(res[0].current);
    setPageSize(res[0].pageSize);

    res[1].status === null
      ? setStatusSorter([])
      : setStatusSorter(res[1].status);

    res[1].precautionName === null
      ? setPrecautionNameSorter([])
      : setPrecautionNameSorter(res[1].precautionName);

    res[1].date === null ? setDateSorter([]) : setDateSorter(res[1].date);

    res[2].order === undefined
      ? setSortByOrder([res[2].field, null])
      : setSortByOrder([res[2].field, res[2].order]);
  };

  return (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Перестороги</h1>
        <>
          <Row gutter={[6, 12]} className={classes.buttonsSearchField}>
            <Col>
              {userAccess["AddPrecaution"] === true ? (
                <>
                  <Button type="primary" onClick={showModal}>
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
                onChange={handleSearchChange}
                onSearch={handleSearch}
              />
            </Col>
          </Row>
          {
            <div>
              <Table
                className={classes.table}
                dataSource={tableData.userPrecautions}
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
                      setRecordObj(record);
                      setIsRecordActive(record.isActive);
                      setUserId(record.userId);
                      setX(event.pageX);
                      setY(event.pageY);
                    },
                  };
                }}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: totalItems,
                  showLessItems: true,
                  responsive: true,
                  showSizeChanger: true,
                }}
                onChange={(...args) => tableSettings(args)}
                loading={loading}
                bordered
                rowKey="id"
              />
            </div>
          }
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownPrecautionTable
              showDropdown={showDropdown}
              recordId={recordObj.id}
              userId={userId}
              pageX={x}
              pageY={y}
              userAccess={userAccess}
              isActive={recordObj.isActive}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </ClickAwayListener>

          <AddPrecautionModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handleAdd}
          />
          <EditPrecautionTypesModal
            setVisibleModal={setVisibleModalEditDist}
            visibleModal={visibleModalEditDist}
          />
        </>
      </Content>
    </Layout>
  );
};
export default PrecautionTable;
