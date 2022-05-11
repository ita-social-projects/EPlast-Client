import { createStore,
  createSubscriber,
  createHook,
  createContainer,
  Action,} from 'react-sweet-state';
import UserPrecautionTableInfo from '../Interfaces/UserPrecauctionTableInfo';
import notificationLogic from "../../../components/Notifications/Notification";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { successfulCreateAction, successfulDeleteAction, successfulUpdateAction } from '../../../components/Notifications/Messages';
import PrecautionTableSettings from '../../../models/Precaution/PrecautionTableSettings';
import precautionApi from "../../../api/precautionApi";
import Precaution from '../Interfaces/Precaution';

type State = {
  loading: boolean,
  showDropdown: boolean,
  visibleModal: boolean,
  visibleModalEditDist: boolean,

  searchedData: string,
  statusSorter:any[],
  precautionNameSorter:any[],
  dateSorter:any[],
  sortByOrder:any[],
  pageSize: number,
  page: number,
  total: number,

  precautions: UserPrecautionTableInfo[],
};

type Actions = typeof actions;

const initialState = { 
  loading: false,  
  showDropdown: false,
  visibleModal:false,
  visibleModalEditDist:false,

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
  },]
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

const fetchData =
   (): Action<State> => 
   async ({ setState, getState }) => {
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
  };

const actions = {
  handleFetchData:
   (): Action<State> => 
   async ({dispatch}) => {    
    dispatch(fetchData());
  },

  handleAdd:
   (): Action<State> => 
   async ({ setState, dispatch }) => {    
    setState({
      visibleModal: true
    });
    dispatch(fetchData());

    setState({
      visibleModal: false
    });
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
    }
};

const Store = createStore<State, Actions>({initialState, actions});

export default Store;