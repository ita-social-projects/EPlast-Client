import Api from "./api";

const getTypes = async () => {
  const response = await Api.get("Events/types");
  return response;
};

const getCategories = async (typeId: number) => {
  const response = await Api.get(`Events/types/${typeId}/categories`);
  return response;
};

const getCategoriesByPage = async (
  typeId: number,
  page: number,
  pageSize: number
) => {
  const response = await Api.get(`Events/types/${typeId}/categories/${page}`, {
    page,
    pageSize,
  });
  return response;
};

const getEvents = async (typeId: number, categoryId: number) => {
  const response = await Api.get(
    `types/${typeId}/categories/${categoryId}/events`
  );
  return response;
};

const getEventsByStatuses = async (
  typeId: number,
  categoryId: number,
  status: number
) => {
  const response = await Api.get(
    `types/${typeId}/categories/${categoryId}/events/${status}`
  );
  return response;
};

const getSections = async () => {
  const response = await Api.get(`Events/sections`);
  return response;
};

const createEventCategory = async (data: any) => {
  const response = await Api.post(`Events/newCategory`, data);
  return response;
};

const getEventInfo = async (id: number) => {
  const response = await Api.get(`Events/${id}/details`);
  return response;
};

const getPictures = async (eventId: number) => {
  const response = await Api.get(`Events/${eventId}/pictures`);
  return response;
};

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

const estimateEvent = async (id: number, estimate: number) => {
  const response = await Api.put(`Events/${id}/estimate/${estimate}`);
  return response;
};

const approveParticipant = async (id: number) => {
  const response = await Api.put(`Events/participants/${id}/status/approved`);
  return response;
};

const underReviewParticipant = async (id: number) => {
  const response = await Api.put(
    `Events/participants/${id}/status/underReviewed`
  );
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

const removePicture = async (id: number) => {
  const response = await Api.remove(`Events/pictures/${id}`);
  return response;
};

const getEventStatusId = async (eventStatus: string) => {
  const response = await Api.get(`Events/${eventStatus}/statusId`);
  return response;
};

export default {
  getEventsByStatuses,
  getTypes,
  getCategories,
  getCategoriesByPage,
  getEvents,
  getSections,
  createEventCategory,
  getEventInfo,
  getPictures,
  remove,
  estimateEvent,
  createParticipant,
  removeParticipant,
  approveParticipant,
  underReviewParticipant,
  rejectParticipant,
  uploadPictures,
  removePicture,
  getEventStatusId,
};
