import React, { useEffect, useState } from "react";
import { Table, Input, Button, Layout } from "antd";
import columns from "./columns";
import notificationLogic from "../../../components/Notifications/Notification";
import UserPrecaution from "../Interfaces/UserPrecaution";
import DropDownPrecautionTable from "./DropDownPrecautionTable";
import precautionApi from "../../../api/precautionApi";
import AddPrecautionModal from "../PrecautionTable/AddPrecautionModal";
import EditPrecautionTypesModal from "./EditPrecautionTypesModal";
import ClickAwayListener from "react-click-away-listener";
import User from "../../../models/UserTable/User";
import Precaution from "../Interfaces/Precaution";
import Spinner from "../../Spinner/Spinner";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import moment from "moment";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import {
  successfulCreateAction,
  successfulDeleteAction,
  successfulUpdateAction
} from "../../../components/Notifications/Messages"
import { RollbackOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
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
  const [userId, setUserId] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalEditDist, setVisibleModalEditDist] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [canEdit] = useState(roles.includes("Admin"));
  const history = useHistory();
  const [UserPrecautions, setData] = useState<UserPrecaution[]>([
    {
      id: 0,
      precaution: {
        id: 0,
        name: "",
      },
      precautionId: 0,
      userId: "",
      reporter: "",
      reason: "",
      status: "",
      number: 0,
      date: new Date(),
      endDate: new Date(),
      isActive: true,
      user: new User(),
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const res: UserPrecaution[] = await precautionApi.getUserPrecautions();
      setData(res);
      setLoading(true);
    };
    fetchData();
  }, []);


  let filteredData = searchedData
    ? UserPrecautions.filter((item) => {
      return Object.values([
        item.reporter,
        item.reason,
        item.number,
        item.status,
        moment(item.date.toLocaleString()).format("DD.MM.YYYY"),
      ]).find((element) => {
        return String(element).toLowerCase().includes(searchedData);
      });
    })
    : UserPrecautions;

  filteredData = filteredData.concat(
    UserPrecautions?.filter(
      (item) =>
        (item.user.firstName.toLowerCase()?.includes(searchedData) ||
          item.user.lastName.toLowerCase()?.includes(searchedData)) &&
        !filteredData.includes(item)
    )
  );
  filteredData = filteredData.concat(
    UserPrecautions.filter(
      (item) =>
        item.precaution.name.toLowerCase()?.includes(searchedData) &&
        !filteredData.includes(item)
    )
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value.toLowerCase());
    setLoading(true);
  };

  const showModal = () => {
    setVisibleModal(true);
  };

  const handleAdd = async () => {
    setVisibleModal(false);
    setLoading(false);
    const res: UserPrecaution[] = await precautionApi.getUserPrecautions();
    setData(res);
    notificationLogic("success", successfulCreateAction("Пересторога"));
    setLoading(true);
  };

  const showModalEditTypes = () => {
    setVisibleModalEditDist(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };


  const CreateDeleteNotification = (id: number) => {
    const userPrecaution = UserPrecautions.find(
      (d: { id: number }) => d.id === id
    );
    if (userPrecaution) {
      NotificationBoxApi.createNotifications(
        [userPrecaution.userId],
        `Вашу пересторогу: '${userPrecaution.precaution.name}' було видалено.`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
      NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId)
        .then(res => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' було знято пересторогу: '${userPrecaution.precaution.name}'. `,
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
    const filteredData = UserPrecautions.filter(
      (d: { id: number }) => d.id !== id
    );
    setData([...filteredData]);
    notificationLogic("success", successfulDeleteAction("Пересторога"));
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
    const filteredData = UserPrecautions.filter((d) => {
      if (d.id === id) {
        d.precautionId = precaution.id;
        d.precaution = precaution;
        d.number = number;
        d.date = date;
        d.endDate = endDate;
        d.isActive = isActive;
        d.reason = reason;
        d.status = status;
        d.reporter = reporter;
        d.user = user;
        d.userId = userId;
      }

      return d;
    });
    setData([...filteredData]);
    notificationLogic("success", successfulUpdateAction("Пересторога"));
    CreateEditNotification(userId, precaution.name);
  };
  return loading === false ? (
    <Spinner />
  ) : (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Перестороги</h1>

        <>
          <div className={classes.searchContainer}>
            {canEdit === true ? (
              <>
                <Button type="primary" onClick={showModal}>
                  Додати пересторогу
                </Button>
                <span />
              </>
            ) : (
              <></>
            )}
            <Input placeholder="Пошук" onChange={handleSearch} allowClear />
          </div>
          <div>
            <Table
              className={classes.table}
              dataSource={filteredData}
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
              pagination={{
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
              }}
              bordered
              rowKey="id"
            />
          </div>
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDownPrecautionTable
              showDropdown={showDropdown}
              record={recordObj}
              userId={userId}
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
