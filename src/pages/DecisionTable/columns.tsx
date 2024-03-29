import { Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React from "react";
import decisionsApi, { statusTypeGetParser } from "../../api/decisionsApi";
import { DecisionTableInfo } from "./Interfaces/DecisionTableInfo";
import classes from "./Table.module.css";

const descriptionInTooltipLength = 500;
const descriptionMainLength = 100;
const columns: ColumnsType<DecisionTableInfo> = [
  {
    title: "ID",
    dataIndex: "id",
    fixed: true,
    width: 60,
    className: classes.idTableField
  },
  {
    title: "Назва",
    dataIndex: "name",
  },
  {
    title: "Керівний орган",
    dataIndex: "governingBody",
  },
  {
    title: "Статус",
    dataIndex: "decisionStatusType",
    render: (decisionStatusType: any) => {
      return typeof decisionStatusType === "number"
        ? statusTypeGetParser(decisionStatusType)
        : decisionStatusType;
    },
  },
  {
    title: "Тема",
    dataIndex: "decisionTarget",
  },
  {
    title: "Текст рішення",
    dataIndex: "description",
    render: (description: any) => (
      <Tooltip
        className={classes.antTooltipInner}
        title={description.substring(0, descriptionInTooltipLength) + "..."}
      >
        {description.substring(0, descriptionMainLength)}
      </Tooltip>
    ),
  },
  {
    title: "Дата",
    dataIndex: "date",
    render: (date: Date) => {
      return moment.utc(date.toLocaleString()).local().format("DD.MM.YYYY");
    },
  },
  {
    title: "Додатки",
    dataIndex: "fileName",
    render: (fileName: string | null) => {
      if (fileName != null) {
        return (
          <button
            type="button"
            onClick={async () => {
              await decisionsApi.getFileAsBase64(fileName);
            }}
          >
            Завантажити додаток
          </button>
        );
      }
      return "";
    },
  },
];
export default columns;
