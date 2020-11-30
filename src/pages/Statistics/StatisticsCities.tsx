import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
<<<<<<< HEAD
  Typography,
  Col,
  TreeSelect
=======
  Col
>>>>>>> parent of dca0802... Working process on statistics chart
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import City from "./Interfaces/City";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import AnnualReportApi from "../../api/AnnualReportApi";
import CityStatistics from "./Interfaces/CityStatistics";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";
<<<<<<< HEAD
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction
} from "bizcharts";
import "./StatisticsCities.less";
import{ shouldContain } from "../../components/Notifications/Messages"
=======

>>>>>>> parent of dca0802... Working process on statistics chart

const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [dataForTable, setDataForTable] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
<<<<<<< HEAD
  const [dataChart, setDataChart] = useState(Array());
  const [dataFromRow, setDataFromRow] = useState<DataFromResponse>();
  const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());
  const [title, setTitle] = useState<DataFromResponse>();
  const [selectableUnatstvaPart, setSelectableUnatstvaPart] = useState<boolean>();
  const [selectableUnatstvaZahalom, setSelectableUnatstvaZahalom] = useState<boolean>();
  const [selectableSeniorPart, setSelectableSeniorPart] = useState<boolean>();
  const [selectableSeniorZahalom, setSelectableSeniorZahalom] = useState<boolean>();
  const [selectableSeigneurPart, setSelectableSeigneurPart] = useState<boolean>();
  const [selectableSeigneurZahalom, setSelectableSeigneurZahalom] = useState<boolean>();
  const [onClickRow, setOnClickRow] = useState<any>();
  
=======

>>>>>>> parent of dca0802... Working process on statistics chart
  const constColumns = [
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
      width: 100
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
<<<<<<< HEAD
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
    
=======
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

>>>>>>> parent of dca0802... Working process on statistics chart
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

<<<<<<< HEAD
=======
  const fechIndicatorsNames = async () => {
    try {
      setIndicators(indicatorsArray);
    }
    catch (error) {
      showError(error.message);
    }
  };

>>>>>>> parent of dca0802... Working process on statistics chart
  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const onSubmit = async (info: any) => {
    let counter = 1;
    let response = await StatisticsApi.getCitiesStatistics({
      CityIds: info.citiesId,
      Years: info.years,
      Indicators: info.indicators
    });

    // seting (for chart needs) statisticsItems indicators of the very first element 
    // because they are the same for all the elements
    setArrayOfIndicators(response.data[0].yearStatistics[0].statisticsItems.map((it: any)=> it.indicator));

    // reading data from response and seting data for table
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
    
    setShowTable(true);
    setDataForTable(data);
    setOnClickRow(null);

    // reading statisticsItems indicators of the very first element 
    // because they are the same for all the elements
    let statistics = (response.data && response.data[0] && response.data[0].yearStatistics
      && response.data[0].yearStatistics[0] && response.data[0].yearStatistics[0].statisticsItems) || [];

    // creating and seting columns for table
    let temp = [...constColumns, ...statistics.map((statisticsItem: any, index: any) => {
      return {
        title: indicatorsArray[statisticsItem.indicator as number].label,
        dataIndex: index,
        key: index,
        width: 200
      }
    })];
    setColumns(temp);
  };

<<<<<<< HEAD
  // calculating for chart percentage
  let sumOfIndicators = 0;
  dataChart.map((indicator: any) => { sumOfIndicators += indicator.count });
  
=======
>>>>>>> parent of dca0802... Working process on statistics chart
  let onChange = (pagination: any) => {
    if (pagination) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
<<<<<<< HEAD
  }    
  
if(dataFromRow != undefined)
{
  const regex = /[0-9]/g;

  // seting data for chart
  const allDataForChart = [...Object.entries(dataFromRow as Object).map(([key, value]) => {
    if(key.match(regex)!== null)
    {
    return{
      item: indicatorsArray[arrayOfInindicators[Number(key)]].label,
      count: value,
      percent: value    
    }}
  })]
  let indicatorsForChart = allDataForChart.slice(0, columns.length - 3);
  setTitle(dataFromRow);
  setDataChart(indicatorsForChart);
  setDataFromRow(undefined);
}

const onClick = (value: Array<Number>) => {
  
  if (value.includes(2)) {
    setSelectableUnatstvaPart(false);
  }
  if(!value.includes(2)){
    setSelectableUnatstvaPart(true);
  }
  if (value.includes(3)||value.includes(4)||value.includes(5)||value.includes(6)||value.includes(7)) {
    setSelectableUnatstvaZahalom(false);
  }
  if (!value.includes(3)&&!value.includes(4)&&!value.includes(5)&&!value.includes(6)&&!value.includes(7)) {
    setSelectableUnatstvaZahalom(true);
  }
  
  if (value.includes(8)) {
    setSelectableSeniorPart(false);
  }
  if (!value.includes(8)) {
    setSelectableSeniorPart(true);
  }
  if (value.includes(9)||value.includes(10)) {
    setSelectableSeniorZahalom(false);
  }
  if (!value.includes(9)&&!value.includes(10)) {
    setSelectableSeniorZahalom(true);
  }

  if (value.includes(11)) {
    setSelectableSeigneurPart(false);
  }
  if (!value.includes(11)) {
    setSelectableSeigneurPart(true);
  }
  if (value.includes(12)||value.includes(13)) {
    setSelectableSeigneurZahalom(false);
  }
  if (!value.includes(12)&&!value.includes(13)) {
    setSelectableSeigneurZahalom(true);
  }

  if (value.length == 0) {
    setSelectableUnatstvaPart(true);
    setSelectableUnatstvaZahalom(true);
    setSelectableSeniorPart(true);
    setSelectableSeniorZahalom(true);
    setSelectableSeigneurPart(true);
    setSelectableSeigneurZahalom(true);
  }
}

  return (
    <Layout.Content >
      <div className = "background">
      <Title level={2}>Статистика станиць</Title>
      <div className = "formAndChart">
      <div className = "form"> 
=======
  }

  return (
    <Layout.Content>
      <h1>Статистика станиць</h1>
>>>>>>> parent of dca0802... Working process on statistics chart
      <Form onFinish={onSubmit}>
        <Row>
          <Col
            span={20} >
            <Form.Item
              labelCol={{ span: 24 }}
              label="Станиці"
              name="citiesId"
              rules={[{ required: true, message: shouldContain("хоча б одну станицю"), type: "array" }]} >
              <Select
                showSearch
                allowClear
                mode="multiple"
                options={cities}
                placeholder="Обрати станицю"
                filterOption={(input, option) => (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
<<<<<<< HEAD
        </Row>        
        <Row justify="center">
=======
        </Row>
        <Row>
>>>>>>> parent of dca0802... Working process on statistics chart
          <Col
            span={20} >
            <Form.Item
              labelCol={{ span: 24 }}
              label="Роки"
              name="years"
              rules={[{ required: true, message: shouldContain("хоча б один рік"), type: "array" }]}>
              <Select
                showSearch
                allowClear
                mode="multiple"
                options={years}
                placeholder="Обрати рік"
              />
            </Form.Item>
          </Col>
<<<<<<< HEAD
        </Row>        
        <Row justify="center">
=======
        </Row>
        <Row>
>>>>>>> parent of dca0802... Working process on statistics chart
          <Col
            span={20} >
            <Form.Item
              labelCol={{ span: 24 }}
              label="Показники"
              name="indicators"
              rules={[{ required: true, message: shouldContain("хоча б один показник"), type: "array" }]}>
              <TreeSelect
                showSearch
                allowClear
                multiple
                onChange={onClick}
                treeDefaultExpandAll
                placeholder="Обрати показник"
                filterTreeNode={(input, option) => (option?.title as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <TreeNode value={0} title="Пташата"/>
                <TreeNode value={1} title="Новацтво"/>
                <TreeNode value={2} title="Юнацтво загалом" selectable = {selectableUnatstvaZahalom}>
                <TreeNode value={3} title="Неіменовані" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={4} title="Прихильники" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={5} title="Учасники" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={6} title="Розвідувачі" selectable = {selectableUnatstvaPart}/>
                <TreeNode value={7} title="Скоби/вірлиці" selectable = {selectableUnatstvaPart}/>
                </TreeNode>
                <TreeNode value={8} title="Старші пластуни загалом" selectable = {selectableSeniorZahalom}>
                <TreeNode value={9} title="Старші пластуни прихильники" selectable = {selectableSeniorPart}/>
                <TreeNode value={10} title="Старші пластуни учасники" selectable = {selectableSeniorPart}/>
                </TreeNode>
                <TreeNode value={11} title="Сеньйори загалом" selectable = {selectableSeigneurZahalom}>
                <TreeNode value={12} title="Сеньйори пластуни прихильники" selectable = {selectableSeigneurPart}/>
                <TreeNode value={13} title="Сеньйори пластуни учасники" selectable = {selectableSeigneurPart}/>
                </TreeNode>
              </TreeSelect>
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
<<<<<<< HEAD
      </div>
      <br/>
      {sumOfIndicators === 0 || title === undefined || onClickRow === null ? '': 
      <div className = "chart">         
        <h1>{title.cityName}, {title.year}</h1>
        <Chart height={400} data={dataChart} justify="center" autoFit>
        <Coordinate type="theta" radius={0.75} />
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
        <Interaction type="element-single-selected" />
      </Chart>
      </div>}
      </div>
      <br/> 
=======
      <br />
>>>>>>> parent of dca0802... Working process on statistics chart
      {showTable === false ? "" :
        <Table
          bordered          
          className = "tableRow"
          onHeaderRow={() => {
            return{
              style: {textAlign: "center"},
              className: "tableRow"
            }
          }}
          rowClassName={(record, index) => index === onClickRow ? "onClickRow" : "tableRow" }
          rowKey="id"
          columns={columns}
          dataSource={dataForTable}
          scroll={{ x: 1000 }}
<<<<<<< HEAD
          onRow={(cityRecord, index) => {
            return {              
              onClick: async () => {              
                setDataFromRow(cityRecord);
                setOnClickRow(index);
              },
              onDoubleClick: async () => {                
                setOnClickRow(null);
              }
            };
          }}
=======
>>>>>>> parent of dca0802... Working process on statistics chart
          onChange={onChange}
          pagination={{
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
          }}
<<<<<<< HEAD
        />}        
        </div>
=======
        />}
>>>>>>> parent of dca0802... Working process on statistics chart
    </Layout.Content>
  )
}

export default StatisticsCities;