import Api from './api'

const getCategories = async () => {
    const response = await Api.get("Events/types/1/categories");
    return response;
}

const getEvents = async (typeId: number, categoryId: number) => {
    const response = await Api.get(`types/${typeId}/categories/${categoryId}/events`);
    return response;
}

const getEventInfo = async (id: number) => {
    const response = await Api.get(`Events/${id}/details`);
    return response;
}

const remove = async (id: number) => {
    const response = await Api.remove(`Events/${id}`);
    return response;
};

const removeParticipant = async (id: number) => {
    const response = await Api.remove(`Events/${id}/participants`);
    return response;
};

const createParticipant = async (id: number) => {
    const response = await Api.post(`Events/${id}/participants`);
    return response;
};

const approveParticipant = async (id: number) => {
    const response = await Api.put(`Events/participants/${id}/status/approved`);
    return response;
};

const underReviewParticipant = async (id: number) => {
    const response = await Api.put(`Events/participants/${id}/status/underReviewed`);
    return response;
};

const rejectParticipant = async (id: number) => {
    const response = await Api.put(`Events/participants/${id}/status/rejected`);
    return response;
};

export default {
    getCategories,
    getEvents,
    getEventInfo,
    remove,
    createParticipant,
    removeParticipant,
    approveParticipant,
    underReviewParticipant,
    rejectParticipant
};