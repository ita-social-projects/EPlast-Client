import { createHook, createStore } from "react-sweet-state";
import { createCity, getActiveCitiesByPage, getCities, getCityById, getNotActiveCitiesByPage, removeCity, updateCity } from "../api/citiesApi";
import CityProfile from "../models/City/CityProfile"
import { StoreActions } from "./StoreActions";

type CitiesStoreState = Record<number, CityProfile>;

type CitiesStoreActions = StoreActions<CitiesStoreState, number, CityProfile>;

const initialState: CitiesStoreState = {};

const actions: CitiesStoreActions = {
    refreshAll: (filters) => async ({ getState, setState }) => {
        const params = filters as {
            ["name"]: string | undefined,
            ["isActive"]: boolean | undefined
        };

        // TODO: make use of filters params
        const result: CityProfile[] = (await getCities()).data;
        const newState: CitiesStoreState = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const cp of result) {
            newState[cp.id] = cp;
        }

        setState(newState);
    },

    refreshByPage: (page, pageSize, filters, preserveOldState) => async ({ getState, setState }) => {
        const params = filters as {
            ["name"]: string | undefined,
            ["isActive"]: boolean | undefined
        };

        // TODO: merge those two methods in one, pass isActive as a query param to backend
        const result: CityProfile[] = params.isActive
            ? (await getActiveCitiesByPage(page, pageSize, params.name)).data
            : (await getNotActiveCitiesByPage(page, pageSize, params.name)).data;
        const newState: CitiesStoreState = preserveOldState
            ? { ...getState() }
            : {};

        // eslint-disable-next-line no-restricted-syntax
        for (const cp of result) {
            newState[cp.id] = cp;
        }

        setState(newState);
    },

    refreshOneByKey: (key, preserveOldState?) => async ({ getState, setState }) => {
        const result: CityProfile = (await getCityById(key)).data;
        const newState: CitiesStoreState = preserveOldState
            ? { ...getState() }
            : {};

        newState[key] = result;

        setState(newState);
    },

    create: (entity) => async ({ getState, setState }) => {
        const result: number = (await createCity(entity)).data;

        const createdEntity = { ...entity } as CityProfile;
        createdEntity.id = result;

        setState({
            ...getState(),
            [result]: createdEntity
        });

        return createdEntity;
    },

    updateByKey: (key, newEntity) => async ({ getState, setState }) => {
        await updateCity(key, newEntity);

        setState({
            ...getState(),
            [key]: newEntity
        });
    },

    patchByKey: (key, patchDoc) => ({ getState, setState }) => {
        throw new Error('Not Implemented Exception');
    },

    deleteAll: () => ({ getState, setState }) => {
        throw new Error('Not Implemented Exception');
    },

    deleteByKey: (key) => async ({ getState, setState }) => {
        await removeCity(key);

        setState({
            ...getState(),
            [key]: undefined
        });
    },
};

const citiesStore = createStore<CitiesStoreState, CitiesStoreActions>({
    initialState,
    actions,
    name: "CitiesStore"
});

export const UseAllStoredCities = createHook(citiesStore);

export const UseAllStoredCitiesAsList = createHook(citiesStore, {
    selector: (state) => {
        const list: CityProfile[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const key in state) {
            if (state[key] as CityProfile) list.push(state[key]);
        }

        return list;
    }
});

export const UseStoredCityById = createHook(citiesStore, {
    selector: (state, id: number): CityProfile | undefined => state[id]
});