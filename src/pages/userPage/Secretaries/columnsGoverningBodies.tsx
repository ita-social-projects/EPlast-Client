import moment from "moment";

const minDate = '01.01.0001';

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Користувач",
    dataIndex: "userName",
    render: (userName: string) => {
      return userName;
    },
  },
  {
    title: "Тип адміністрування",
    dataIndex: "adminType",
    render: (adminType: string) => {
      return adminType;
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
      const instanceDate = moment.utc(endDate).local().format("DD.MM.YYYY")
      return instanceDate === minDate
          ? " Не закінчена "
          : instanceDate;
    },
  },
  {
    title: "Край",
    dataIndex: "governBodyName",
    render: (governBodyName: string) => {
      return governBodyName;
    },
  },
];

export default columns;