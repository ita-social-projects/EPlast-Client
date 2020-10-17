import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from './../../../models/Club/ClubMember';
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

export const getTableAdmins = (admins: ClubAdmin[], head: ClubAdmin): any[] => {
  if (admins.length > 0 || head != null) {
    const tableAdmins = [...admins, head].map((member: ClubAdmin) =>
      convertToTableAdmin(member)
    );

    return tableAdmins.filter((a) => a !== null);
  }

  return [];
};

const convertToTableAdmin = (admin: ClubAdmin) => {
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

export const getTableMembers = (members: ClubMember[], admins: ClubAdmin[], head: ClubAdmin) => {
  const arr = members.filter((member: ClubMember) => {
    return ![...admins, head].find((admin: ClubAdmin) => {
      return admin?.user.id === member.user.id;
    });
  });

  return arr.map((member: ClubMember) => ({
    key: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    status: "Член куреня",
  }));
};

export const getTableFollowers = (followers: ClubMember[]) => {
  return followers.map((member: ClubMember) => ({
    key: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    status: "Прихильник куреня",
  }));
};