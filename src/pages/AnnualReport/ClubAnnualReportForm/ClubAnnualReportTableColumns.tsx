import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from '../../../models/Club/ClubMember';



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
      key: admin.user.id,
      name: `${admin.user.firstName} ${admin.user.lastName}`,
      degree: admin.user.plastDegree?.name ? `${admin.user.plastDegree?.name}` : '_',
      type: admin.adminType.adminTypeName,
      userCity: admin.user.cityName ? `${admin.user.cityName}` : '_',
      email: admin.user.email ? `${admin.user.email}` : '_',
      phoneNumber: admin.user.phoneNumber ? `${admin.user.phoneNumber}` : '_'
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
    key: member.user.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    degree: member.user.plastDegree?.name ? `${member.user.plastDegree?.name}` : '_',
    type: member.user.userRole,
    userCity: member.user.cityName ? `${member.user.cityName}` : '_',
    email: member.user.email ? `${member.user.email}` : '_',
    phoneNumber: member.user.phoneNumber ? `${member.user.phoneNumber}` : '_'
  }));
};

export const getTableFollowers = (followers: ClubMember[]) => {
  return followers.map((member: ClubMember) => ({
    key: member.user.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    degree: member.user.plastDegree?.name ? `${member.user.plastDegree?.name}` : '_',
    type: member.user.userRole,
    userCity: member.user.cityName ? `${member.user.cityName}` : '_',
    email: member.user.email ? `${member.user.email}` : '_',
    phoneNumber: member.user.phoneNumber ? `${member.user.phoneNumber}` : '_'
  }));
};

export const administrationsColumns = [
  {
    title: "Ім’я, Прізвище",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ступінь",
    dataIndex: "degree",
    key: "degree",
    width: "100",
  },
  {
    title: "Посада",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Станиця",
    dataIndex: "userCity",
    key: "userCity",
  },
  {
    title: "Електронна пошта",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Телефон",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
];

export const followersColumns = [
  {
    title: "Ім’я, Прізвище",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ступінь",
    dataIndex: "degree",
    key: "degree",
    width: "100",
  },
  {
    title: "Станиця",
    dataIndex: "userCity",
    key: "userCity",
  },
  {
    title: "Електронна пошта",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Телефон",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
];