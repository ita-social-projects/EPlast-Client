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
  Drawer,
  message,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import AnnualReportApi from "../../../api/AnnualReportApi";
import {getClubAnnualReport} from "../../../api/clubsApi";
import AnnualReport from "../Interfaces/AnnualReport";
import ClubAnnualReport from "../Interfaces/ClubAnnualReport"
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Card } from 'antd';
import { CityAnnualReportTable } from "./CityAnnualReportTable";
import { ClubAnnualReportTable } from "./ClubAnnualReport";
import FormAnnualReportRegion from "./FormAnnualReportRegion"
import { getAllRegionsReports } from "../../../api/regionsApi";
import { RegionAnnualReportTable } from "./RegionAnnualReportTable";
import ClubSelectModal from "./ClubSelectModal/ClubSelectModal";


const { Title } = Typography;

const setTagColor = (status: number) => {
  let color = "";
  if (status==0) {
    color = "red";
  }
  if (status==1) {
    color = "green";
  }
  return color;
};

const AnnualReportTable = () => {
  const [reportStatusNames, setReportStatusNames] = useState<any[]>(Array());
  const [annualReports, setAnnualReports] = useState<AnnualReport[]>(Array());
  const [clubAnnualReports, setClubAnnualReports] = useState<ClubAnnualReport[]>(Array());
  const [regionAnnualReports, setRegionsAnnualReports]= useState<[]>([]);
  const [showRegionAnnualReports, setShowRegionAnnualReports] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [visible, setvisible]= useState<boolean>(false) ;
  const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(
    false
  );
  const [showClubSelectModal, setShowClubSelectModal] = useState<boolean>(
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
    fetchClubAnnualReports();
    fetchRegionAnnualReports();
    checkAccessToManage();
    renewPage();
  }, []);

  const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
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
  
  const fetchClubAnnualReports = async () => {
    try {
      let response = await getClubAnnualReport();
      setClubAnnualReports(response.data.clubAnnualReports);

    } catch (error) {
      showError(error.message);
    }
  };

  const fetchRegionAnnualReports = async () => {
    try {
      let response = await getAllRegionsReports();
      setRegionsAnnualReports(response.data);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value);
  };

  const filteredCityData =
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


  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const columnsRegion = [
    {
      title: "Номер",
      dataIndex: "id",
    },

    {
      title: "Округ",
      dataIndex: ["regionName"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
    }
  ];

  
  const columns = [
    {
      title: "Номер",
      dataIndex: "id",
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
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (status: any) => {
        return (
          <Tag color={setTagColor(status)} key={reportStatusNames[status]}>
            <Tooltip placement="topLeft" title={reportStatusNames[status]}>
        {reportStatusNames[status]}
            </Tooltip>
          </Tag>
        );
    },
  }
  ];

  const tabList = [
    {
      key: 'tab1',
      tab: 'Річні звіти станиць',
    },
    {
      key: 'tab2',
      tab: 'Річні звіти куренів',
    },
    {
      key: 'tab3',
      tab: 'Річні звіти округів',
    },
  ];

  const columnsClub=[
    {
      title: "Номер",
      dataIndex: "id",
    },
    {
      title: "Курінь",
      dataIndex: ["clubName"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (status: any) => {
        return (
          <Tag color={setTagColor(status)} key={reportStatusNames[status]}>
            <Tooltip placement="topLeft" title={reportStatusNames[status]}>
        {reportStatusNames[status]}
            </Tooltip>
          </Tag>
        );
    },
    },
  ];

  const contentList:  { [key: string]: any }  = {
    tab1: <div><CityAnnualReportTable columns={columns} filteredData={annualReports}/></div>,
    tab2: <div><ClubAnnualReportTable columns={columnsClub} filteredData={clubAnnualReports}/></div>,
    tab3: <div><RegionAnnualReportTable columns={columnsRegion} filteredData={regionAnnualReports}/></div>,
  };


  const [noTitleKey, setKey] = useState<string>('tab1');


  const  renewPage = ()=>{
    const key = noTitleKey; 
    setKey('tab1');
    setKey('tab2');
    setKey(key);
    setvisible(false);
   }

   const onTabChange =  (key:string) => {
    setKey(key); 
 };


  return (
    <Layout.Content className="annualreport-table">
      <Title level={2}>Річні звіти</Title>
      <Row className="searchContainer" gutter={16}>
        <Col >
          <Input placeholder="Пошук" onChange={handleSearch} />
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setShowCitySelectModal(true)}
          >
            Подати річний звіт станиці
          </Button>
          </Col>
          <Col>
          <Button
            type="primary"
            onClick={() => setShowClubSelectModal(true)}
          >
            Подати річний звіт куреня
          </Button>
          </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setShowRegionAnnualReports(true)}
          >
            Подати річний звіт округу
          </Button>
          </Col>
      </Row>

      <Row>
      <Card
          style={{ width: '100%' }}
          tabList={tabList}
          activeTabKey={noTitleKey}
          onTabChange={(key) => {
            onTabChange(key);
          }}
        >
          {contentList[noTitleKey]}
        </Card>

      </Row>
        <FormAnnualReportRegion
        visibleModal={showRegionAnnualReports}
        handleOk={() => setShowRegionAnnualReports(false)}
        />
        <CitySelectModal
        visibleModal={showCitySelectModal}
        handleOk={() => setShowCitySelectModal(false)}
        />
        <ClubSelectModal
        visibleModal={showClubSelectModal}
        handleOk={() => setShowClubSelectModal(false)}
        />
    </Layout.Content>

    
  );
};

export default AnnualReportTable;
