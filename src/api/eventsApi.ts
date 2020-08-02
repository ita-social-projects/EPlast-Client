import Api from './api'

const getTypes = async () => {
    const response = await Api.get("Events/types");
    return response;
}

const getCategories = async (typeId: number) => {
    const response = await Api.get(`Events/types/${typeId}/categories`);
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

const getPictures = async (eventId: number) => {
    const response = await Api.get(`Events/${eventId}/pictures`);
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

const uploadPictures = async (id: number, data: any) => {
    const response = await Api.post(`Events/${id}/eventGallery`, data);
    return response;
};

export default {
    getTypes,
    getCategories,
    getEvents,
    getEventInfo,
    getPictures,
    remove,
    createParticipant,
    removeParticipant,
    approveParticipant,
    underReviewParticipant,
    rejectParticipant,
    uploadPictures
};