import Api from './api'

const getCategories = async () => {
    const response = await Api.getAll("Events/types/1/categories");
    return response;
}

const getEvents = async (typeId: number, categoryId: number) => {
    const response = await Api.getAll(`types/${typeId}/categories/${categoryId}/events`);
    return response;
}

const getEventInfo = async (id: number) => {
    const response = await Api.getAll(`Events/${id}/details`);
    return response;
}

export default {getCategories, getEvents, getEventInfo};