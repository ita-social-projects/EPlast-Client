import api from "./api";

export const getAnnouncementsByPage = async (
  pageNumber: number,
  pageSize: number
) => {
  try {
    return await api.get(`Announcements/GetAnnouncementsByPage/${pageNumber}`, {
      pageNumber,
      pageSize,
    });
  } catch (error) {
    throw new Error();
  }
};

export const getAnnouncementsById = async (id: number) => {
  try {
    return await api.get(`Announcements/GetAnnouncement/${id}`, id);
  } catch (error) {
    throw new Error();
  }
};

export const pinAnnouncement = async (id: number) => {
  try {
    return await api.put(`Announcements/PinAnnouncement/${id}`, id);
  } catch (error) {
    throw new Error();
  }
};
