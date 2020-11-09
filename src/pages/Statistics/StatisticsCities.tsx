import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
  Col} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import City from "./Interfaces/City";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import AnnualReportApi from "../../api/AnnualReportApi";
import StatisticsParameters from "./Interfaces/StatisticsParameters";
import CityStatistics from "./Interfaces/CityStatistics";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";


const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [indicators, setIndicators] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [result, setResult] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());

  const constColumns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.id - b.id },
      width: 55
    },
    {
      title: "Станиця",
      dataIndex: "cityName",
      key: "cityName",
      fixed: "left",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.cityName.localeCompare(b.cityName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 100
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 100
    },
    {
      title: "Регіон",
      dataIndex: "regionName",
      key: "regionName",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 200
    }    
  ];
  
  const indicatorsArray = [
    { value: StatisticsItemIndicator.NumberOfPtashata, label: "Кількість пташат" },
    { value: StatisticsItemIndicator.NumberOfNovatstva, label: "Кількість новацтва" },
    { value: StatisticsItemIndicator.NumberOfUnatstva, label: "Кількість юнацтва загалом" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaNoname, label: "Кількість неіменованих" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSupporters, label: "Кількість прихильників" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaMembers, label: "Кількість учасників" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaProspectors, label: "Кількість розвідувачів" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts, label: "Кількість скобів/вірлиць" },
    { value: StatisticsItemIndicator.NumberOfSenior, label: "Кількість старших пластунів загалом" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters, label: "Кількість старших пластунів прихильників" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers, label: "Кількість старших пластунів учасників" },
    { value: StatisticsItemIndicator.NumberOfSeigneur, label: "Кількість сеньйорів загалом" },
    { value: StatisticsItemIndicator.NumberOfSeigneurSupporters, label: "Кількість сеньйорів пластунів прихильників" },
    { value: StatisticsItemIndicator.NumberOfSeigneurMembers, label: "Кількість сеньйорів пластунів учасників" }
  ];

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

  const itemRender = (current: any, type: string, originalElement: any) => {
    if (type === "prev") {
      return <Button type="primary">Попередня</Button>;
    }
    if (type === "next") {
      return <Button type="primary">Наступна</Button>;
    }
    return originalElement;
  };

  const onSubmit = async (info: any) => {
    const statisticsParameters: StatisticsParameters = {
      CitiesId: info.citiesId,
      Years: info.years,
      Indicators: info.indicators
    }
    let data  = Array<any>();
    let counter = 0;

    let response = await StatisticsApi.getStatisticsForCitiesForYears(statisticsParameters);
    response.data.map((stanytsya: CityStatistics) => { 
      stanytsya.yearStatistics.map(year => {
          data.push( 
            {
              id: counter + 1,
              cityName: stanytsya.city.name,
              regionName: stanytsya.city.region.regionName,
              year: year.year,
              statisticsItems: year.statisticsItems,
              ...year.statisticsItems.map((it: Object) => {
                let [, value] = Object.entries(it)[1];
                return value;              
              })
            })
          counter ++;
        })
      });
      setShowTable(true);
      setResult(data);
      let temp = [...constColumns, ...data[0].statisticsItems.map((statisticsItem: any, index: any) => {
          return {
            title: indicatorsArray[statisticsItem.indicator as number].label,
            dataIndex: index,
            key: index,
            sorter: { compare: (a: any, b: any) => a.id - b.id },
            width: 200
          }
      })];
      setColumns(temp);
  };

  let onChange = (pagination: any) => {
    if (pagination) {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
        });
      }    
  }
    
  return (
    <Layout.Content>
     <h1>Статистика станиць</h1>
      <Form onFinish={onSubmit}>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name="citiesId"
              rules={[{ required: true, message: "Оберіть хоча б одну станицю", type: "array" }]} >
              <Select
                showSearch
                mode="multiple"
                options={cities}
                placeholder="Обрати станицю"
                 />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name="years"
              rules={[{ required: true, message: "Оберіть хоча б один рік", type: "array" }]}>
              <Select
                showSearch
                mode="multiple"
                options={years}
                placeholder="Обрати рік"
                />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name="indicators"
              rules={[{ required: true, message: "Оберіть хоча б один показник", type: "array" }]}>
              <Select
                showSearch
                mode="multiple"
                options={indicators}
                placeholder="Обрати показник"
                />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start">
          <Col>
            <Button
              type="primary"
              htmlType="submit" >
              Сформувати
                    </Button>
          </Col>
        </Row>
      </Form>
      <br/>
      {showTable === false ? "" : 
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={result}
        scroll={{ x: 1500, y: 300 }}
        onChange={onChange}
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