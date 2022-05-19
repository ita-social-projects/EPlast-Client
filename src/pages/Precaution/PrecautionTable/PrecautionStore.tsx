import { createStore, Action} from 'react-sweet-state';
import UserPrecautionTableInfo from '../Interfaces/UserPrecauctionTableInfo';
import notificationLogic from "../../../components/Notifications/Notification";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { failCreateAction, successfulCreateAction, successfulDeleteAction, successfulUpdateAction } from '../../../components/Notifications/Messages';
import PrecautionTableSettings from '../../../models/Precaution/PrecautionTableSettings';
import precautionApi from "../../../api/precautionApi";
import Precaution from '../Interfaces/Precaution';
import UserPrecaution from '../Interfaces/UserPrecaution';
import adminApi from '../../../api/adminApi';
import { Roles } from "../../../models/Roles/Roles";

type State = {
  loading: boolean,
  showDropdown: boolean,
  visibleModal: boolean,
  editVisibleModal: boolean,

  searchedData: string,
  statusSorter:any[],
  precautionNameSorter:any[],
  dateSorter:any[],
  sortByOrder:any[],
  pageSize: number,
  page: number,
  total: number,

  precautions: UserPrecautionTableInfo[],

  addDistData: Precaution[],
  loadingUserStatus: boolean,
  userData: any[]

  editDistData: Precaution[],
  editTitle: string,
  editCurDist: Precaution,
  editVisible: boolean,
  editVisRule: boolean,
  editLoading: boolean,
};

type Actions = typeof actions;

const initialState = { 
  loading: false,  
  showDropdown: false,
  visibleModal:false,
  editVisibleModal:false,

  searchedData:"",
  statusSorter: [],
  precautionNameSorter: [],
  dateSorter:[],
  sortByOrder:["number", "ascend"],
  pageSize:10,
  page:1,
  total: 0,

  precautions: [{
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
  }],

  addDistData: Array<Precaution>(),
  loadingUserStatus: false,
  userData: [
    {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        birthday: "",
      },
      regionName: "",
      cityName: "",
      clubName: "",
      userPlastDegreeName: "",
      userRoles: "",
    },
  ],

  editDistData:[{
    name: "",
    id: 0,
  }],
  editTitle:"",
  editCurDist: {
    name: "",
    id: 0,
  },
  editVisible: false,
  editVisRule: false,
  editLoading: false,
};

const actions = {
  handleFetchData:
   (): Action<State> => 
   async ({setState, getState}) => {    
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

    const res: UserPrecautionTableInfo[] = await precautionApi.getAllUsersPrecautions(
      NewTableSettings
    );

    setState({
      precautions: res,
      loading: false,
      total: res[0]?.total
    });
  },

  setVisibleModal:
    (visible: boolean): Action<State> =>
      ({setState}) => {
        setState({
          visibleModal: visible
        })      
    },
  
  setEditLoading:
    (status: boolean): Action<State> =>
      ({setState}) => {
        setState({
          editLoading: status
        })      
    },
  
  editHandleDelete:
   (id: number): Action<State> =>
   ({setState, getState}) => {
      const filteredData = getState().editDistData.filter((d: { id: number }) => d.id !== id);
      setState({
        editDistData: [...filteredData],
        editVisible: false
      })
      notificationLogic("success", "Тип перестороги успішно видалено!");
    },

  editHandleAdd:
   ():Action<State> =>
   async ({setState, getState}) => {
      const newPrecaution: Precaution = {
        id: 0,
        name: getState().editTitle,
      };
      if (getState().editTitle.length != 0) {
        await precautionApi.addPrecaution(newPrecaution);
        const res: Precaution[] = (await precautionApi.getPrecautions()).data;
        setState({
          editDistData: res,
          editTitle: ""
        })
        notificationLogic("success", "Тип перестороги додано!");
      } else {
        notificationLogic("error", "Хибна назва");
      }
    },

  editSetTitle:
   (newTitle: any):Action<State> =>
    async ({setState}) => {
      setState({
        editTitle: newTitle
      })
    },  
  
  editSetVisRule:
    (newVisRule: boolean):Action<State> =>
     async ({setState}) => {
       setState({
         editVisRule: newVisRule
       })
     }, 

  editShowEdit:
   (id: number):Action<State> =>
    async ({setState, getState}) => {
      const Precaution = (await precautionApi.getPrecautionById(id)).data;
      setState({
        editCurDist: Precaution 
      })
      if (getState().editCurDist.id != id) {
        setState({
          editVisible: true
        })       
      } else {
        setState({
          editVisible: false,
          editCurDist: {
            name: "",
            id: 0,
          }        
        })
      }
    },
  
  editHandleEdit:
   ():Action<State> =>
    async ({setState, getState}) => {
      if (getState().editCurDist.name.length !== 0) {
        await precautionApi.editPrecaution(getState().editCurDist);
        notificationLogic("success", "Тип перестороги успішно змінено!");
        actions.editFetchData();
        setState({
          editCurDist: {
            name: "",
            id: 0,
          },
          editVisible: false
        })
      } else notificationLogic("error", "Хибна назва");
    },
  
  setEditVisibleModal:
    (visible: boolean): Action<State> =>
      ({setState}) => {
        setState({
          editVisibleModal: visible
        })      
    },  

  handleAdd:
   (): Action<State> => 
   async ({ setState, dispatch }) => {    
    setState({
      visibleModal: false
    });
    dispatch(actions.handleFetchData());
    notificationLogic("success", successfulCreateAction("Догану"));
  },

  handleClickAway:
   (): Action<State> => 
   ({ setState }) => {    
    setState({
      showDropdown: false
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
  
  editFetchData:
  ():Action<State> =>
  async ({setState}) => {
      const distData = (await precautionApi.getPrecautions()).data;
      setState({
        editDistData: distData
      })
    },

  editSetCurDist:
    (newCurDist: any): Action<State> => 
      ({ setState }) => {
        setState({
          editCurDist: newCurDist  
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
      if (event.target.value.toLowerCase() === ""){
        setState({
          searchedData: "",
        });
      }
    },

  handleDeletePrecautionTable:
    (id: number): Action<State> =>      
    ({ setState, getState, dispatch}) => {
      const filteredData = getState().precautions.filter((d: { id: number }) => d.id !== id);
      setState({
        precautions: [...filteredData] 
      });

      if (getState().page != 1 && getState().precautions.length == 1) {
        setState({
          page: getState().page - 1 ,
          total: getState().total -1
        });
      }
      
      notificationLogic("success", successfulDeleteAction("Пересторогу"));  
      dispatch(CreateDeleteNotification(id)); 
    },

  showModalEditTypes:
   (newEditVisibleModal: boolean):Action<State> =>
   ({setState}) => {
     setState({
       editVisibleModal: newEditVisibleModal
     })
    },

  handleEditPrecautionTable:
    (id: number,
      precaution: Precaution,
      date: Date,
      endDate: Date,
      isActive: boolean,
      reason: string,
      status: string,
      reporter: string,
      number: number,
      user: any,
      userId: string): Action<State> =>      
    ({ setState, getState, dispatch}) => {
      const editedData = getState().precautions.filter((d) => {
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
      setState({
        precautions: [...editedData] 
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
        ? setState({statusSorter: []})
        : setState({statusSorter: res[1].status});
  
      res[1].precautionName === null
        ? setState({precautionNameSorter: []})
        : setState({precautionNameSorter: res[1].precautionName});
  
      res[1].date === null ? setState({dateSorter: []}) : setState({dateSorter: res[1].date});
  
      res[2].order === undefined
        ? setState({sortByOrder: [res[2].field, null]})
        : setState({sortByOrder:[res[2].field, res[2].order]});
    },

    FormAddPrecaution:
    (newPrecaution: UserPrecaution, form: any):Action<State> =>
    async () => {
      console.log("add")
      await precautionApi.addUserPrecaution(newPrecaution);
      actions.setVisibleModal(false);
      form.resetFields();
      actions.handleAdd();
      await createNotifications(newPrecaution);
    },

    handleSubmit:
    (values: any, form:any): Action<State> => 
    async () => {
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
      console.log("Submit")
      
      await precautionApi
        .checkUserPrecautionsType(
          newPrecaution.userId,
          newPrecaution.precaution.name
        )
        .then((response) => {
          if (response.data) {
            activePrecautionNofication(newPrecaution);
          } else {
            console.log("aadd")
            actions.FormAddPrecaution(newPrecaution, form);
          }
        });
    },

    handleCancel:
    (form:any):Action<State> =>
    () => {
      form.resetFields();
      actions.setVisibleModal(false);
    },

    fetchDataFormAddPrecaution:
     (): Action<State> =>
     async ({setState}) => {
      await precautionApi.getPrecautions().then((response) => {
        setState({
          addDistData: response.data
        })
      });
      setState({
        loadingUserStatus: true
      })
      await adminApi
        .getUsersByAnyRole(
          [
            [
              Roles.CityHead,
              Roles.CityHeadDeputy,
              Roles.CitySecretary,
              Roles.EventAdministrator,
              Roles.GoverningBodyHead,
              Roles.GoverningBodySecretary,
              Roles.GoverningBodySectorHead,
              Roles.GoverningBodySectorSecretary,
              Roles.KurinHead,
              Roles.KurinHeadDeputy,
              Roles.KurinSecretary,
              Roles.OkrugaHead,
              Roles.OkrugaHeadDeputy,
              Roles.OkrugaSecretary,
              Roles.PlastHead,
              Roles.PlastMember,
              Roles.RegionBoardHead,
              Roles.RegisteredUser,
              Roles.Supporter,
            ],
          ],
          true
        )
        .then((response) => {
          setState({
            userData: response.data,
            loadingUserStatus: false
          })
        });
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

const CreateDeleteNotification = 
  (id: number): Action<State> => 
  ({ getState }) => {
    const userPrecaution = getState().precautions.find((d: { id: number }) => d.id === id);
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
      `/precautions`,
      `Переглянути`
    );
    NotificationBoxApi.getCitiesForUserAdmins(userId).then((res) => {
      res.cityRegionAdmins.length !== 0 &&
        res.cityRegionAdmins.forEach(async (cra) => {
          await NotificationBoxApi.createNotifications(
            [cra.cityAdminId, cra.regionAdminId],
            `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінену пересторогу: '${name}'. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/precautions`,
            `Переглянути`
          );
        });
    });
  }
};

const Store = createStore<State, Actions>({initialState, actions});

export default Store;