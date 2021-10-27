import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Col, Row } from "antd";
import Search from "antd/lib/input/Search";
import columns from "./columns";
import notificationLogic from "../../../components/Notifications/Notification";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import precautionApi from "../../../api/precautionApi";
import AddPrecautionModal from "../PrecautionTable/AddPrecautionModal";
import EditPrecautionTypesModal from "./EditPrecautionTypesModal";
import UserPrecautionTableInfo from "../Interfaces/UserPrecauctionTableInfo";
import ClickAwayListener from "react-click-away-listener";
import Precaution from "../Interfaces/Precaution";
import Spinner from "../../Spinner/Spinner";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  successfulCreateAction,
  successfulDeleteAction,
  successfulUpdateAction
} from "../../../components/Notifications/Messages"
import { Roles } from "../../../models/Roles/Roles";
import "./Filter.less";
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalEditDist, setVisibleModalEditDist] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [canEdit] = useState(roles.includes(Roles.Admin));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [precautions, setPrecautions] = useState<UserPrecautionTableInfo[]>([
    {
      count: 0,
      total: 0,
      id: 0,
      number: 0,
      precautionName: "",
      userId: "",
      userName: "",
      reporter: "",
      reason: "",
      status: "",
      date: new Date(),
      endDate: new Date(),
      isActive: false,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res: UserPrecautionTableInfo[] = await precautionApi.getAllUsersPrecautions(searchedData, page, pageSize);
      setTotal(res[0]?.total);
      setCount(res[0]?.count);
      setPrecautions(res);
      setLoading(false);
    };
    fetchData();
  }, [searchedData, page, pageSize]);

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
    setLoading(true);
    const res: UserPrecautionTableInfo[] = await precautionApi.getAllUsersPrecautions(searchedData, page, pageSize);
    setPrecautions(res);
    setTotal(res[0]?.total);
    setCount(res[0]?.count);
    notificationLogic("success", successfulCreateAction("Пересторогу"));
    setLoading(false);
  };

  const showModalEditTypes = () => {
    setVisibleModalEditDist(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const CreateDeleteNotification = (id: number) => {
    const userPrecaution = precautions.find(
      (d: { id: number }) => d.id === id
    );
    if (userPrecaution) {
      NotificationBoxApi.createNotifications(
        [userPrecaution.userId],
        `Вашу пересторогу: '${userPrecaution.precautionName}' було видалено.`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
      NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId)
        .then(res => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' було знято пересторогу: '${userPrecaution.precautionName}'. `,
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
        `Вашу пересторогу: '${name}' було змінено. `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/precautions`,
        `Переглянути`
      );
      NotificationBoxApi.getCitiesForUserAdmins(userId)
        .then(res => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінену пересторогу: '${name}'. `,
                NotificationBoxApi.NotificationTypes.UserNotifications,
                `/precautions`,
                `Переглянути`
              );
            })
        });
    }
  }

  const handleDelete = (id: number) => {
    const filteredData = precautions.filter(
      (d: { id: number }) => d.id !== id
    );
    setPrecautions([...filteredData]);
    setTotal(total - 1);
    setCount(count - 1);
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
    const editedData = precautions.filter((d) => {
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
        d.userName = user.firstName + ' ' + user.lastName;
      }
      return d;
    });
    setPrecautions([...editedData]);
    notificationLogic("success", successfulUpdateAction("Пересторогу"));
    CreateEditNotification(userId, precaution.name);
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
              {canEdit === true ? (
                <>
                  <Button
                    type="primary"
                    onClick={showModal}
                  >
                    Додати пересторогу
                  </Button>
                </>
              ) : (null)}
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
          {loading ? (<Spinner />) : (<div>
            <Table
              className={classes.table}
              dataSource={precautions}
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
                total: count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: (page) => handlePageChange(page),
                onShowSizeChange: (page, size) => handleSizeChange(page, size),
              }}
              bordered
              rowKey="id"
            />
          </div>)}
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownPrecautionTable
              showDropdown={showDropdown}
              record={recordObj}
              userId={userId}
              isRecordActive={isRecordActive}
              pageX={x}
              pageY={y}
              canEdit={canEdit}
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
