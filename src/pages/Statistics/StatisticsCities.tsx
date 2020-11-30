import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
  Typography,
  Col,
  TreeSelect
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import City from "./Interfaces/City";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import AnnualReportApi from "../../api/AnnualReportApi";
import CityStatistics from "./Interfaces/CityStatistics";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction
} from "bizcharts";
import "./StatisticsCities.less";
import { number } from "yup";

const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [dataForTable, setdataForTable] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [dataChart, setDataChart] = useState(Array());
  const [dataFromRow, setdataFromRow] = useState<DataFromResponse>();
  const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());
  const [title, setTitle] = useState<DataFromResponse>();
  
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
      width: 150
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 80
    },
    {
      title: "Округ",
      dataIndex: "regionName",
      key: "regionName",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 150
    }
  ];

  const indicatorsArray = [
    { value: StatisticsItemIndicator.NumberOfPtashata, label: "Пташата" },
    { value: StatisticsItemIndicator.NumberOfNovatstva, label: "Новацтво" },
    { value: StatisticsItemIndicator.NumberOfUnatstva, label: "Юнацтво загалом" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaNoname, label: "Неіменовані" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSupporters, label: "Прихильники" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaMembers, label: "Учасники" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaProspectors, label: "Розвідувачі" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts, label: "Скоби/вірлиці" },
    { value: StatisticsItemIndicator.NumberOfSenior, label: "Старші пластуни загалом" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters, label: "Старші пластуни прихильники" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers, label: "Старші пластуни учасники" },
    { value: StatisticsItemIndicator.NumberOfSeigneur, label: "Сеньйори загалом" },
    { value: StatisticsItemIndicator.NumberOfSeigneurSupporters, label: "Сеньйори пластуни прихильники" },
    { value: StatisticsItemIndicator.NumberOfSeigneurMembers, label: "Сеньйори пластуни учасники" }
  ];
  
  const { Title } = Typography;
  const { TreeNode } = TreeSelect;

  useEffect(() => {
    fetchCities();
    fetchYears();
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

  const fetchYears = async () => {
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

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const onSubmit = async (info: any) => {
    let counter = 1;
    setArrayOfIndicators(info.indicators);
    console.log(info.indicators)
    let response = await StatisticsApi.getCitiesStatistics({
      CityIds: info.citiesId,
      Years: info.years,
      Indicators: info.indicators
    });
    console.log(response);

    let data = response.data.map((stanytsya: CityStatistics) => {
      return stanytsya.yearStatistics.map(yearStatistic => {
        return {
          id: counter++,
          cityName: stanytsya.city.name,
          regionName: stanytsya.city.region.regionName,
          year: yearStatistic.year,
          ...yearStatistic.statisticsItems.map(it => it.value)
        }
      })
    }).flat();

    // reading statisticsItems' indicators of the very first element 
    // because they are the same for all the items
    let statistics = (response.data && response.data[0] && response.data[0].yearStatistics
      && response.data[0].yearStatistics[0] && response.data[0].yearStatistics[0].statisticsItems) || [];

    setShowTable(true);
    setdataForTable(data);

    let temp = [...constColumns, ...statistics.map((statisticsItem: any, index: any) => {
      return {
        title: indicatorsArray[statisticsItem.indicator as number].label,
        dataIndex: index,
        key: index,
        width: 130
      }
    })];

    setColumns(temp);
  };

  let sumOfIndicators = 0;
  dataChart.map((indicator: any) => { sumOfIndicators += indicator.count });
  
  let onChange = (pagination: any) => {
    if (pagination) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }    
  
if(dataFromRow != undefined)
{
  const regex = /[0-9]/g;
  arrayOfInindicators.sort(function(a, b){return a-b});
  console.log(arrayOfInindicators);
  console.log(dataFromRow);
  const allDataForChart = [...Object.entries(dataFromRow as Object).map(([key, value]) => {
    
    if(key.match(regex)!== null)
    {
    return{
      item: indicatorsArray[arrayOfInindicators[Number(key)]].label,
      count: value,
      percent: value    
    }}
  })]
  let indicatorsForChart = allDataForChart.slice(0, columns.length - 4);
  setTitle(dataFromRow);
  setDataChart(indicatorsForChart);
  setdataFromRow(undefined);
}
let old = true;

  return (
    <Layout.Content >
      <div className = "background">
      <Title level={2}>Статистика станиць</Title>
      <div className = "formAndChart">
      <Form onFinish={onSubmit} className = "form">
        <Row justify="center">
          <Col
            span={20}>
            <Form.Item

              labelCol={{span: 24}}
              label="Станиці"
              name="citiesId"
              rules={[{required: true, message: shouldContain("хоча б одну станицю"), type: "array"}]} >

              name="citiesId"
              rules={[{ required: true, message: "Оберіть хоча б одну станицю", type: "array" }]} >

              <Select
                maxTagCount={4}
                showSearch
                allowClear
                mode="multiple"
                options={cities}
                placeholder="Обрати станицю"
                filterOption={(input, option) => (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col
            span={20}>
            <Form.Item

              labelCol={{span: 24}}
              label="Роки"
              name="years"
              rules={[{required: true, message: shouldContain("хоча б один рік"), type: "array"}]}>

              name="years"
              rules={[{ required: true, message: "Оберіть хоча б один рік", type: "array" }]}>

              <Select
                maxTagCount={8}
                showSearch
                allowClear
                mode="multiple"
                options={years}
                placeholder="Обрати рік"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" >
          <Col
            span={20}>
            <Form.Item

              labelCol={{span: 24}}
              label="Показники"
              name="indicators"
              rules={[{required: true, message: shouldContain("хоча б один показник"), type: "array"}]}>

              name="indicators"
              rules={[{ required: true, message: "Оберіть хоча б один показник", type: "array" }]}>

              <TreeSelect
                maxTagCount={4}
                showSearch
                allowClear
                multiple
                treeDefaultExpandAll
                placeholder="Обрати показник"

                filterTreeNode={(input, option) => (option?.title as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                <TreeNode value={0} title="Пташата"/>
                <TreeNode value={1} title="Новацтво"/>
                <TreeNode value={2} title="Юнацтво загалом" selectable = {selectableUnatstvaZahalom}>
                <TreeNode value={3} title="Неіменовані" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={4} title="Прихильники" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={5} title="Учасники" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={6} title="Розвідувачі" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={7} title="Скоби/вірлиці" selectable = {selectableUnatstvaPart}/>

                filterTreeNode={(input, option) => (option?.title as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <TreeNode value={0} title="Неіменовані" />
                <TreeNode value={1} title="Новацтво" />
                <TreeNode value={2} title="Юнацтво загалом">
                <TreeNode value={3} title="Неіменовані" />
                <TreeNode value={4} title="Прихильники" />
                <TreeNode value={5} title="Учасники" />
                <TreeNode value={6} title="Розвідувачі" />
                <TreeNode value={7} title="Скоби/вірлиці" />

                </TreeNode>
                <TreeNode value={8} title="Старші пластуни загалом" selectable = {old}>
                <TreeNode value={9} title="Старші пластуни прихильники"/>
                <TreeNode value={10} title="Старші пластуни учасники"/>
                </TreeNode>
                <TreeNode value={11} title="Сеньйори загалом">
                <TreeNode value={12} title="Сеньйори пластуни прихильники"/>
                <TreeNode value={13} title="Сеньйори пластуни учасники"/>
                </TreeNode>
              </TreeSelect>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit">Сформувати</Button>
          </Col>
        </Row>
      </Form>
      <br/>
      {sumOfIndicators === 0 || title === undefined ? '': 
      <div className = "chart">         
        <h1>{title.cityName}, {title.year}</h1>
        <Chart height={400} data={dataChart} justify="center" autoFit>
        <Coordinate type="theta" radius={0.75}/>
        <Tooltip showTitle={false}/>
        <Axis visible={false}/>
        <Interval
          position="percent"
          adjust="stack"
          color="item"
          style={{
            lineWidth: 1,
            stroke: "#fff",
          }}
          label={["count", {
            content: (data) => {
              return `${data.item}: ${Math.round(data.percent / sumOfIndicators * 100)}%`;
            },
          }]}
        />
        <Interaction type="element-single-selected"/>
      </Chart>
      </div>}
      </div>
      <br/> 
      {showTable === false ? "" :
        <Table

          bordered 
          rowClassName={(record, index) => index === onClickRow ? "onClickRow" : "" }

          bordered

          rowKey="id"
          columns={columns}
          dataSource={dataForTable}
          scroll={{ x: 1000 }}
          onRow={(cityRecord) => {
            return {
              onClick: async () => {                
                setdataFromRow(cityRecord);
              }};
          }}
          
          onChange={onChange}
          pagination={{
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
          }}
        />}        
      </div>
    </Layout.Content>
  )
}

export default StatisticsCities;