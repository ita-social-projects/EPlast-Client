import Api from './api';
// import { NewEvent } from '../models/NewEvent.model';

const getEventsUser = async (id: string | undefined) => {
    const response = await Api.get(`EventsUsers/eventsUsers/${id}`);

    return response;
};

const getCreatedArchivedEvents = async (id: string | undefined) => {
    const response = await Api.get(`EventsUsers/createArchivedEvents/${id}`);

    return response;
};

const getDataForNewEvent = async () => {
    const response = await Api.get(`EventsUsers/dataForNewEvent`);

    return response;
};

const getEditedEvent = async (id: number) => {
    const response = await Api.get(`EventsUsers/editedEvent/${id}`);

    return response;
};

const getDataForCalendar = async () => {
    const response = await Api.get(`EventsCalendar/eventsForCalendar`);

    return response;
}

const getActionsForCalendar = async () => {
    const response = await Api.get(`EventsCalendar/actionsForCalendar`);

    return response;
}

const getEducationsForCalendar = async () => {
    const response = await Api.get(`EventsCalendar/educationsForCalendar`);

    return response;
}

const getCampsForCalendar = async () => {
    const response = await Api.get(`EventsCalendar/campsForCalendar`);

    return response;
}

const post = async (data: any) => {
    const response = await Api.post(`EventsUsers/newEvent`, data);

    return response;
};

const put = async (data: any) => {
    const response = await Api.put("EventsUsers/editedEvent", data);

    return response;
}

export default {
    getEventsUser,
    getCreatedArchivedEvents,
    getDataForNewEvent,
    getEditedEvent,
    getDataForCalendar,
    getActionsForCalendar,
    getEducationsForCalendar,
    getCampsForCalendar,
    post,
    put
};