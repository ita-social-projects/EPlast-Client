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
import {CaretUpOutlined, CaretDownOutlined} from "@ant-design/icons";


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

const AnnualReportTable = () => {
  const [reportStatusNames, setReportStatusNames] = useState<any[]>(Array());
  const [showRegionAnnualReports, setShowRegionAnnualReports] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(false);
  const [showClubSelectModal, setShowClubSelectModal] = useState<boolean>(false);
  const [sortKey, setSortKey]=useState<number>(1);
  const [cityManager, setCityManager] = useState<boolean>(false);
  const [clubManager, setClubManager] = useState<boolean>(false);
  const [regionManager, setRegionManager] = useState<boolean>(false);
  const [noTitleKey, setKey] = useState<string>('tab1');

  useEffect(() => {
    checkAccessToManage();
    fetchAnnualReportStatuses();
    setSearchedData(searchedData);
    renewPage();
  }, [searchedData, sortKey]);

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
    setRegionManager(roles.includes("Admin") || roles.includes("Голова Округи") || roles.includes("Голова Округу"));
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

  const SortDirection=(props:{sort: number})=>{
    return<>
      <div className={"TableHeader"}>
        <button onClick={()=>{setSortKey(props.sort)}} className={sortKey===props.sort? "sortDirection":""}><CaretUpOutlined /></button>
        <button onClick={()=>{setSortKey(-props.sort)}} className={sortKey===-props.sort? "sortDirection":""}><CaretDownOutlined /></button>
      </div>
    </>
  }

  const SortColumnHighlight =(sort: number, text: any)=>{
    return {
      props: {
        style: { background: (sortKey===sort || sortKey===-sort)? "#fafafa" : "", }
      },
      children: <div>{text}</div>
    };
  }

  const columns = [
    {
      title: <>Номер<SortDirection sort={1} /></>,
      dataIndex: ["idView"],
      width: '8%',
      render: (text: any)=>{return SortColumnHighlight(1, text)},
    },

    {
      title: <>Станиця<SortDirection sort={2} /></>,
      dataIndex: ["cityName"],
      render: (text: any)=>{return SortColumnHighlight(2, text)},
    },
    {
      title: <>Округа<SortDirection sort={3} /></>,
      dataIndex: ["regionName"],
      render: (text: any)=>{return SortColumnHighlight(3, text)},
    },
    {
      title: <>Дата подання<SortDirection sort={4} /></>,
      dataIndex: "date",
      render: (date: any)=>{return SortColumnHighlight(4, moment(date.toLocaleString()).format("DD.MM.YYYY"))},
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

  const columnsRegion = [
    {
      title: <>Номер<SortDirection sort={1} /></>,
      dataIndex: "id",
      width: '8%',
      render: (text: any)=>{return SortColumnHighlight(1, text)},
    },

    {
      title: <>Округа<SortDirection sort={2} /></>,
      dataIndex: ["regionName"],
      render: (text: any)=>{return SortColumnHighlight(2, text)},
    },
    {
      title: <>Дата подання<SortDirection sort={3} /></>,
      dataIndex: "date",
      render: (date: any)=>{return SortColumnHighlight(3, moment(date.toLocaleString()).format("DD.MM.YYYY"))},
    }
  ];

  const columnsClub=[
    {
      title: <>Номер<SortDirection sort={1} /></>,
      dataIndex: ["idView"],
      width: '8%',
      render: (text: any)=>{return SortColumnHighlight(1, text)},
    },
    {
      title: <>Курінь<SortDirection sort={2} /></>,
      dataIndex: ["clubName"],
      render: (text: any)=>{return SortColumnHighlight(2, text)},
    },
    {
      title: <>Дата подання<SortDirection sort={3} /></>,
      dataIndex: "date",
      render: (date: any)=>{return SortColumnHighlight(3, moment(date.toLocaleString()).format("DD.MM.YYYY"))},
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
    tab1: <div><CityAnnualReportTable columns={columns} searchedData={searchedData} sortKey={sortKey}/></div>,
    tab2: <div><ClubAnnualReportTable columns={columnsClub} searchedData={searchedData} sortKey={sortKey}/></div>,
    tab3: <div><RegionAnnualReportTable columns={columnsRegion} searchedData={searchedData} sortKey={sortKey}/></div>,
  };


  const  renewPage = ()=>{
    setKey(noTitleKey);
   }

   const onTabChange =  (key:string) => {
    setSortKey(1);
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
      {regionManager? <FormAnnualReportRegion
          visibleModal={showRegionAnnualReports}
          handleOk={() => setShowRegionAnnualReports(false)}
      />: null}
      {cityManager? <CitySelectModal
          visibleModal={showCitySelectModal}
          handleOk={() => setShowCitySelectModal(false)}
      />:null}
      {clubManager? <ClubSelectModal
          visibleModal={showClubSelectModal}
          handleOk={() => setShowClubSelectModal(false)}
      />:null}
    </Layout.Content>

    
  );
};

export default AnnualReportTable;
