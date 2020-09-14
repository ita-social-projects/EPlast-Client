import CityAdmin from "../../../models/City/CityAdmin";
import CityMember from './../../../models/City/CityMember';
import moment from "moment";

export const membersColumns = [
  {
    title: "ПІБ",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
];

export const administrationsColumns = [
  {
    title: "ПІБ",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Посада",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Час початку терміну",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "Час завершення терміну",
    dataIndex: "endDate",
    key: "endDate",
  },
];

export const getTableAdmins = (admins: CityAdmin[], head: CityAdmin): any[] => {
  if (admins.length > 0 || head != null) {
    const tableAdmins = [...admins, head].map((member: CityAdmin) =>
      convertToTableAdmin(member)
    );

    return tableAdmins.filter((a) => a !== null);
  }

  return [];
};

const convertToTableAdmin = (admin: CityAdmin) => {
  return admin
    ? {
        key: admin.id,
        name: `${admin.user.firstName} ${admin.user.lastName}`,
        status: "Адміністратор",
        type: admin.adminType.adminTypeName,
        startDate: moment(admin.startDate).format("DD-MM-YYYY"),
        endDate: admin.endDate
          ? moment(admin.endDate).format("DD-MM-YYYY")
          : "Не визначено",
      }
    : null;
};

export const getTableMembers = (members: CityMember[], admins: CityAdmin[], head: CityAdmin) => {
  const arr = members.filter((member: CityMember) => {
    return ![...admins, head].find((admin: CityAdmin) => {
      return admin?.user.id === member.user.id;
    });
  });

  return arr.map((member: CityMember) => ({
    key: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    status: "Член станиці",
  }));
};

export const getTableFollowers = (followers: CityMember[]) => {
  return followers.map((member: CityMember) => ({
    key: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    status: "Прихильник станиці",
  }));
};