import CityUser from "../../models/City/CityUser";

const columns = [
  {
    title: "№",
    dataIndex: "id",
  },
  {
    title: "Пластовий ступінь",
    dataIndex: "id",
  },
  {
    title: "Ім’я, Прізвище",
    dataIndex: "id",
  },
  {
    title: "Стан в курені (дійсний член чи прихильник)",
    dataIndex: "user",
    render: (user: CityUser) => {
      return user.firstName + " " + user.lastName;
    },
  },
  {
    title: "Станиця",
    dataIndex: "club",
  },
];
export default columns;
