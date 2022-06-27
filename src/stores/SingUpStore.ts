import { Action, createHook, createStore } from "react-sweet-state";
import UkraineOblasts from "../models/Oblast/UkraineOblasts";
import ActiveRegion from "../models/Region/ActiveRegion";
import TermsOfUse from "../models/TermsOfUse/TermsOfUseModel";
import { GenderIdEnum } from "../models/UserTable/Gender";
import City, { ActiveCity } from "../pages/AnnualReport/Interfaces/City";

type PageInfo = {
    total?: number
    size?: number
    number?: number
    text?: string
}

type State = {
    cities: ActiveCity[]
    regions: ActiveRegion[]
    terms: TermsOfUse
    cityPage: PageInfo
    regionPage: PageInfo
    formData: {
        lastName: string
        firstName: string
        fatherName: string
        address: string
        cityId?: number
        regionId?: number
        email: string
        password: string
        confirmPassword: string
        genderId: GenderIdEnum
        phoneNumber: string
        referal: string
        facebookLink: string
        twitterLink: string
        instagramLink: string
        birthday?: Date,
        oblast: UkraineOblasts,
    }
};

const initialState: State = {
    cities: [],
    regions: [],
    terms: {
        termsId: 0,
        termsTitle: "",
        termsText: "Немає даних",
        datePublication: new Date(),
    },
    cityPage: {
        total: 0,
        size: 30,
        number: 1,
        text: ""
    },
    regionPage: {
        total: 0,
        size: 30,
        number: 1,
        text: ""
    },
    formData: {
        lastName: "",
        firstName: "",
        fatherName: "",
        address: "",
        cityId: undefined,
        regionId: undefined,
        email: "",
        referal: "",
        password: "",
        confirmPassword: "",
        genderId: GenderIdEnum.UnwillingToChoose,
        phoneNumber: "",
        facebookLink: "",
        twitterLink: "",
        instagramLink: "",
        birthday: undefined,
        oblast: UkraineOblasts.NotSpecified
    }
};

const actions = {
    setTerms: (termsOfUse: TermsOfUse): Action<State> => async ({ setState, getState }) => {
        setState({
            terms: termsOfUse,
        })
    },
    setCities: (cities: ActiveCity[]): Action<State> => async ({ setState, getState }) => {
        setState({
            cities: cities
        })
    },
    addRegionsRange: (regions: ActiveRegion[]): Action<State> => async ({ setState, getState }) => {
        setState({
            regions: [...getState().regions, ...regions]
        })
    },
    setRegions: (regions: ActiveRegion[]): Action<State> => async ({ setState, getState }) => {
        setState({
            regions: regions
        })
    },
    addCityRange: (cities: ActiveCity[]): Action<State> => async ({ setState, getState }) => {
        setState({
            cities: [...getState().cities, ...cities]
        })
    },
    setCityPageInfo: ({ total, number, text: selectedCity, size }: PageInfo): Action<State> => async ({ setState, getState }) => {
        setState({
            cityPage: {
                total: total || getState().cityPage.total,
                number: number || getState().cityPage.number,
                size: getState().cityPage.size,
                text: selectedCity
            }
        })
    },
    setRegionPageInfo: ({ total, number, text: selectedCity, size }: PageInfo): Action<State> => async ({ setState, getState }) => {
        setState({
            regionPage: {
                total: total || getState().cityPage.total,
                number: number || getState().cityPage.number,
                size: getState().cityPage.size,
                text: selectedCity
            }
        })
    },
    setFormData: (data: any): Action<State> => async ({ setState, getState }) => {
        setState({
            formData: data
        })
    },
    setReferal: (value: string): Action<State> => async ({ setState, getState }) => {
        console.log(value)
        setState({
            formData: {
                ...getState().formData,
                referal: value,
            }
        })
    },
};

type Actions = typeof actions;

const Store = createStore<State, Actions>({
    initialState,
    actions,
});

export const SingUpStore = createHook(Store);
