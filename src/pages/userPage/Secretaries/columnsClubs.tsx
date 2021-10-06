import ClubUser from "../../../models/Club/ClubUser";
import moment from "moment";
import extendedTitleTooltip from "../../../components/Tooltip";

const clubNameMaxLength = 28;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Користувач",
    dataIndex: "user",
    render: (user: ClubUser) => {
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
    title: "Курінь",
    dataIndex: "club",
    render: (club: any) =>{
      return(extendedTitleTooltip(clubNameMaxLength, club.name))
    }
  },
];
export default columns;