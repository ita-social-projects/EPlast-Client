import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Modal,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import AnnualReportApi from "../../../api/AnnualReportApi";
import "./AnnualReportTable.less";
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import CitySelectModal from "./CitySelectModal/CitySelectModal";
import { Card } from 'antd';
import { CityAnnualReportTable } from "./CityAnnualReportTable";
import { ClubAnnualReportTable } from "./ClubAnnualReport";
import FormAnnualReportRegion from "./FormAnnualReportRegion"
import { RegionAnnualReportTable } from "./RegionAnnualReportTable";
import ClubSelectModal from "./ClubSelectModal/ClubSelectModal";
import Search from "antd/lib/input/Search";


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
  const [showRegionAnnualReports, setShowRegionAnnualReports] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(false);
  const [showClubSelectModal, setShowClubSelectModal] = useState<boolean>(false);
  const [cityManager, setCityManager] = useState<boolean>(false);
  const [clubManager, setClubManager] = useState<boolean>(false);
  const [regionManager, setRegionManager] = useState<boolean>(false);

  useEffect(() => {
    checkAccessToManage();
    fetchAnnualReportStatuses();
    setSearchedData(searchedData);
    renewPage();
  }, [searchedData]);

  const fetchAnnualReportStatuses = async () => {
    try {
      let response = await AnnualReportApi.getAnnualReportStatuses();
      setReportStatusNames(response.data.statuses);
    } catch (error) {
      showError(error.message);
    }
  };

  const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] as string[];
    setCityManager(roles.includes("Admin") || roles.includes("Голова Станиці"));
    setClubManager(roles.includes("Admin") || roles.includes("Голова Куреня"));
    setRegionManager(roles.includes("Admin") || roles.includes("Голова Округи") || roles.includes("Голова Округу"))
  };

  const handleSearch = (event: any) => {
    setSearchedData(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value.toLowerCase()==='') setSearchedData('');
  }


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
      width: 20,
      sorter:{
        compare: (a: any, b: any) => a.id - b.id,
      },
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "ascend",
    },

    {
      title: "Округа",
      dataIndex: ["regionName"],
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
      sorter: (a: any, b: any) => {
        a = a.date || " ";
        b = b.date || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
    }
  ];

  
  const columns = [
    {
      title: "Номер",
      dataIndex: "id",
      width: 20,
      sorter:{
        compare: (a: any, b: any) => a.id - b.id,
      },
      sortDirections: ["descend", "ascend"],
      //defaultSortOrder: "ascend",
    },

    {
      title: "Станиця",
      dataIndex: ["cityName"],
      sorter: (a: any, b: any) => {
        a = a.cityName || " ";
        b = b.cityName || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Округа",
      dataIndex: ["regionName"],
      sorter: (a: any, b: any) => {
        a = a.regionName || " ";
        b = b.regionName || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
      sorter: (a: any, b: any) => {
        a = a.date || " ";
        b = b.date || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
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
      tab: 'Річні звіти округ',
    },
  ];

  const columnsClub=[
    {
      title: "Номер",
      dataIndex: "id",
      width: 20,
      sorter:{
        compare: (a: any, b: any) => a.id - b.id,
      },
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Курінь",
      dataIndex: ["clubName"],
      sorter: (a: any, b: any) => {
        a = a.clubName || " ";
        b = b.clubName || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Дата подання",
      dataIndex: "date",
      render: (date: Date) => {
        return moment(date.toLocaleString()).format("DD.MM.YYYY");
      },
      sorter: (a: any, b: any) => {
        a = a.date || " ";
        b = b.date || " ";
        return a.localeCompare(b);
      },
      sortDirections: ["descend", "ascend"],
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
    tab1: <div><CityAnnualReportTable columns={columns} searchedData={searchedData}/></div>,
    tab2: <div><ClubAnnualReportTable columns={columnsClub} searchedData={searchedData}/></div>,
    tab3: <div><RegionAnnualReportTable columns={columnsRegion} searchedData={searchedData}/></div>,
  };


  const [noTitleKey, setKey] = useState<string>('tab1');


  const  renewPage = ()=>{
    setKey(noTitleKey);
   }

   const onTabChange =  (key:string) => {
    setKey(key);
 };


  return (
    <Layout.Content className="annualreport-table">
      <Title level={2}>Річні звіти</Title>
      <Row className="searchContainer" gutter={16}>
        <Col >
          <Search
              placeholder="Пошук"
              enterButton
              onChange={handleSearchChange}
              onSearch={handleSearch}
          />
        </Col>
        {cityManager? (<Col>
          <Button
              type="primary"
              onClick={() => setShowCitySelectModal(true)}
          >
            Подати річний звіт станиці
          </Button>
        </Col>): null }
        {clubManager? (<Col>
          <Button
              type="primary"
              onClick={() => setShowClubSelectModal(true)}
          >
            Подати річний звіт куреня
          </Button>
        </Col>) : null}
        {regionManager? (<Col>
          <Button
              type="primary"
              onClick={() => setShowRegionAnnualReports(true)}
          >
            Подати річний звіт округи
          </Button>
        </Col>) : null}
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
