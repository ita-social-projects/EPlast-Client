import Api from './api'

const getAll = async () => {
    const response = await Api.getAll("Events/types/1/categories");
    return response;
}

const getEvents = async () => {
    const response = await Api.getAll("types/1/categories/3/events");
    return response;
}

const getEventInfo = async () => {
    const response = await Api.getAll("Events/1/details");
    return response;
}

export default {getAll,getEvents,getEventInfo};