import {
  Action,
  createActionsHook,
  createHook,
  createStore,
  defaults,
} from "react-sweet-state";
import distinctionApi from "../api/distinctionApi";
import {
  failCreateAction,
  failDeleteAction,
  failEditAction,
  failGetAction,
} from "../components/Notifications/Messages";
import notificationLogic from "../components/Notifications/Notification";
import Distinction from "../pages/Distinction/Interfaces/Distinction";
defaults.devtools = true;

type State = {
  distinctionTypes: Distinction[];
  editIsVisible: boolean;
  editedDistinction: Distinction;
  deleteModalIsVisible: boolean;
  deleteDitinctionId: number;
};

type Actions = typeof actions;

const emptyDistinction: Distinction = {
  id: 0,
  name: "",
};

const initialState: State = {
  distinctionTypes: [],
  editIsVisible: false,
  editedDistinction: emptyDistinction,
  deleteModalIsVisible: false,
  deleteDitinctionId: 0,
};

const actions = {
  fetchData: (): Action<State> => async ({ setState }) => {
    await distinctionApi
      .getDistinctions()
      .then((response) => setState({ distinctionTypes: response.data }))
      .catch(() => {
        notificationLogic(
          "error",
          failGetAction("типи відзначень. Спробуйте пізніше")
        );
      });
  },

  openEditForm: (distinction: Distinction): Action<State> => ({ setState }) => {
    setState({
      editIsVisible: true,
      editedDistinction: distinction,
    });
  },

  closeEditForm: (): Action<State> => ({ setState }) => {
    setState({
      editIsVisible: false,
      editedDistinction: emptyDistinction,
    });
  },

  addDistinction: (distinction: Distinction): Action<State> => async ({
    dispatch,
  }) => {
    await distinctionApi
      .addDistinction(distinction)
      .then(async () => {
        notificationLogic("success", "Тип відзначення додано!");
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("тип відзначення."));
      });

    await dispatch(actions.fetchData());
  },

  editDistinction: (distinction: Distinction): Action<State> => async ({
    dispatch,
  }) => {
    await distinctionApi
      .editDistinction(distinction)
      .then(async () => {
        notificationLogic("success", "Тип відзначення змінено!");
      })
      .catch(() => {
        notificationLogic("error", failEditAction("тип відзначення."));
      });

    await dispatch(actions.closeEditForm());
    await dispatch(actions.fetchData());
  },

  deleteDistinction: (distinctionId: number): Action<State> => async ({
    dispatch,
  }) => {
    await distinctionApi
      .deleteDistinction(distinctionId)
      .then(async () => {
        notificationLogic("success", "Тип відзначення видалено!");
      })
      .catch(() => {
        notificationLogic("error", failDeleteAction("тип відзначення."));
      });

    await dispatch(actions.closeEditForm());
    await dispatch(actions.fetchData());
  },
};

const store = createStore<State, Actions>({
  initialState,
  actions,
});

export const useDistinctions = createHook(store);
export const useDistinctionsActions = createActionsHook(store);
