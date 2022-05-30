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
  TreeSelect,
  Tooltip as AntTooltip,
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
  Interaction,
} from "bizcharts";
import "./StatisticsCities.less";
import {
  ReportNotFound,
  shouldContain,
} from "../../components/Notifications/Messages";
import {
  ClearOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import City from "./Interfaces/City";
import openNotificationWithIcon from "../../components/Notifications/Notification";

const StatisticsCities = () => {
  const [form] = Form.useForm();
  const [years, setYears] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [dataForTable, setDataForTable] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [dataChart, setDataChart] = useState(Array());
  const [dataFromRow, setDataFromRow] = useState<DataFromResponse>();
  const [dataChartShow, setShowDataChart] = useState<boolean>(true);
  const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());
  const [title, setTitle] = useState<DataFromResponse>();
  const [selectableUnatstvaPart, setSelectableUnatstvaPart] = useState<boolean>(
    true
  );
  const [selectableUnatstvaZahalom, setSelectableUnatstvaZahalom] = useState<
    boolean
  >(true);
  const [selectableSeniorPart, setSelectableSeniorPart] = useState<boolean>(
    true
  );
  const [selectableSeniorZahalom, setSelectableSeniorZahalom] = useState<
    boolean
  >(true);
  const [selectableSeigneurPart, setSelectableSeigneurPart] = useState<boolean>(
    true
  );
  const [selectableSeigneurZahalom, setSelectableSeigneurZahalom] = useState<
    boolean
  >(true);
  const [onClickRow, setOnClickRow] = useState<any>();
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null); // using this for scrolling

  const constColumns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.id - b.id },
      width: 65,
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 65,
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
      width: 130,
    },
    {
      title: "Округа",
      dataIndex: "regionName",
      key: "regionName",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 130,
    },
  ];

  const totalColumn = {
    title: "Усього",
    dataIndex: "total",
    key: "total",
    fixed: "right",
    sorter: { compare: (a: any, b: any) => a.total - b.total },
    width: 100,
  };

  const indicatorsArray = [
    { value: StatisticsItemIndicator.NumberOfPtashata, label: "Пташата" },
    { value: StatisticsItemIndicator.NumberOfNovatstva, label: "Новацтво" },
    {
      value: StatisticsItemIndicator.NumberOfUnatstva,
      label: "Юнацтво загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaNoname,
      label: "Неіменовані",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaSupporters,
      label: "Прихильники",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaMembers,
      label: "Учасники",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaProspectors,
      label: "Розвідувачі",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts,
      label: "Скоби/вірлиці",
    },
    {
      value: StatisticsItemIndicator.NumberOfSenior,
      label: "Старші пластуни загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters,
      label: "Старші пластуни прихильники",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers,
      label: "Старші пластуни учасники",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneur,
      label: "Сеньйори загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneurSupporters,
      label: "Сеньйори пластуни прихильники",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneurMembers,
      label: "Сеньйори пластуни учасники",
    },
  ];

  const { Title } = Typography;
  const { TreeNode } = TreeSelect;

  useEffect(() => {
    fetchCities();
    fetchYears();
  }, []);

  useEffect(() => {
    if (dataChartShow) {
      chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [onClickRow]);

  const fetchCities = async () => {
    setIsLoadingCities(true);
    try {
      let response = await AnnualReportApi.getCities();
      let cities = response.data as City[];
      setCities(
        cities
          .sort((a: City, b: City) => a.name.localeCompare(b.name))
          .map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
      );
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoadingCities(false);
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
    } catch (error) {
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

    let response = await StatisticsApi.getCitiesStatistics({
      CityIds: info.citiesId,
      Years: info.years,
      Indicators: info.indicators,
    });

    // seting (for chart needs) statisticsItems indicators of the very first element
    // because they are the same for all the elements
    let entryToSetIndicators = response.data.find(
      (entry: CityStatistics) => entry.yearStatistics.length != 0
    );
    if (!entryToSetIndicators) {
      openNotificationWithIcon("error", ReportNotFound);
      setShowDataChart(false);
      setShowTable(false);
      return;
    }

    setArrayOfIndicators(
      entryToSetIndicators.yearStatistics[0].statisticsItems.map(
        (it: any) => it.indicator
      )
    );

    // reading data from response and seting data for table
    let data = response.data
      .map((stanytsya: CityStatistics) => {
        return stanytsya.yearStatistics.map((yearStatistic) => {
          return {
            id: counter++,
            cityName: stanytsya.city.name,
            regionName: stanytsya.city.region.regionName,
            year: yearStatistic.year,
            ...yearStatistic.statisticsItems.map((it) => it.value),
            total: yearStatistic.statisticsItems.reduce(
              (sum, item) => sum + item.value,
              0
            ),
          };
        });
      })
      .flat();

    setShowTable(true);
    setDataForTable(data);
    setOnClickRow(null);

    // reading statisticsItems indicators of the very first element
    // because they are the same for all the elements
    let statistics =
      entryToSetIndicators.yearStatistics[0].statisticsItems || [];

    // creating and seting columns for table
    let temp = [
      ...constColumns,
      ...statistics.map((statisticsItem: any, index: any) => {
        return {
          title: indicatorsArray[statisticsItem.indicator as number].label,
          dataIndex: index,
          key: index,
          width: 130,
        };
      }),
      totalColumn,
    ];
    setColumns(temp);
  };

  // calculating for chart percentage
  let sumOfIndicators: number = dataChart.length
    ? dataChart.reduce(
        (sum: number, indicator: any) => sum + indicator.count,
        0
      )
    : 0;

  if (dataFromRow != undefined) {
    const regex = /[0-9]/g;

    // seting data for chart
    const allDataForChart = [
      ...Object.entries(dataFromRow as Object).map(([key, value]) => {
        if (key.match(regex) !== null) {
          return {
            item: indicatorsArray[arrayOfInindicators[Number(key)]].label,
            count: value,
            percent: value,
          };
        }
      }),
    ];
    let indicatorsForChart = allDataForChart.slice(0, -5);
    setTitle(dataFromRow);
    setDataChart(indicatorsForChart);
    setDataFromRow(undefined);
  }

  const onIndicatorSelection = (value: Array<Number>) => {
    // enables or disables dropdown options for Показники
    // based on selected values

    setSelectableUnatstvaPart(!value.includes(2));
    setSelectableUnatstvaZahalom(
      !value.some((v) => [3, 4, 5, 6, 7].includes(v.valueOf()))
    );
    setSelectableSeniorPart(!value.includes(8));
    setSelectableSeniorZahalom(
      !value.some((v) => [9, 10].includes(v.valueOf()))
    );
    setSelectableSeigneurPart(!value.includes(11));
    setSelectableSeigneurZahalom(
      !value.some((v) => [12, 13].includes(v.valueOf()))
    );
  };

  const onFormClear = () => {
    form.resetFields();
    setShowDataChart(false);
    setShowTable(false);
    setSelectableSeigneurPart(true);
    setSelectableSeigneurZahalom(true);
    setSelectableSeniorPart(true);
    setSelectableSeniorZahalom(true);
    setSelectableUnatstvaPart(true);
    setSelectableUnatstvaZahalom(true);
  };

  return (
    <Layout.Content>
      <div className="background">
        <Title level={2}>Статистика станиць</Title>
        <div className="formAndChart">
          <div className="form">
            <Form form={form} onFinish={onSubmit}>
              <Row
                style={{
                  float: "right",
                  marginRight: "20px",
                  marginTop: "-50px",
                }}
              >
                <AntTooltip title="Очистити">
                  <ClearOutlined
                    onClick={onFormClear}
                    style={{
                      fontSize: "x-large",
                      cursor: "pointer",
                    }}
                  />
                </AntTooltip>
              </Row>
              <Row justify="center">
                <Col span={20}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Станиці"
                    name="citiesId"
                    rules={[
                      {
                        required: true,
                        message: shouldContain("хоча б одну станицю"),
                        type: "array",
                      },
                    ]}
                  >
                    <Select
                      maxTagCount={4}
                      showSearch
                      allowClear
                      mode="multiple"
                      options={cities}
                      placeholder={
                        <span>
                          Обрати станицю{" "}
                          {isLoadingCities && <LoadingOutlined />}
                        </span>
                      }
                      filterOption={(input, option) =>
                        (option?.label as string)
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={20}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Роки"
                    name="years"
                    rules={[
                      {
                        required: true,
                        message: shouldContain("хоча б один рік"),
                        type: "array",
                      },
                    ]}
                  >
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
                <Col span={20}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Показники"
                    name="indicators"
                    rules={[
                      {
                        required: true,
                        message: shouldContain("хоча б один показник"),
                        type: "array",
                      },
                    ]}
                  >
                    <TreeSelect
                      maxTagCount={4}
                      showSearch
                      allowClear
                      multiple
                      onChange={onIndicatorSelection}
                      treeDefaultExpandAll
                      placeholder="Обрати показник"
                      filterTreeNode={(input, option) =>
                        (option?.title as string)
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <TreeNode value={0} title="Пташата" />
                      <TreeNode value={1} title="Новацтво" />
                      <TreeNode
                        value={2}
                        title="Юнацтво загалом"
                        disabled={!selectableUnatstvaZahalom}
                      >
                        <TreeNode
                          value={3}
                          title="Неіменовані"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={4}
                          title="Прихильники"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={5}
                          title="Учасники"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={6}
                          title="Розвідувачі"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={7}
                          title="Скоби/вірлиці"
                          disabled={!selectableUnatstvaPart}
                        />
                      </TreeNode>
                      <TreeNode
                        value={8}
                        title="Старші пластуни загалом"
                        disabled={!selectableSeniorZahalom}
                      >
                        <TreeNode
                          value={9}
                          title="Старші пластуни прихильники"
                          disabled={!selectableSeniorPart}
                        />
                        <TreeNode
                          value={10}
                          title="Старші пластуни учасники"
                          disabled={!selectableSeniorPart}
                        />
                      </TreeNode>
                      <TreeNode
                        value={11}
                        title="Сеньйори загалом"
                        disabled={!selectableSeigneurZahalom}
                      >
                        <TreeNode
                          value={12}
                          title="Сеньйори пластуни прихильники"
                          disabled={!selectableSeigneurPart}
                        />
                        <TreeNode
                          value={13}
                          title="Сеньйори пластуни учасники"
                          disabled={!selectableSeigneurPart}
                        />
                      </TreeNode>
                    </TreeSelect>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <Col>
                  <Button type="primary" htmlType="submit">
                    Сформувати
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <br />
          {sumOfIndicators === 0 ||
          !dataChartShow ||
          title === undefined ||
          onClickRow === null ? (
            ""
          ) : (
            <div className="chart" ref={chartRef}>
              <h1>
                {title.cityName}, {title.year}
              </h1>
              <Row
                style={{
                  float: "right",
                  marginRight: "20px",
                  marginTop: "-25px",
                }}
              >
                <AntTooltip title="Сховати">
                  <CloseOutlined
                    onClick={() => setOnClickRow(null)}
                    style={{
                      fontSize: "large",
                      cursor: "pointer",
                    }}
                  />
                </AntTooltip>
              </Row>
              <Chart height={400} data={dataChart} justify="center" autoFit>
                <Coordinate type="theta" radius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                  position="percent"
                  adjust="stack"
                  color="item"
                  style={{
                    lineWidth: 1,
                    stroke: "#fff",
                  }}
                  label={[
                    "count",
                    {
                      content: (data) => {
                        return `${data.item}: ${(
                          (data.percent / sumOfIndicators) *
                          100
                        ).toFixed(2)}%`;
                      },
                    },
                  ]}
                />
                <Interaction type="element-single-selected" />
              </Chart>
            </div>
          )}
        </div>
        <br />
        {!showTable ? (
          ""
        ) : (
          <Form>
            <Form.Item>
              <Row id="rowIcon" gutter={[5, 0]}>
                <Col>
                  <AntTooltip
                    title="Для того, щоб сформувати діаграму даних станиці клацніть один раз на рядок в таблиці тієї станиці. 
                                    Діаграму не можливо сформувати, якщо немає даних!"
                  >
                    <InfoCircleOutlined />
                  </AntTooltip>
                </Col>
                <Col>
                  <label id="label">Як сформувати діаграму?</label>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Table
                bordered
                rowClassName={(record, index) =>
                  index === onClickRow ? "onClickRow" : ""
                }
                rowKey="id"
                columns={columns}
                dataSource={dataForTable}
                scroll={{ x: "100%", scrollToFirstRowOnChange: true }}
                onRow={(cityRecord, index) => {
                  return {
                    onClick: () => {
                      setShowDataChart(true);
                      setDataFromRow(cityRecord);
                      setOnClickRow(index);
                    },
                  };
                }}
                pagination={{
                  showLessItems: true,
                  responsive: true,
                  showSizeChanger: true,
                }}
              />
            </Form.Item>
          </Form>
        )}
      </div>
    </Layout.Content>
  );
};
export default StatisticsCities;
