import { Action, createHook, createStore } from "react-sweet-state";

type UserTableStoreState = {
    dynamicCities: number[],
    dynamicClubs: number[],
    dynamicDegrees: number[],
    dynamicRegions: number[]
};

type UserTableStoreActions = typeof actions;

const initialState: UserTableStoreState = {
    dynamicCities: [],
    dynamicClubs: [],
    dynamicDegrees: [],
    dynamicRegions: []
}

const actions = {
    addDynamicCities: (cityId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        let _dynamicCities = getState().dynamicCities;
        _dynamicCities.push(cityId);
        setState({
            dynamicCities: _dynamicCities
        })
    },
    addDynamicClubs: (clubId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        let _dynamicClubs = getState().dynamicClubs;
        _dynamicClubs.push(clubId);
        setState({
            dynamicClubs: _dynamicClubs
        })
    },
    addDynamicDegrees: (degreeId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        let _dynamicDegrees = getState().dynamicDegrees;
        _dynamicDegrees.push(degreeId);
        setState({
            dynamicDegrees: _dynamicDegrees
        })
    },
    addDynamicRegions: (regionId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        let _dynamicRegions = getState().dynamicRegions;
        _dynamicRegions.push(regionId);
        setState({
            dynamicRegions: _dynamicRegions
        })  
    },
    removeDynamicCities: (cityId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicCities: getState().dynamicCities.filter(p => p !== cityId)
        })
    },
    removeDynamicClubs: (clubId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicClubs: getState().dynamicClubs.filter(p => p !== clubId)
        })
    },
    removeDynamicDegrees: (degreeId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicDegrees: getState().dynamicDegrees.filter(p => p !== degreeId)
        })
    },
    removeDynamicRegions: (regionId: number): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicRegions: getState().dynamicRegions.filter(p => p !== regionId)
        })
    },
    setCities: (cities : number[]): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicCities: cities
        })
    },
    setClubs: (clubs : number[]): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicClubs: clubs
        })
    },
    setDegrees: (degrees : number[]): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicDegrees: degrees
        })
    },
    setRegions: (regions : number[]): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicRegions: regions
        })
    },
    clearState: (): Action<UserTableStoreState> => async ({setState, getState}) =>{
        setState({
            dynamicCities: [],
            dynamicClubs: [],
            dynamicDegrees: [],
            dynamicRegions: []
        })
    }
}

const UserTableStore = createStore<UserTableStoreState, UserTableStoreActions>({
    initialState,
    actions
});

export const useUserTableStore = createHook(UserTableStore);