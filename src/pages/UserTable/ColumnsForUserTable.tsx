import React, { useState } from "react";
import moment from "moment";
import { Tooltip, Tag, Row, Col, Checkbox, Button } from "antd";
import {
  WomanOutlined,
  ManOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import "./Filter.less";
import Transgender from "../../assets/images/lgbt.svg";
import { Roles } from "../../models/Roles/Roles";
import "../AnnualReport/AnnualReportTable/AnnualReportTable.less";
import styles from "./UserTable.module.css";
import UkraineOblasts from "../../models/Oblast/UkraineOblasts";
import OblastsRecord from "../../models/Oblast/OblastsRecord";
import UserComment from "./UserComment";
import { ColumnProps, ColumnsType } from "antd/es/table";
import User from "../../models/UserTable/User";

const setTagColor = (userRoles: string) => {
  let color = "";
  if (userRoles?.includes(Roles.Admin)) {
    color = "red";
  }
  if (userRoles?.includes(Roles.PlastMember)) {
    color = "green";
  }
  if (userRoles?.includes(Roles.Supporter)) {
    color = "orange";
  }
  if (userRoles?.includes(Roles.Interested)) {
    color = "yellow";
  }
  if (userRoles?.includes(Roles.FormerPlastMember)) {
    color = "black";
  }
  if (userRoles?.includes(Roles.RegisteredUser)) {
    color = "blue";
  }
  return color;
};

const options = [
  { label: Roles.PlastMember, value: Roles.PlastMember },
  { label: Roles.FormerPlastMember, value: Roles.FormerPlastMember },
  { label: Roles.Supporter, value: Roles.Supporter },
  { label: Roles.OkrugaHead, value: Roles.OkrugaHead },
  { label: Roles.OkrugaSecretary, value: Roles.OkrugaSecretary },
  { label: Roles.CityHead, value: Roles.CityHead },
  { label: Roles.CitySecretary, value: Roles.CitySecretary },
  { label: Roles.KurinHead, value: Roles.KurinHead },
  { label: Roles.KurinSecretary, value: Roles.KurinSecretary },
  { label: Roles.RegisteredUser, value: Roles.RegisteredUser },
  { label: Roles.GoverningBodyHead, value: Roles.GoverningBodyHead },
  { label: Roles.GoverningBodySecretary, value: Roles.GoverningBodySecretary },
  {
    label: Roles.GoverningBodySectorHead,
    value: Roles.GoverningBodySectorHead,
  },
  {
    label: Roles.GoverningBodySectorSecretary,
    value: Roles.GoverningBodySectorSecretary,
  },
];

interface Props {
  sortKey: number;
  setSortKey: any;
  setFilter: any;
  setPage: any;
  filterRole: any;
  isZgolosheni: boolean;
  page: number;
  pageSize: number;
}

const ColumnsForUserTable = (props: Props): any[] => {
  const { sortKey, setSortKey, setFilter, setPage, filterRole } = props;

  const numberOfElementsInFilter: number = 10;
  const defaultPage: number = 1;

  const [filterDropdownVisible, setFilterDropdownVisible] = useState<boolean>(
    false
  );
  const [filterOptions, setFilterOptions] = useState<any>(options);
  const [filterStatus, setFilterStatus] = useState({
    value: Array<boolean>(numberOfElementsInFilter).fill(false),
  });

  // names of the keys that aren't displayed in "Зголошені" tab
  const forbiddenKeysForZgolosheni = ["clubName", "userRoles", "upuDegree", "userPlastDegreeName"]

  const onChangeCheckbox = (e: any, i: number) => {
    let value = filterStatus.value.slice();
    value[i] = !value[i];
    setFilterStatus({ value });
  };

  const onSearchFilter = () => {
    const rolesToStr = new Array<string>();
    filterStatus.value.forEach((element: boolean, index: number) => {
      if (element) {
        rolesToStr.push(filterOptions[index].value.toString());
      }
    });
    setFilterDropdownVisible(false);
    setPage(defaultPage);
    setFilter(rolesToStr);
  };

  const onClearFilter = () => {
    setFilterStatus({
      value: Array<boolean>(numberOfElementsInFilter).fill(false),
    });
    setFilterDropdownVisible(false);
    setPage(defaultPage);
    setFilter([]);
  };

  const SortDirection = (props: { sort: number }) => {
    return (
      <>
        <div className={"tableHeaderSorting"}>
          <button
            onClick={() => {
              setSortKey(props.sort);
            }}
            className={sortKey === props.sort ? "sortDirection" : ""}
          >
            <CaretUpOutlined />
          </button>
          <button
            onClick={() => {
              setSortKey(-props.sort);
            }}
            className={sortKey === -props.sort ? "sortDirection" : ""}
          >
            <CaretDownOutlined />
          </button>
        </div>
      </>
    );
  };

  const SortColumnHighlight = (sort: number, text: any) => {
    return {
      props: {
        style: {
          backgroundColor:
            sortKey === sort || sortKey === -sort ? "#fafafa" : "",
        },
      },
      children: <div>{text}</div>,
    };
  };

  let columns: ColumnsType<User> = [
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">№</Col>
          <Col className="col-value">
            <SortDirection sort={1} />
          </Col>
        </Row>
      ),
      render: (text, record, index) => {
        return SortColumnHighlight(
          1,
          <div className={styles.divWrapper}>
            <div className={styles.tagText}>
              <Tooltip placement="top" title={index}>
                {((index + 1) + props.pageSize * (props.page - 1)) as any}
              </Tooltip>
            </div>
          </div>
        );
      },
      fixed: true,
      width: 60,
      key: "userSystemId",
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Ім'я</Col>
          <Col className="col-value">
            <SortDirection sort={2} />
          </Col>
        </Row>
      ),
      dataIndex: "firstName",
      width: 130,
      render: (firstName: any) => {
        return SortColumnHighlight(
          2,
          <div className={styles.divWrapper}>
            <div className={styles.tagText}>
              <Tooltip placement="top" title={firstName}>
                {firstName}
              </Tooltip>
            </div>
          </div>
        );
      },
      key: "firstName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Прізвище</Col>
          <Col className="col-value">
            <SortDirection sort={3} />
          </Col>
        </Row>
      ),
      dataIndex: "lastName",
      width: 130,
      render: (lastName: any) => {
        return SortColumnHighlight(
          3,
          <div className={styles.divWrapper}>
            <div className={styles.tagText}>
              <Tooltip placement="top" title={lastName}>
                {lastName}
              </Tooltip>
            </div>
          </div>
        );
      },
      key: "lastName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">{props.isZgolosheni ? "Вік" : "Дата народження"}</Col>
          <Col className="col-value">
            <SortDirection sort={4} />
          </Col>
        </Row>
      ),
      dataIndex: "birthday",
      width: props.isZgolosheni ? 120 : 145,
      render: (date: Date) => {
        return SortColumnHighlight(
          4,
          <>
            {date !== null
              ? props.isZgolosheni
                ? `${moment().diff(moment.utc(date.toLocaleString()), 'years')} (${moment.utc(date.toLocaleString()).local().format("DD.MM.YYYY")})`
                : moment.utc(date.toLocaleString()).local().format("DD.MM.YYYY")
              : ""}
          </>
        );
      },
      key: "birthday"
    },
    {
      title: "Стать",
      dataIndex: "gender",
      width: 80,
      render: (gender: any) => {
        if (gender === null) {
          return <h4>Не вказано</h4>;
        } else if (gender.name === "Жінка") {
          return (
            <Tooltip title="Жінка">
              <WomanOutlined />
            </Tooltip>
          );
        } else if (gender.name === "Чоловік") {
          return (
            <Tooltip title="Чоловік">
              <ManOutlined />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Не маю бажання вказувати">
              <img src={Transgender} alt="Transgender" />
            </Tooltip>
          );
        }
      },
      key: "gender"
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 160,
      render: (email: any) => {
        return (
          <div className={styles.divWrapper}>
            <div className={styles.tagText}>
              <Tooltip placement="top" title={email}>
                {email}
              </Tooltip>
            </div>
          </div>
        );
      },
      key: "email"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Округа</Col>
          <Col className="col-value">
            <SortDirection sort={5} />
          </Col>
        </Row>
      ),
      dataIndex: "regionName",
      width: 110,
      render: (regionName: any) => {
        return SortColumnHighlight(
          5,
          regionName == null ? (
            ""
          ) : (
            <div className={styles.parentDiv}>
              <Tag color={"blue"} key={regionName} className={styles.tagText}>
                <Tooltip placement="topLeft" title={regionName}>
                  {regionName}
                </Tooltip>
              </Tag>
            </div>
          )
        );
      },
      key: "regionName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Станиця</Col>
          <Col className="col-value">
            <SortDirection sort={6} />
          </Col>
        </Row>
      ),
      dataIndex: "cityName",
      width: 120,
      render: (cityName: any) => {
        return SortColumnHighlight(
          6,
          cityName == null ? (
            ""
          ) : (
            <div className={styles.parentDiv}>
              <Tag color={"purple"} key={cityName} className={styles.tagText}>
                <Tooltip placement="topLeft" title={cityName}>
                  {cityName}
                </Tooltip>
              </Tag>
            </div>
          )
        );
      },
      key: "cityName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Курінь</Col>
          <Col className="col-value">
            <SortDirection sort={7} />
          </Col>
        </Row>
      ),
      dataIndex: "clubName",
      width: 150,
      render: (clubName: any) => {
        return SortColumnHighlight(
          7,
          clubName == null ? (
            ""
          ) : (
            <div className={styles.parentDiv}>
              <Tag color={"pink"} key={clubName} className={styles.tagText}>
                <Tooltip placement="topLeft" title={clubName}>
                  {clubName}
                </Tooltip>
              </Tag>
            </div>
          )
        );
      },
      key: "clubName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Ступінь</Col>
          <Col className="col-value">
            <SortDirection sort={8} />
          </Col>
        </Row>
      ),
      dataIndex: "userPlastDegreeName",
      width: 150,
      render: (userPlastDegreeName: any, record: any) => {
        if (userPlastDegreeName !== null && userPlastDegreeName.length > 0) {
          if (
            record.gender?.name !== null &&
            record.gender?.name == "Чоловік"
          ) {
            return SortColumnHighlight(
              8,
              <div className={styles.parentDiv}>
                <Tag
                  color={"blue"}
                  key={userPlastDegreeName}
                  className={styles.tagText}
                >
                  <Tooltip
                    placement="topLeft"
                    title={
                      userPlastDegreeName?.includes("/")
                        ? userPlastDegreeName?.split("/")[0]
                        : userPlastDegreeName
                    }
                  >
                    {userPlastDegreeName?.includes("/")
                      ? userPlastDegreeName?.split("/")[0]
                      : userPlastDegreeName}
                  </Tooltip>
                </Tag>
              </div>
            );
          } else if (
            record.gender?.name !== null &&
            record.gender?.name == "Жінка"
          ) {
            return SortColumnHighlight(
              8,
              <div className={styles.parentDiv}>
                <Tag
                  color={"red"}
                  key={userPlastDegreeName}
                  className={styles.tagText}
                >
                  <Tooltip
                    placement="topLeft"
                    title={
                      userPlastDegreeName?.includes("/")
                        ? userPlastDegreeName?.split("/")[1]
                        : userPlastDegreeName
                    }
                  >
                    {userPlastDegreeName?.includes("/")
                      ? userPlastDegreeName?.split("/")[1]
                      : userPlastDegreeName}
                  </Tooltip>
                </Tag>
              </div>
            );
          } else {
            return SortColumnHighlight(
              8,
              <div className={styles.parentDiv}>
                <Tag
                  color={"yellow"}
                  key={userPlastDegreeName}
                  className={styles.tagText}
                >
                  <Tooltip placement="topLeft" title={userPlastDegreeName}>
                    {userPlastDegreeName}
                  </Tooltip>
                </Tag>
              </div>
            );
          }
        } else {
          return SortColumnHighlight(8, "");
        }
      },
      key: "userPlastDegreeName"
    },
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Ступінь в УПЮ</Col>
          <Col className="col-value">
            <SortDirection sort={9} />
          </Col>
        </Row>
      ),
      dataIndex: "upuDegree",
      width: 210,
      render: (upuDegree: any) => {
        return SortColumnHighlight(
          9,
          <div className={styles.parentDiv}>
            <Tag color={"blue"} key={upuDegree} className={styles.tagText}>
              <Tooltip placement="topLeft" title={upuDegree}>
                {upuDegree}
              </Tooltip>
            </Tag>
          </div>
        );
      },
      key: "upuDegree"
    },
    {
      title: "Права доступу",
      dataIndex: "userRoles",
      width: 170,
      ellipsis: false,
      filterDropdownVisible: filterDropdownVisible,
      filterDropdown: (
        <div className={styles.customFilterDropdown}>
          {filterOptions.map((item: any, i: number) => (
            <div>
              <Checkbox
                key={i}
                value={item.value}
                checked={filterStatus.value[i]}
                onChange={(e) => onChangeCheckbox(e, i)}
                className={styles.filterElement}
              >
                {item.label}
              </Checkbox>
              <br />
            </div>
          ))}
          <div>
            <Button className={styles.filterButton} onClick={onClearFilter}>
              Скинути
            </Button>
            <Button
              className={styles.filterButton}
              type="primary"
              onClick={onSearchFilter}
            >
              Пошук
            </Button>
          </div>
        </div>
      ),
      onFilterDropdownVisibleChange: () =>
        setFilterDropdownVisible(!filterDropdownVisible),
      render: (userRoles: any) => {
        return (
          <div className={styles.parentDiv}>
            <Tag
              color={setTagColor(userRoles)}
              key={userRoles}
              className={styles.tagText}
            >
              <Tooltip placement="leftTop" title={userRoles}>
                {userRoles}
              </Tooltip>
            </Tag>
          </div>
        );
      },
      key: "userRoles"
    },
  ]

  let columnsForZgolosheni: ColumnsType<User> = [
    {
      title: (
        <Row className="tableHeader">
          <Col className="col-title">Область</Col>
          <Col className="col-value">
            <SortDirection sort={10} />
          </Col>
        </Row>
      ),
      dataIndex: "oblast",
      width: 110,
      render: (oblast: any) => {
        let oblastName = OblastsRecord[oblast as UkraineOblasts];
        return SortColumnHighlight(
          10,
          <div className={styles.parentDiv}>
            <Tag color={"blue"} key={oblastName} className={styles.tagText}>
              <Tooltip placement="topLeft" title={oblastName}>
                {oblastName as any}
              </Tooltip>
            </Tag>
          </div>
        );
      },
      key: "oblast"
    },
    {
      title: "Місце проживання",
      dataIndex: "address",
      width: 170,
      render: (address: any) => {
        return (
          <div className={styles.divWrapper}>
            <div className={styles.tagText}>
              <Tooltip placement="top" title={address}>
                {address}
              </Tooltip>
            </div>
          </div>
        );
      },
      key: "address"
    },
    {
      title: "Звідки дізнався про Пласт",
      dataIndex: "referal",
      width: 150,
      render: (referals: any) => {
        let referalsString = referals as string;
        referalsString = referalsString?.replace("Від друзів, рідних", "{FRIENDS}");
        return (
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {referalsString?.split(',').map(referal => {
              referal = referal.replace("{FRIENDS}", "Від друзів, рідних");
              return (
                <Tag
                  color="blue"
                  key={referal}
                  className={styles.referalTag}
                >
                  <Tooltip placement="leftTop" title={referal}>
                    {referal as any}
                  </Tooltip>
                </Tag>
              )
            })
            }
          </div>
        );
      },
      key: "referal"
    }
  ]

  let phoneNumberColumn = {
    title: "Номер телефону",
    dataIndex: "phoneNumber",
    width: 140,
    render: (phoneNumber: any) => {
      return (
        <div className={styles.divWrapper}>
          <div className={styles.tagText}>
            <Tooltip placement="top" title={phoneNumber}>
              {phoneNumber}
            </Tooltip>
          </div>
        </div>
      );
    },
  }

  let commentColumn = {
    title: "Коментар",
    dataIndex: "comment",
    width: 180,
    render: (comment: any, record: any) => {
      return (
        <UserComment userId={record.id} text={comment} canEdit={true}/>
      );
    },
    key: "comment"
  }

  if (props.isZgolosheni) {
    // insert phonenumber column right before email
    columns.splice(columns.findIndex(column => column.key?.valueOf() === "email"), 0, phoneNumberColumn);

    // filter columns to display in zgolosheni tab
    let filtered = columns.filter(column => !forbiddenKeysForZgolosheni.includes(column.key?.valueOf() as string));
    columns = filtered.concat(columnsForZgolosheni);
  }
  
  columns.push(commentColumn);
  return columns;
};

export default ColumnsForUserTable;
