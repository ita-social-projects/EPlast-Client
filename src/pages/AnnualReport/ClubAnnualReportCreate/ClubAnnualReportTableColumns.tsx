import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from './../../../models/Club/ClubMember';



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
        userCity : admin.user.cityName? `${admin.user.cityName}`:'_',
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
    status: "Член Куреня",
    type: member.user.userRole,
    userCity : member.user.cityName? `${member.user.cityName}`:'_',
  }));
};

export const getTableFollowers = (followers: ClubMember[]) => {
  return followers.map((member: ClubMember) => ({
    key: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    status: "Прихильник Куреня",
    type: member.user.userRole,
    userCity : member.user.cityName? `${member.user.cityName}`:'_',
  }));
};