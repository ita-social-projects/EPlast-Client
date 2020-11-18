import React from "react";

import CityUser from "../../../models/City/CityUser";
import moment from "moment";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Користувач",
    dataIndex: "user",
    render: (user: CityUser) => {
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
      return moment(startDate).format("DD.MM.YYYY");
    },
  },
  {
    title: "Кінець каденції",
    dataIndex: "endDate",
    render: (endDate: Date) => {
      return moment(endDate).format("DD.MM.YYYY") === "Invalid date"
        ? " Не закінчена "
        : moment(endDate).format("DD.MM.YYYY");
    },
  },
  {
    title: "Курінь",
    dataIndex: "club",
  },
];
export default columns;
