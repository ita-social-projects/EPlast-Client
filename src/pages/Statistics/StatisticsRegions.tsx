import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
  Col
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";
import RegionsApi from "../../api/regionsApi";
import Region from "./Interfaces/Region";
import RegionStatistics from "./Interfaces/RegionStatistics";
import{ shouldContain } from "../../components/Notifications/Messages"

const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [indicators, setIndicators] = useState<any>();
  const [result, setResult] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [regions, setRegions] = useState<any>();

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
      title: "Округ",
      dataIndex: "regionName",
      key: "regionName",
      fixed: "left",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
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
    fetchRegions();
    fechYears();
    fechIndicatorsNames();
  }, []);

  const fetchRegions = async () => {
    try {
      let response = await RegionsApi.getRegions();
      let regions = response.data as Region[];
      setRegions(regions.map(item => {
        return {
          label: item.regionName,
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

  const onSubmit = async (info: any) => {
    let counter = 1;

    let response = await StatisticsApi.getRegionsStatistics({
      RegionIds: info.regionIds,
      Years: info.years,
      Indicators: info.indicators
    });

    let data = response.data.map((region: RegionStatistics) => {
      return region.yearStatistics.map(yearStatistic => {
        return {
          id: counter++,
          regionName: region.region.regionName,
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
    setResult(data);

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
      <h1>Статистика округів</h1>
      <Form onFinish={onSubmit}>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name="regionIds"
              rules={[{ required: true, message: shouldContain("хоча б один округ"), type: "array" }]} >
              <Select
                showSearch
                mode="multiple"
                options={regions}
                placeholder="Обрати округ"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={8} >
            <Form.Item
              name="years"
              rules={[{ required: true, message: shouldContain("хоча б один рік"), type: "array" }]}>
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
              rules={[{ required: true, message: shouldContain("хоча б один показник"), type: "array" }]}>
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
      <br />
      {showTable === false ? "" :
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={result}
          scroll={{ x: 1000 }}
          onChange={onChange}
          pagination={{
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
          }}
        />}
    </Layout.Content>
  )
}

export default StatisticsCities;