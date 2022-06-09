import { Action, createHook, createStore } from "react-sweet-state";
import TermsOfUse from "../models/TermsOfUse/TermsOfUseModel";
import { GenderIdEnum } from "../models/UserTable/Gender";
import City, { ActiveCity } from "../pages/AnnualReport/Interfaces/City";

type PageInfo = {
    total?: number
    size?: number
    number?: number
    selectedCity?: string
}

type State = {
    cities: ActiveCity[]
    terms: TermsOfUse
    page: PageInfo
    formData: {
        surName: string
        name: string
        middleName: string
        address: string
        cityId: number
        email: string
        password: string
        confirmPassword: string
        genderId: GenderIdEnum
        phone: string
        facebookLink: string
        twitterLink: string
        instagramLink: string
    }
};

const initialState: State = {
    cities: [],
    terms: {
        termsId: 0,
        termsTitle: "",
        termsText: "Немає даних",
        datePublication: new Date(),
    },
    page: {
        total: 0,
        size: 30,
        number: 1,
        selectedCity: ""
    },
    formData: {
        surName: "",
        name: "",
        middleName: "",
        address: "",
        cityId: 0,
        email: "",
        password: "",
        confirmPassword: "",
        genderId: GenderIdEnum.UnwillingToChoose,
        phone: "",
        facebookLink: "",
        twitterLink: "",
        instagramLink: ""
    }
};

const actions = {
    setCities: (cities: ActiveCity[]): Action<State> => async ({ setState, getState }) => {
        setState({
            cities: cities
        })
    },
    setTerms: (termsOfUse: TermsOfUse): Action<State> => async ({ setState, getState }) => {
        setState({
            terms: termsOfUse,
        })
    },
    addCityRange: (cities: ActiveCity[]): Action<State> => async ({ setState, getState }) => {
        setState({
            cities: [...getState().cities, ...cities]
        })
    },
    setPageInfo: ({ total, number, selectedCity, size }: PageInfo): Action<State> => async ({ setState, getState }) => {
        setState({
            page: {
                total: total || getState().page.total,
                number: number || getState().page.number,
                size: getState().page.size,
                selectedCity: selectedCity
            }
        })
    },
    setFormData: (data: any): Action<State> => async ({ setState, getState }) => {
        setState({
            formData: data
        })
    },
};

type Actions = typeof actions;

const Store = createStore<State, Actions>({
    initialState,
    actions,
});

export const SingUpStore = createHook(Store);
