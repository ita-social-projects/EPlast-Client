import { Action, createHook, createStore } from "react-sweet-state";
import documentsApi, { TypeGetParser, TypeKeyValueParser } from "../api/documentsApi";
import openNotificationWithIcon from "../components/Notifications/Notification";
import { DocumentPost } from "../models/Documents/DocumentPost";
import DocumentsTableInfo from "../models/Documents/DocumentsTableInfo";

type DocumentState = {
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

const initialState: DocumentState = {
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
    init: (documents: DocumentsTableInfo[]): Action<DocumentState> => async ({ setState, getState }) => {
        setState({
            total: documents[0]?.total,
            count: documents[0]?.count,
            data: documents,
        });
    },
    add: (document: DocumentPost): Action<DocumentState> => async ({ setState, getState }) => {
        const { data, total, count } = getState()

        const dec: DocumentsTableInfo = {
            id: document.id,
            name: document.name,
            governingBody: document.governingBody.governingBodyName,
            type: TypeGetParser(document.type),
            description: document.description,
            fileName: document.fileName,
            date: document.date,
            total: total + 1,
            count: count + 1,
        };

        if (TypeKeyValueParser(TypeGetParser(document.type))
            === getState().status) {
            setState({
                total: total + 1,
                count: count + 1,
                data: [...data, dec]
            });
        }
    },
    delete: (id: number): Action<DocumentState> => async ({ setState, getState }) => {
        const { data, total, count } = getState()
        const filteredData = data.filter((d) => d.id !== id);

        setState({
            data: [...filteredData],
            total: total - 1,
            count: count - 1
        })
    },
    search: (event: any): Action<DocumentState> => async ({ setState }) => {
        setState({
            page: 1,
            searchedData: event,
        })
    },
    resetSearchedData: (): Action<DocumentState> => async ({ setState }) => {
        setState({
            searchedData: "",
        })
    },
    changePagination: (number: number, size: number): Action<DocumentState> => async ({ setState }) => {
        setState({
            page: number,
            pageSize: size
        })
    },
    changeStatus: (status: string): Action<DocumentState> => async ({ setState }) => {
        setState({
            status: status
        })
    },
    setXY: (x: number, y: number): Action<DocumentState> => async ({ setState }) => {
        setState({
            x: x,
            y: y
        })
    },
    setRecord: (id: number): Action<DocumentState> => async ({ setState }) => {
        setState({
            recordId: id
        })
    },
};

type Actions = typeof actions;

const Store = createStore<DocumentState, Actions>({
    initialState,
    actions,
});

export const DocumentsStore = createHook(Store);