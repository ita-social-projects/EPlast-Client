import { Action, createHook, createStore } from "react-sweet-state";
import documentsApi, { TypeGetParser, TypeKeyValueParser } from "../api/documentsApi";
import openNotificationWithIcon from "../components/Notifications/Notification";
import DocumentsTableInfo from "../models/Documents/DocumentsTableInfo";

type State = {
    recordId: number
    data: DocumentsTableInfo[]
    page: number
    pageSize: number
    total: number
    count: number
    status: string
    searchedData: string
    x: number
    y: number
    tabList: {
        key: string
        tab: string
    }[]
};

const initialState: State = {
    recordId: 0,
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    count: 0,
    status: "legislation",
    searchedData: "",
    x: 0,
    y: 0,
    tabList: [
        {
            key: "legislation",
            tab: "Нормативні акти",
        },
        {
            key: "Methodics",
            tab: "Методичні документи",
        },
        {
            key: "Other",
            tab: "Різне",
        },
    ],
};

const actions = {
    init: (): Action<State> => async ({ setState, getState }) => {
        const res: DocumentsTableInfo[] = await documentsApi.getAllDocuments(
            getState().searchedData,
            getState().page,
            getState().pageSize,
            getState().status
        );

        setState({
            total: res[0]?.total,
            count: res[0]?.count,
            data: res,
        });
        console.log(getState())
    },
    add: (): Action<State> => async ({ setState, getState }) => {
        const { data, total, count } = getState()
        try {
            const res = await documentsApi.getLast()
            const dec: DocumentsTableInfo = {
                id: res.id,
                name: res.name,
                governingBody: res.governingBody.governingBodyName,
                type: TypeGetParser(res.type),
                description: res.description,
                fileName: res.fileName,
                date: res.date,
                total: total + 1,
                count: count + 1,
            };
            console.log(dec)
            if (TypeKeyValueParser(TypeGetParser(res.type))
                === getState().status) {
                setState({
                    total: total + 1,
                    count: count + 1,
                    data: [...data, dec]
                });
            }
        } catch (error) {
            openNotificationWithIcon("error", "Документу не існує");
        }
    },
    delete: (id: number): Action<State> => async ({ setState, getState }) => {
        const { data, total, count } = getState()
        const filteredData = data.filter((d) => d.id !== id);

        setState({
            data: [...filteredData],
            total: total - 1,
            count: count - 1
        })
    },
    search: (event: any): Action<State> => async ({ setState }) => {
        setState({
            page: 1,
            searchedData: event,
        })
    },
    resetSearchedData: (): Action<State> => async ({ setState }) => {
        setState({
            searchedData: "",
        })
    },
    changePagination: (number: number, size: number): Action<State> => async ({ setState }) => {
        setState({
            page: number,
            pageSize: size
        })
    },
    changeStatus: (status: string): Action<State> => async ({ setState }) => {
        setState({
            status: status
        })
    },
    setXY: (x: number, y: number): Action<State> => async ({ setState }) => {
        setState({
            x: x,
            y: y
        })
    },
    setRecord: (id: number): Action<State> => async ({ setState }) => {
        setState({
            recordId: id
        })
    },
};

type Actions = typeof actions;

const Store = createStore<State, Actions>({
    initialState,
    actions,
});

export const DocumentsStore = createHook(Store);