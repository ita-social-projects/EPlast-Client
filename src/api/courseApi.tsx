import api from "./api";

export const getAllCourse = async () => {
    return api.get(`Courses`);
  };

  export const getAllCourseByUserId = async (id:string) => {
    return api.get(`Courses/${id}`);
  };

  export const ChangeStatusCourseByUserId = async (id:string,courseid:number) => {
    return api.put(`Courses/${id}/${courseid}`);
  };