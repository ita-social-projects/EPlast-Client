import { createHook, createStore } from "react-sweet-state"
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { getUserAccess } from "../api/regionsBoardApi";
import { StoreActions } from "./StoreActions";

export type UserPerksStoreState = Record<string, boolean>;

// Pick only "refreshAll" from StoreActions
export type UserPerksStoreActions = Pick<
  StoreActions<UserPerksStoreState, string, boolean>,
  "refreshAll"
>;

const initialState: UserPerksStoreState = {};

const actions: UserPerksStoreActions = {
  refreshAll: () => async ({ setState }) => {
    const user: any = jwt(AuthLocalStorage.getToken() as string);
    const response = await getUserAccess(user.nameid);

    setState(response.data);
  },
};

const userPerksStore = createStore<UserPerksStoreState, UserPerksStoreActions>({
  initialState,
  actions,
  name: "UserPerksStore"
});

/**
 * Get all perks.
 * 
 * @returns Record (dictionary) with perks and their values as KeyValue pairs of type `[key: string]: boolean`.
 */
export const UseStoredUserPerks = createHook(userPerksStore);

/**
 * @deprecated
 * Use {@link UseStoredUserPerkByKey} instead to check if user has specified perk.
 * 
 * Select and return as a list those perks, that are positive (`true`).
 * 
 * @returns List with perks that are `true`. May return empty array, if no perks are positive.
 * 
 */
export const UseOnlyPositiveStoredUserPerksAsList = createHook(userPerksStore, {
  selector: (state) => {
    const list: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const key in state) {
      if (state[key]) list.push(key);
    }

    return list;
  }
});

/**
 * Get User Perk value by key.
 * 
 * @param key: string - Key of the perk to be checked.
 * 
 * @returns Boolean value of the perk by specified key. Undefined, if key is not found.
 */
export const UseStoredUserPerkByKey = createHook(userPerksStore, {
  selector: (state, key: string): boolean | undefined => state[key]
});