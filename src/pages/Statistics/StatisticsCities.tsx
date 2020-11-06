import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Input,
  Row,
  Col,
  Typography
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import City from "./Interfaces/City";
import Region from './Interfaces/Region';
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import AnnualReportApi from "../../api/AnnualReportApi";
import { useHistory, useLocation } from 'react-router-dom';
import StatisticsParameters from './Interfaces/StatisticsParameters';
import Filters from "./Filters";
import MembersStatistic from "../AnnualReport/Interfaces/MembersStatistic";
import CityStatistics from "./Interfaces/CityStatistics";
import YearStatistics from "./Interfaces/YearStatistics";
import StatisticsItem from "./Interfaces/StatisticsItem";
import DataFromResponse from "./Interfaces/DataFromResponse";


const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [indicators, setIndicators] = useState<any>();
  const [cities, setCities] = useState<any>();
  const indicatorsForNeeds = StatisticsItemIndicator;
  const [result, setResult] = useState<DataFromResponse[]>(Array());
  const [searchedData, setSearchedData] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());

  const constColumns = [
    {
      title: "Порядковий номер",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Станиця",
      dataIndex: "cityName",
      key: "cityName"
    },
    {
      title: "Регіон",
      dataIndex: "regionName",
      key: "regionName"
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year"
    },
  ];

  const {
    cityFilter,
    regionFilter
  } = Filters;

  useEffect(() => {
    fetchCities();
    fechYears();
    fechIndicatorsNames();
  }, []);

  const fetchCities = async () => {
    try {
      let response = await AnnualReportApi.getCities();
      let cities = response.data.cities as City[];
      setCities(cities.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }));
    }
    catch (error) {
      showError(error.message);
    }
  };

  const fechYears = async () => {
    try {
      const arrayOfYears = [];
      var endDate = Number(new Date().getFullYear());
      for (let i = 2000; i <= endDate; i++) {
        arrayOfYears.push({ lable: i.toString(), value: i });
      }
      setYears(arrayOfYears);
    }
    catch (error) {
      showError(error.message);
    }
  }

  const fechIndicatorsNames = async () => {
    try {
      const indicatorsArray = [
        { value: indicatorsForNeeds.NumberOfPtashata, label: 'Кількість пташат' },
        { value: indicatorsForNeeds.NumberOfNovatstva, label: 'Кількість новацтва' },
        { value: indicatorsForNeeds.NumberOfUnatstva, label: 'Кількість юнацтва загалом' },
        { value: indicatorsForNeeds.NumberOfUnatstvaNoname, label: 'Кількість неіменованих' },
        { value: indicatorsForNeeds.NumberOfUnatstvaSupporters, label: 'Кількість прихильників' },
        { value: indicatorsForNeeds.NumberOfUnatstvaMembers, label: 'Кількість учасників' },
        { value: indicatorsForNeeds.NumberOfUnatstvaProspectors, label: 'Кількість розвідувачів' },
        { value: indicatorsForNeeds.NumberOfUnatstvaSkobVirlyts, label: 'Кількість скобів/вірлиць' },
        { value: indicatorsForNeeds.NumberOfSenior, label: 'Кількість старших пластунів загалом' },
        { value: indicatorsForNeeds.NumberOfSeniorPlastynSupporters, label: 'Кількість старших пластунів прихильників' },
        { value: indicatorsForNeeds.NumberOfSeniorPlastynMembers, label: 'Кількість старших пластунів учасників' },
        { value: indicatorsForNeeds.NumberOfSeigneur, label: 'Кількість сеньйорів загалом' },
        { value: indicatorsForNeeds.NumberOfSeigneurSupporters, label: 'Кількість сеньйорів пластунів прихильників' },
        { value: indicatorsForNeeds.NumberOfSeigneurMembers, label: 'Кількість сеньйорів пластунів учасників' }
      ]
      setIndicators(indicatorsArray);
    }
    catch (error) {
      showError(error.message);
    }
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const showSuccess = (message: string) => {
    Modal.success({
      content: message,
    });
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

  const filteredData =
    searchedData !== ""
      ? result.filter(
          (item:any) =>
            cityFilter(item.city as City, searchedData) ||
            regionFilter(item.city?.region as Region, searchedData)
        )
      : result;
  
  
  

  const onSubmit = async (info: any) => {
    const counter = 0;
    const statisticsParameters: StatisticsParameters = {
      CitiesId: info.citiesId,
      Years: info.years,
      Indicators: info.indicators
    }
    let data  = Array<DataFromResponse>();
    let response = await StatisticsApi.getStatisticsForCitiesForYears(statisticsParameters);
    console.log(response); // забрати потім
    (response.data).map((stanytsya: CityStatistics) => { 
      (stanytsya.yearStatistics).map((years) => {
          data.push( 
            {
              id: counter + 1,
              cityName: stanytsya.city.name,
              regionName: stanytsya.city.region.regionName,
              year: years.year,
              number: years.statisticsItems,
              numberOfPtashata: years.statisticsItems[0].value,
              numberOfNovatstva: years.statisticsItems[1].value,
              numberOfUnatstva: years.statisticsItems[2].value,
              numberOfUnatstvaNoname: years.statisticsItems[3].value,
              numberOfUnatstvaSupporters: years.statisticsItems[4].value,
              numberOfUnatstvaMembers: years.statisticsItems[5].value,
              numberOfUnatstvaProspectors: years.statisticsItems[6].value,
              numberOfUnatstvaSkobVirlyts: years.statisticsItems[7].value,
              numberOfSenior: years.statisticsItems[8].value,
              numberOfSeniorPlastynSupporters: years.statisticsItems[9].value,
              numberOfSeniorPlastynMembers: years.statisticsItems[10].value,
              numberOfSeigneur: years.statisticsItems[11].value,
              numberOfSeigneurSupporters: years.statisticsItems[12].value,
              numberOfSeigneurMembers: years.statisticsItems[13].value
            })
          }
      )});
      console.log(data); // забрати потім
      setShowTable(true);
      setResult(data);
      console.log(data); // забрати потім
      let temp = [...constColumns, ...data[0].number.map(statisticsItem => {
        //if(statisticsItem.indicator === 0){
          return {
            title: statisticsItem.indicator,
            dataIndex: "numbe",
            key: "number"  
          }
        //}
        
      })];
      console.log(temp);
      setColumns(temp);
  };
  
  
    



  
  return (
    <Layout.Content>
      <Form onFinish={onSubmit}>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name='citiesId'
              rules={[{ required: true, message: 'Оберіть хоча б одну станицю', type: 'array' }]} >
              <Select
                showSearch
                mode='multiple'
                options={cities}
                placeholder='Обрати станицю'
                 />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name='years'
              rules={[{ required: true, message: 'Оберіть хоча б один рік', type: 'array' }]}>
              <Select
                showSearch
                mode='multiple'
                options={years}
                placeholder='Обрати рік'
                />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name='indicators'
              rules={[{ required: true, message: 'Оберіть хоча б один показник', type: 'array' }]}>
              <Select
                showSearch
                mode='multiple'
                options={indicators}
                placeholder='Обрати показник'
                />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='start'>
          <Col>
            <Button
              type='primary'
              htmlType='submit' >
              Сформувати
                    </Button>
          </Col>
        </Row>
      </Form>
      <br/>
      {showTable === false ? '' :
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={result}
        
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
      />}
    </Layout.Content>
  )
}

export default StatisticsCities;