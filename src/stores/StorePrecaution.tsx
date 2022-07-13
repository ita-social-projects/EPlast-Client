import { createStore, Action } from 'react-sweet-state';
import notificationLogic from "../components/Notifications/Notification";
import NotificationBoxApi from "../api/NotificationBoxApi";
import { dataCantBeFetched, failCreateAction, successfulCreateAction, successfulDeleteAction, successfulUpdateAction } from '../components/Notifications/Messages';
import PrecautionTableSettings from '../models/Precaution/PrecautionTableSettings';
import precautionApi from "../api/precautionApi";
import UserPrecaution from '../../src/pages/Precaution/Interfaces/UserPrecaution';
import SuggestedUser from '../../src/pages/Precaution/Interfaces/SuggestedUser';
import UserPrecautionsTableInfo from '../../src/pages/Precaution/Interfaces/UserPrecauctionsTableInfo'
import jwt from "jwt-decode";
import UserPrecautionTableItem from '../../src/pages/Precaution/Interfaces/UserPrecautionTableItem'
import AuthLocalStorage from '../AuthLocalStorage';
import deleteConfirm from "../../src/pages/Precaution/PrecautionTable/DeleteConfirm";
import User from "../../src/models/UserTable/User";
import Precaution from '../../src/pages/Precaution/Interfaces/Precaution';
import UserPrecautionEdit from '../pages/Precaution/Interfaces/UserPrecautionEdit';
import UserPrecautionStatus from '../pages/Precaution/Interfaces/UserPrecautionStatus';

let user: any;
let curToken = AuthLocalStorage.getToken() as string;
let roles: string[] = [""];
user = curToken !== null ? (jwt(curToken) as string) : "";
roles =
  curToken !== null
    ? (user[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[])
    : [""];

const EmptyUserPrecautionTableItem: UserPrecautionTableItem = {
  id: 0,
  number: 0,
  precautionId: 0,
  precautionName: "",
  userId: "",
  userName: "",
  reporter: "",
  reason: "",
  status: null,
  date: new Date(),
  endDate: new Date(),
  isActive: false,
};

type State = {
  pageX: number,
  pageY: number,
  userId: number,

  loading: boolean,
  loadingPrecautionStatus: boolean,
  showDropdown: boolean,
  visibleModal: boolean,

  searchedData: string,
  statusSorter: any[],
  precautionNameSorter: any[],
  dateSorter: any[],
  sortByOrder: any[],
  pageSize: number,
  page: number,
  total: number,

  tableData: UserPrecautionsTableInfo,

  addDistData: Precaution[],
  loadingUserStatus: boolean,
  userData: SuggestedUser[],
  userAccess: { [key: string]: boolean },
  recordObj: UserPrecautionTableItem,

  showEditModal: boolean,
  userPrecaution: UserPrecaution,
  editModalLoading: boolean,
  editModalUserData: SuggestedUser[],
  editModalDistData: Precaution[],
  editModalLoadingUserStatus: boolean,
  editModalLoadingPrecautionStatus: boolean,
  editModalPrecaution: Precaution,
  editModalUser: User,

};

type Actions = typeof actions;

const initialState: State = {
  pageX: 0,
  pageY: 0,
  userId: 0,
  loading: false,
  loadingPrecautionStatus: false,
  showDropdown: false,
  visibleModal: false,

  searchedData: "",
  statusSorter: [],
  precautionNameSorter: [],
  dateSorter: [],
  sortByOrder: ["number", "ascend"],
  pageSize: 10,
  page: 1,
  total: 0,

  tableData: {
    totalItems: 0,
    userPrecautions: [{
      id: 0,
      number: 0,
      precautionId: 0,
      precautionName: "",
      userId: "",
      userName: "",
      reporter: "",
      reason: "",
      status: null,
      date: new Date(),
      endDate: new Date(),
      isActive: false,
    }],
  },

  addDistData: Array<Precaution>(),
  loadingUserStatus: false,
  userData: Array<SuggestedUser>(),
  userAccess: {},
  recordObj: EmptyUserPrecautionTableItem,

  showEditModal: false,
  userPrecaution: {
    id: 0,
    precaution: {
      id: 0,
      name: "",
    },
    precautionId: 0,
    status: null,
    userId: "",
    reporter: "",
    reason: "",
    number: 0,
    date: new Date(),
    endDate: new Date(),
    isActive: true,
    user: new User(),
  },
  editModalLoading: false,
  editModalUserData: Array<SuggestedUser>(),
  editModalDistData: Array<Precaution>(),
  editModalLoadingUserStatus: false,
  editModalLoadingPrecautionStatus: false,
  editModalPrecaution: {
    id: 0,
    name: "",
  },
  editModalUser: new User(),

};

const actions = {
  handleGetPrecautionTable:
    (): Action<State> =>
      async ({ setState, getState, dispatch }) => {
        const NewTableSettings: PrecautionTableSettings = {
          sortByOrder: getState().sortByOrder,
          statusFilter: getState().statusSorter,
          precautionNameFilter: getState().precautionNameSorter,
          dateFilter: getState().dateSorter,
          searchedData: getState().searchedData,
          page: getState().page,
          pageSize: getState().pageSize,
        };

        setState({
          loading: true
        });

        await dispatch(actions.getUserAccesses());

        const result: UserPrecautionsTableInfo = await precautionApi.getAllUsersPrecautions(
          NewTableSettings
        );

        setState({
          tableData: result,
          loading: false,
          total: result?.totalItems
        });
      },

  getUserAccesses:
    (): Action<State> =>
      async ({ setState }) => {
        let newUser: any = jwt(curToken);
        let result: any;
        await precautionApi.getUserAccess(newUser.nameid).then((response) => {
          result = response;
          setState({
            userAccess: response.data
          })
        });
      },

  setVisibleAddModal:
    (visible: boolean): Action<State> =>
      ({ setState }) => {
        setState({
          visibleModal: visible
        })
      },

  setPageX:
    (x: number): Action<State> =>
      ({ setState }) => {
        setState({
          pageX: x
        });
      },

  setPageY:
    (y: number): Action<State> =>
      ({ setState }) => {
        setState({
          pageY: y
        });
      },

  setUserId:
    (id: any): Action<State> =>
      ({ setState }) => {
        setState({
          userId: id
        });
      },

  setRecordObj:
    (object: UserPrecautionTableItem): Action<State> =>
      ({ setState }) => {
        setState({
          recordObj: object
        });
      },

  handleAdd:
    (): Action<State> =>
      async ({ setState, dispatch }) => {
        setState({
          visibleModal: false
        });
        dispatch(actions.handleGetPrecautionTable());
        notificationLogic("success", successfulCreateAction("Догану"));
      },

  handleClickAway:
    (): Action<State> =>
      ({ setState }) => {
        setState({
          showDropdown: false
        });
      },

  setShowDropdown:
    (status: boolean): Action<State> =>
      ({ setState }) => {
        setState({
          showDropdown: status
        });
      },

  handleSearchPrecautionTable:
    (event: any): Action<State> =>
      ({ setState }) => {
        setState({
          searchedData: event,
          page: 1
        });
      },

  showModalPrecautionTable:
    (): Action<State> =>
      ({ setState }) => {
        setState({
          visibleModal: true
        });
      },

  handleSearchChangePrecautionTable:
    (event: React.ChangeEvent<HTMLInputElement>): Action<State> =>
      ({ setState }) => {
        if (event.target.value.toLowerCase() === "") {
          setState({
            searchedData: "",
          });
        }
      },

  handleDeletePrecautionTable:
    (id: number): Action<State> =>
      ({ setState, getState, dispatch }) => {
        const filteredData = getState().tableData.userPrecautions.filter((d: { id: number }) => d.id !== id);
        const newTablePrecautions: UserPrecautionsTableInfo = {
          totalItems: getState().tableData.totalItems - 1,
          userPrecautions: [...filteredData]
        }
        setState({
          tableData: newTablePrecautions
        });

        if (getState().page != 1 && getState().tableData.userPrecautions.length == 1) {
          setState({
            page: getState().page - 1,
            total: getState().total - 1
          });
        }

        notificationLogic("success", successfulDeleteAction("Пересторогу"));
        dispatch(actions.CreateDeleteNotification(id));
      },

  handleEditPrecautionTable:
    (id: number,
      precaution: Precaution,
      date: Date,
      endDate: Date,
      isActive: boolean,
      reason: string,
      status: UserPrecautionStatus,
      reporter: string,
      number: number,
      user: any,
      userId: string): Action<State> =>
      ({ setState, getState, dispatch }) => {
        const editedData = getState().tableData.userPrecautions.filter((d) => {
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
        const editedTablePrecautions: UserPrecautionsTableInfo = {
          totalItems: getState().tableData.totalItems,
          userPrecautions: [...editedData]
        }
        setState({
          tableData: editedTablePrecautions
        });
        notificationLogic("success", successfulUpdateAction("Пересторогу"));
        dispatch(CreateEditNotification(userId, precaution.name));
      },

  tableSettings:
    (res: any): Action<State> =>
      ({ setState }) => {
        setState({
          page: res[0].current,
          pageSize: res[0].pageSize,
        });

        res[1].status === null
          ? setState({ statusSorter: [] })
          : setState({ statusSorter: res[1].status });

        res[1].precautionName === null
          ? setState({ precautionNameSorter: [] })
          : setState({ precautionNameSorter: res[1].precautionName });

        res[1].date === null ? setState({ dateSorter: [] }) : setState({ dateSorter: res[1].date });

        res[2].order === undefined
          ? setState({ sortByOrder: [res[2].field, null] })
          : setState({ sortByOrder: [res[2].field, res[2].order] });
      },

  FormAddPrecaution:
    (newPrecaution: UserPrecaution, form: any): Action<State> =>
      async ({ dispatch, setState }) => {
        await precautionApi.addUserPrecaution({
          precautionId: newPrecaution.precautionId,
          reporter: newPrecaution.reporter,
          reason: newPrecaution.reason,
          status: newPrecaution.status!,
          number: newPrecaution.number,
          date: newPrecaution.date,
          userId: newPrecaution.userId
        });
        setState({
          visibleModal: false
        });
        form.resetFields();
        dispatch(actions.handleAdd());
        await createNotifications(newPrecaution);
      },

  addModalHandleSubmit:
    (values: any, form: any): Action<State> =>
      async ({ dispatch }) => {
        const newPrecaution: UserPrecaution = {
          id: 0,
          precautionId: JSON.parse(values.Precaution).id,
          precaution: JSON.parse(values.Precaution),
          user: JSON.parse(values.user),
          userId: JSON.parse(values.user).id,
          status: values.status,
          date: values.date,
          endDate: values.date,
          isActive: true,
          reporter: values.reporter,
          reason: values.reason,
          number: values.number,
        };

        await precautionApi
          .checkUserPrecautionsType(
            newPrecaution.userId,
            newPrecaution.precaution.name
          )
          .then((response) => {
            if (response.data) {
              activePrecautionNofication(newPrecaution);
            } else {
              dispatch(actions.FormAddPrecaution(newPrecaution, form));
            }
          });
      },

  addModalhandleCancel:
    (form: any): Action<State> =>
      ({ dispatch }) => {
        form.resetFields();
        dispatch(actions.setVisibleAddModal(false));
      },

  fetchDataFormAddPrecaution:
    (): Action<State> =>
      async ({ setState }) => {
        setState({
          loadingPrecautionStatus: true
        })
        await precautionApi
          .getPrecautions()
          .then((response) => {
            setState({
              addDistData: response.data,
              loadingPrecautionStatus: false
            })
          })
          .catch(() => {
            notificationLogic(
              "error",
              dataCantBeFetched("пересторог. Спробуйте пізніше")
            );
          });

        setState({
          loadingUserStatus: true
        })
        await precautionApi
          .getUsersForPrecaution()
          .then((response) => {
            setState({
              userData: response.data,
              loadingUserStatus: false
            })
          })
          .catch(() => {
            notificationLogic(
              "error",
              dataCantBeFetched("користувачів. Спробуйте пізніше")
            );
          });
      },

  dropDownHandleItemClick:
    (item: any, onDelete: any): Action<State> =>
      async ({ dispatch, getState }) => {
        switch (item.key) {
          case "1":
            window.open(`/userpage/main/${getState().userId}`);
            break;
          case "2":
            await deleteConfirm(getState().recordObj.id, onDelete);
            break;
          case "3":
            await dispatch(actions.setShowEditModal(true));
            break;
          default:
            break;
        }
      },

  setUserPrecaution:
    (precaution: UserPrecaution): Action<State> =>
      ({ setState }) => {
        setState({
          userPrecaution: precaution
        });
      },

  setShowEditModal:
    (status: boolean): Action<State> =>
      ({ setState }) => {
        setState({
          showEditModal: status
        });
      },

  setEditModalLoading:
    (status: boolean): Action<State> =>
      ({ setState }) => {
        setState({
          editModalLoading: status
        });
      },

  dropDownFetchData:
    (): Action<State> =>
      async ({ getState, dispatch }) => {
        await precautionApi
          .getUserPrecautionById(getState().recordObj.id)
          .then((res) => dispatch(actions.setUserPrecaution(res.data)));
      },

  setEditModalPrecaution:
    (precaution: Precaution): Action<State> =>
      ({ setState }) => {
        setState({
          editModalPrecaution: precaution
        })
      },

  setEditModalUser:
    (newUser: any): Action<State> =>
      ({ setState }) => {
        setState({
          editModalUser: newUser
        })
      },

  editModalHandleCancel:
    (form: any): Action<State> =>
      ({ setState }) => {
        form.resetFields();
        setState({
          showEditModal: false
        })
      },

  editModalSetPrecautionChange:
    (dist: any): Action<State> =>
      ({ setState }) => {
        dist = JSON.parse(dist);
        setState({
          editModalPrecaution: dist
        })
      },

  editModalSetUserChange:
    (user: any): Action<State> =>
      ({ setState }) => {
        user = JSON.parse(user);
        setState({
          editModalUser: user
        })
      },

  editModalHandleFinish:
    (editedUserPrecaution: any, form: any): Action<State> =>
      async ({ setState, getState, dispatch }) => {
        const newPrecaution: UserPrecautionEdit = {
          id: getState().userPrecaution.id,
          precautionId: getState().editModalPrecaution.id,
          userId: getState().editModalUser.id,
          status: editedUserPrecaution.status,
          date: editedUserPrecaution.date,
          reporter: editedUserPrecaution.reporter,
          reason: editedUserPrecaution.reason,
          number: editedUserPrecaution.number,
        };

        await precautionApi.editUserPrecaution(newPrecaution);
        setState({
          showEditModal: false
        })
        form.resetFields();
        const updatedUserPrecaution = (await precautionApi.getUserPrecautionById(newPrecaution.id)).data;
        dispatch(actions.handleEditPrecautionTable(
          updatedUserPrecaution.id,
          updatedUserPrecaution.precaution,
          updatedUserPrecaution.date,
          updatedUserPrecaution.endDate,
          updatedUserPrecaution.isActive,
          updatedUserPrecaution.reason,
          updatedUserPrecaution.status,
          updatedUserPrecaution.reporter,
          updatedUserPrecaution.number,
          updatedUserPrecaution.user,
          updatedUserPrecaution.user.id
        ));
      },

  editModalFetchData:
    (): Action<State> =>
      async ({ setState }) => {
        setState({
          editModalDistData: [],
          editModalUserData: [],
          editModalLoadingPrecautionStatus: true
        })

        await precautionApi
          .getPrecautions()
          .then((response) => {
            setState({
              editModalDistData: response.data,
              editModalLoadingPrecautionStatus: false
            })
          })
          .catch(() => {
            notificationLogic(
              "error",
              dataCantBeFetched("пересторог. Спробуйте пізніше")
            );
          });

        setState({
          editModalLoadingUserStatus: true
        })
        await precautionApi
          .getUsersForPrecaution()
          .then((response) => {
            setState({
              editModalUserData: response.data,
              editModalLoadingUserStatus: false
            })
          })
          .catch(() => {
            notificationLogic(
              "error",
              dataCantBeFetched("користувачів. Спробуйте пізніше")
            );
          });
      },

  CreateDeleteNotification:
    (id: number): Action<State> =>
      ({ getState }) => {
        const userPrecaution = getState().tableData.userPrecautions.find(
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
      },
};

const activePrecautionNofication = async (newPrecaution: UserPrecaution) => {
  await precautionApi
    .getUserActivePrecautionEndDate(
      newPrecaution.userId,
      newPrecaution.precaution.name
    )
    .then((response) => {
      notificationLogic(
        "error",
        failCreateAction(
          "пересторогу! Користувач має активну до " + response.data + "!"
        )
      );
    });
};

const createNotifications = async (userPrecaution: UserPrecaution) => {
  await NotificationBoxApi.createNotifications(
    [userPrecaution.userId],
    `Вам було надано нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
    NotificationBoxApi.NotificationTypes.UserNotifications,
    `/Precautions`,
    `Переглянути`
  );

  await NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId).then(
    (res) => {
      res.cityRegionAdmins.length !== 0 &&
        res.cityRegionAdmins.forEach(async (cra) => {
          await NotificationBoxApi.createNotifications(
            [cra.cityAdminId, cra.regionAdminId],
            `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/Precautions`,
            `Переглянути`
          );
        });
    }
  );
};

const CreateEditNotification =
  (userId: string, name: string): Action<State> =>
    () => {
      if (userId !== "" && name !== "") {
        NotificationBoxApi.createNotifications(
          [userId],
          `Вашу пересторогу: '${name}' було змінено. `,
          NotificationBoxApi.NotificationTypes.UserNotifications,
          `/state.tableData`,
          `Переглянути`
        );
        NotificationBoxApi.getCitiesForUserAdmins(userId).then((res) => {
          res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
              await NotificationBoxApi.createNotifications(
                [cra.cityAdminId, cra.regionAdminId],
                `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінену пересторогу: '${name}'. `,
                NotificationBoxApi.NotificationTypes.UserNotifications,
                `/state.tableData`,
                `Переглянути`
              );
            });
        });
      }
    };

const Store = createStore<State, Actions>({ initialState, actions });
export default Store;