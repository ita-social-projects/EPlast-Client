import React, { useEffect, useState } from "react";
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
  TreeSelect,
  Tooltip as AntTooltip
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
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
import{ shouldContain } from "../../components/Notifications/Messages"
import { ClearOutlined, LoadingOutlined } from '@ant-design/icons';
import City from "./Interfaces/City";

const StatisticsCities = () => {

  const [form] = Form.useForm();
  const [years, setYears] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [dataForTable, setDataForTable] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [dataChart, setDataChart] = useState(Array());
  const [dataFromRow, setDataFromRow] = useState<DataFromResponse>();
  const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());
  const [title, setTitle] = useState<DataFromResponse>();
  const [selectableUnatstvaPart, setSelectableUnatstvaPart] = useState<boolean>(true);
  const [selectableUnatstvaZahalom, setSelectableUnatstvaZahalom] = useState<boolean>(true);
  const [selectableSeniorPart, setSelectableSeniorPart] = useState<boolean>(true);
  const [selectableSeniorZahalom, setSelectableSeniorZahalom] = useState<boolean>(true);
  const [selectableSeigneurPart, setSelectableSeigneurPart] = useState<boolean>(true);
  const [selectableSeigneurZahalom, setSelectableSeigneurZahalom] = useState<boolean>(true);
  const [onClickRow, setOnClickRow] = useState<any>();
  const [isLoadingCities, setIsLoadingCities]=useState<boolean>(false);

  
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
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 80
    },
    {
      title: "Округа",
      dataIndex: "regionName",
      key: "regionName",
      fixed: "left",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 150
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
    setIsLoadingCities(true);
    try {
      let response = await AnnualReportApi.getCities();
      let cities = response.data as City[];
      setCities(cities.map(item => {
        return {
          label: item.name,
          value: item.id
        }
    }));
    }
    catch (error) {
      showError(error.message);
    }finally{setIsLoadingCities(false)}
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
        width: 130
      }
    })];
    setColumns(temp);
  };

  // calculating for chart percentage
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
              <Form 
              form={form}
              onFinish={onSubmit}>
                <Row style={{float: "right", marginRight: "20px", marginTop: "-50px"}}>
                  <AntTooltip title="Очистити">
                    <ClearOutlined onClick={()=>form.resetFields()} style={{
                                    fontSize: "x-large",
                                    cursor: "pointer",
                                }} />
                  </AntTooltip>   
                </Row>
                <Row justify="center">
                  <Col
                    span={20}>
                      <Form.Item
                        labelCol={{span: 24}}
                        label="Станиці"
                        name="citiesId"
                        rules={[{required: true, message: shouldContain("хоча б одну станицю"), type: "array"}]} >
                      <Select
                        maxTagCount={4}
                        showSearch
                        allowClear
                        mode="multiple"
                        options={cities}
                        placeholder={<span>Обрати станицю {isLoadingCities && <LoadingOutlined />}</span>}
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
              <Row justify="center"> 
                  <Col
                    span={20}>
                      <Form.Item
                        labelCol={{span: 24}}
                        label="Показники"
                        name="indicators"
                        rules={[{required: true, message: shouldContain("хоча б один показник"), type: "array"}]}>
                        <TreeSelect
                          maxTagCount={4}
                          showSearch
                          allowClear
                          multiple
                          onChange={onClick}
                          treeDefaultExpandAll
                          placeholder="Обрати показник"
                          filterTreeNode={(input, option) => (option?.title as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            <TreeNode value={0} title="Пташата"/>
                            <TreeNode value={1} title="Новацтво"/>
                            <TreeNode value={2} title="Юнацтво загалом" disabled = {!selectableUnatstvaZahalom}>
                              <TreeNode value={3} title="Неіменовані" disabled = {!selectableUnatstvaPart}/>
                              <TreeNode value={4} title="Прихильники" disabled = {!selectableUnatstvaPart}/>
                              <TreeNode value={5} title="Учасники" disabled = {!selectableUnatstvaPart}/>
                              <TreeNode value={6} title="Розвідувачі" disabled = {!selectableUnatstvaPart}/>
                              <TreeNode value={7} title="Скоби/вірлиці" disabled = {!selectableUnatstvaPart}/>
                            </TreeNode>
                            <TreeNode value={8} title="Старші пластуни загалом" disabled = {!selectableSeniorZahalom}>
                              <TreeNode value={9} title="Старші пластуни прихильники" disabled = {!selectableSeniorPart}/>
                              <TreeNode value={10} title="Старші пластуни учасники" disabled = {!selectableSeniorPart}/>
                            </TreeNode>
                            <TreeNode value={11} title="Сеньйори загалом" disabled = {!selectableSeigneurZahalom}>
                              <TreeNode value={12} title="Сеньйори пластуни прихильники" disabled = {!selectableSeigneurPart}/>
                              <TreeNode value={13} title="Сеньйори пластуни учасники" disabled = {!selectableSeigneurPart}/>
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
      </div>
      <br/>
      {sumOfIndicators === 0 || title === undefined || onClickRow === null ? '': 
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
              return `${data.item}: ${(data.percent / sumOfIndicators * 100).toFixed(2)}%`;
            },
          }]}
        />
        <Interaction type="element-single-selected"/>
      </Chart>
      </div>}
      </div>
      <br/>
      {!showTable ? "" :
        <Table
          bordered 
          rowClassName={(record, index) => index === onClickRow ? "onClickRow" : "" }
          rowKey="id"
          columns={columns}
          dataSource={dataForTable}
          scroll={{ x: 1000 }}
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