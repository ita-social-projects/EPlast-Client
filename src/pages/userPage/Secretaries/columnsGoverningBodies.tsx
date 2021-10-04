import GoverningBodyUser from "../../../models/GoverningBody/GoverningBodyUser";
import moment from "moment";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Користувач",
    dataIndex: "user",
    render: (user: GoverningBodyUser) => {
      return user.firstName + " " + user.lastName;
    },
  },
  {
    title: "Тип адміністрування",
    dataIndex: "adminType",
    render: (adminType: any) => {
      return adminType.adminTypeName;
    },
  },
  {
    title: "Початок каденції",
    dataIndex: "startDate",
    render: (startDate: Date) => {
      return moment.utc(startDate).local().format("DD.MM.YYYY");
    },
  },
  {
    title: "Кінець каденції",
    dataIndex: "endDate",
    render: (endDate: Date) => {
      return moment.utc(endDate).local().format("DD.MM.YYYY") === "Invalid date"
        ? " Не закінчена "
        : moment.utc(endDate).local().format("DD.MM.YYYY");
    },
  },
  {
    title: "Край",
    dataIndex: "governingBody",
    render: (governingBody: any) => {
      return governingBody.governingBodyName;
    },
  },
];
export default columns;
