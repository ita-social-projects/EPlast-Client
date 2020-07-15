import Api from "./api";

const getById = async (id: number) => {
  const response = await Api.getById("Club", id);
  return response;
};

const getAll = async () => {
  const response = await Api.getAll("Club/index");
  return response;
};

const post = async (data: any) => {
  const response = await Api.post("Club", data);
  return response;
};

const put = async (data: any) => {
  const response = await Api.put("Club", data);
  return response;
};

const remove = async (id: number) => {
  const response = await Api.put("Club", id);
  return response;
};

export default { getById, getAll, post, put, remove };
