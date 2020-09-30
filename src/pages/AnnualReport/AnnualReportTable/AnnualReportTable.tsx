import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Table,
  Button,
  Layout,
  Modal,
  Input,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import moment from "moment";
import AnnualReportApi from "../../../api/AnnualReportApi";
import AnnualReport from "../Interfaces/AnnualReport";
import User from "../Interfaces/User";
import City from "../Interfaces/City";
import Region from "../Interfaces/Region";
import AnnualReportInformation from "./AnnualReportInformation/AnnualReportInformation";
import UnconfirmedDropdown from "./Dropdowns/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./Dropdowns/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./Dropdowns/SavedDropdown/SavedDropdown";
import Filters from "./Filters";
import "./AnnualReportTable.less";
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import CitySelectModal from "./CitySelectModal/CitySelectModal";
import ClickAwayListener from "react-click-away-listener";

const { Title } = Typography;

const AnnualReportTable = () => {
  const history = useHistory();
  const [annualReport, setAnnualReport] = useState<AnnualReport>(Object);
  const [reportStatusNames, setReportStatusNames] = useState<string[]>(Array());
  const [annualReports, setAnnualReports] = useState<AnnualReport[]>(Array());
  const [searchedData, setSearchedData] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<
    boolean
  >(false);
  const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(
    false
  );
  const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
  const [showAnnualReportModal, setShowAnnualReportModal] = useState<boolean>(
    false
  );
  const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(
    false
  );
  const [canManage, setCanManage] = useState<boolean>(false);
  const {
    idFilter,
    userFilter,
    cityFilter,
    regionFilter,
    dateFilter,
    statusFilter,
  } = Filters;

  useEffect(() => {
    fetchAnnualReportStatuses();
    fetchAnnualReports();
    checkAccessToManage();
  }, []);

  const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    console.log(roles);
    setCanManage(roles.includes("Admin") || roles.includes("Голова Регіону"));
  };

  const fetchAnnualReportStatuses = async () => {
    try {
      let response = await AnnualReportApi.getAnnualReportStatuses();
      setReportStatusNames(response.data.statuses);
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchAnnualReports = async () => {
    try {
      let response = await AnnualReportApi.getAll();
      setAnnualReports(response.data.annualReports);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleView = async (id: number) => {
    hideDropdowns();
    try {
      let response = await AnnualReportApi.getById(id);
      setAnnualReport(response.data.annualreport);
      setShowAnnualReportModal(true);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleEdit = (id: number) => {
    hideDropdowns();
    history.push(`/annualreport/edit/${id}`);
  };

  const handleConfirm = async (id: number) => {
    hideDropdowns();
    try {
      let response = await AnnualReportApi.confirm(id);
      let cityId = annualReports.find((item) => item.id == id)?.cityId;
      setAnnualReports(
        annualReports.map((item) => {
          if (
            item.id === id ||
            (item.id !== id && item.cityId === cityId && item.status === 1)
          ) {
            item.status++;
          }
          return item;
        })
      );
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleCancel = async (id: number) => {
    hideDropdowns();
    try {
      let response = await AnnualReportApi.cancel(id);
      setAnnualReports(
        annualReports.map((item) => {
          if (item.id === id) {
            item.status--;
          }
          return item;
        })
      );
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleRemove = async (id: number) => {
    hideDropdowns();
    try {
      let response = await AnnualReportApi.remove(id);
      setAnnualReports(annualReports?.filter((item) => item.id !== id));
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.message);
    }
  };

  const itemRender = (current: any, type: string, originalElement: any) => {
    if (type === "prev") {
      return <Button type="primary">Попередня</Button>;
    }
    if (type === "next") {
      return <Button type="primary">Наступна</Button>;
    }
    return originalElement;
  };

  const hideDropdowns = () => {
    setShowUnconfirmedDropdown(false);
    setShowConfirmedDropdown(false);
    setShowSavedDropdown(false);
  };

  const showDropdown = (annualReportStatus: number) => {
    switch (annualReportStatus) {
      case 0:
        hideDropdowns();
        setShowUnconfirmedDropdown(true);
        break;
      case 1:
        hideDropdowns();
        setShowConfirmedDropdown(true);
        break;
      case 2:
        hideDropdowns();
        setShowSavedDropdown(true);
        break;
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    hideDropdowns();
    setSearchedData(event.target.value);
  };

  const filteredData =
    searchedData !== ""
      ? annualReports.filter(
          (item) =>
            idFilter(item.id, searchedData) ||
            userFilter(item.creator as User, searchedData) ||
            cityFilter(item.city as City, searchedData) ||
            dateFilter(item.date, searchedData) ||
            regionFilter(item.city?.region as Region, searchedData) ||
            statusFilter(item.status, reportStatusNames, searchedData)
        )
      : annualReports;

  const showSuccess = (message: string) => {
    Modal.success({
      content: message,
    });
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const columns = [
    {
      title: "Номер",
      dataIndex: "id",
    },
    {
      title: "Подавач",
      dataIndex: "creator",
      render: (creator: User) => {
        return `${creator.firstName} ${creator.lastName}`;
      },
    },
    {
      title: "Станиця",
      dataIndex: ["city", "name"],
    },
    {
      title: "Регіон",
      dataIndex: ["city", "region", "regionName"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD-MM-YYYY");
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (status: number) => {
        return reportStatusNames[status];
      },
    },
  ];

  return (
    <Layout.Content className="annualreport-table">
      <Title level={2}>Річні звіти станиць</Title>
      <Row className="searchContainer" gutter={16}>
        <Col span={4}>
          <Input placeholder="Пошук" onChange={handleSearch} />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            htmlType="button"
            onClick={() => setShowCitySelectModal(true)}
          >
            Подати річний звіт
          </Button>
        </Col>
      </Row>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        onRow={(record) => {
          return {
            onClick: () => {
              hideDropdowns();
            },
            onContextMenu: (event) => {
              event.preventDefault();
              showDropdown(record.status);
              setAnnualReport(record);
              setX(event.pageX);
              setY(event.pageY);
            },
          };
        }}
        onChange={(pagination) => {
          if (pagination) {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: "smooth",
            });
          }
        }}
        pagination={{
          itemRender,
          position: ["bottomRight"],
          showTotal: (total, range) =>
            `Записи з ${range[0]} по ${range[1]} із ${total} записів`,
        }}
      />
      <ClickAwayListener onClickAway={hideDropdowns}>
        <UnconfirmedDropdown
          showDropdown={showUnconfirmedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedDropdown
          showDropdown={showConfirmedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleCancel}
        />
        <SavedDropdown
          showDropdown={showSavedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      </ClickAwayListener>
      <AnnualReportInformation
        visibleModal={showAnnualReportModal}
        annualReport={annualReport}
        showError={showError}
        handleOk={() => setShowAnnualReportModal(false)}
      />
      <CitySelectModal
        visibleModal={showCitySelectModal}
        handleOk={() => setShowCitySelectModal(false)}
      />
    </Layout.Content>
  );
};

export default AnnualReportTable;
