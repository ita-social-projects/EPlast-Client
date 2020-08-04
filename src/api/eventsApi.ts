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

<<<<<<< HEAD
=======
const getPictures = async (eventId: number) => {
    const response = await Api.get(`Events/${eventId}/pictures`);
    return response;
}

>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
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

<<<<<<< HEAD
=======
const uploadPictures = async (id: number, data: any) => {
    const response = await Api.post(`Events/${id}/eventGallery`, data);
    return response;
};

const removePicture = async (id: number) => {
    const response = await Api.remove(`Events/pictures/${id}`);
    return response;
};

>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
export default {
    getTypes,
    getCategories,
    getEvents,
    getEventInfo,
<<<<<<< HEAD
=======
    getPictures,
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
    remove,
    createParticipant,
    removeParticipant,
    approveParticipant,
    underReviewParticipant,
<<<<<<< HEAD
    rejectParticipant
=======
    rejectParticipant,
    uploadPictures,
    removePicture
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
};