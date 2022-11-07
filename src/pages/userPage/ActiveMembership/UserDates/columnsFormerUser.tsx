import moment from "moment";

const minDate = "0001-01-01T00:00:00";


const columns = [
  {
    title: "№",
    width: 60,
    key: "index", 
    render: (text: string, record: any, index: number) => index + 1
  },
  {
    title: "Дата початку",
    dataIndex: "entry",
    width: 120,
    render: (entry: string) => {
      return entry == minDate ? 
      "Немає" 
      : moment.utc(entry).local().format("DD.MM.YYYY");
    },
  },
  {
    title: "Дата відновлення",
    dataIndex: "end",
    width: 120,
    render: (end: string) => {
      return end == minDate ? 
      "Все ще не відновився" 
      : moment.utc(end).local().format("DD.MM.YYYY");
    },
  }
];

export default columns;
