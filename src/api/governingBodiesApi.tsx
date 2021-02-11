import Api from "./api";

const getOrganizationsList = async () => {
    const { data } = await Api.get("GoverningBodies");
    return data;
};

export default { getOrganizationsList };