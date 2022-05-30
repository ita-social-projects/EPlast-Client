import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
  Col,
  TreeSelect,
  Typography,
  Tooltip as AntTooltip,
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";
import RegionsApi from "../../api/regionsApi";
import Region from "./Interfaces/Region";
import RegionStatistics from "./Interfaces/RegionStatistics";
import {
  ReportNotFound,
  shouldContain,
} from "../../components/Notifications/Messages";
import "./StatisticsRegions.less";
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction,
} from "bizcharts";
import {
  ClearOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import openNotificationWithIcon from "../../components/Notifications/Notification";

const StatisticsCities = () => {
  const [form] = Form.useForm();
  const [years, setYears] = useState<any>();
  const [result, setResult] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [regions, setRegions] = useState<any>();
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
  const [isLoadingRegions, setIsLoadingRegions] = useState<boolean>(false);

  const chartRef = useRef<HTMLDivElement>(null); // using this for scrolling

  const constColumns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.id - b.id },
      width: 55,
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 100,
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
      width: 100,
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
    {
      value: StatisticsItemIndicator.NumberOfPtashata,
      label: "Кількість пташат",
    },
    {
      value: StatisticsItemIndicator.NumberOfNovatstva,
      label: "Кількість новацтва",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstva,
      label: "Кількість юнацтва загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaNoname,
      label: "Кількість неіменованих",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaSupporters,
      label: "Кількість прихильників",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaMembers,
      label: "Кількість учасників",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaProspectors,
      label: "Кількість розвідувачів",
    },
    {
      value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts,
      label: "Кількість скобів/вірлиць",
    },
    {
      value: StatisticsItemIndicator.NumberOfSenior,
      label: "Кількість старших пластунів загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters,
      label: "Кількість старших пластунів прихильників",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers,
      label: "Кількість старших пластунів учасників",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneur,
      label: "Кількість сеньйорів загалом",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneurSupporters,
      label: "Кількість сеньйорів пластунів прихильників",
    },
    {
      value: StatisticsItemIndicator.NumberOfSeigneurMembers,
      label: "Кількість сеньйорів пластунів учасників",
    },
  ];

  const { TreeNode } = TreeSelect;
  const { Title } = Typography;

  useEffect(() => {
    fetchRegions();
    fechYears();
  }, []);

  useEffect(() => {
    if (dataChartShow) {
      chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [onClickRow]);

  const fetchRegions = async () => {
    setIsLoadingRegions(true);
    try {
      let response = await RegionsApi.getRegions();
      let regions = response.data as Region[];
      setRegions(
        regions
          .sort((a: Region, b: Region) =>
            a.regionName.localeCompare(b.regionName)
          )
          .map((item) => {
            return {
              label: item.regionName,
              value: item.id,
            };
          })
      );
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const fechYears = async () => {
    try {
      const arrayOfYears = [];
      var endDate = Number(new Date().getFullYear());
      for (let i = 2000; i <= endDate; i++) {
        arrayOfYears.push({ lable: i.toString(), value: i });
      }
      setYears(arrayOfYears.reverse());
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

    let response = await StatisticsApi.getRegionsStatistics({
      RegionIds: info.regionIds,
      Years: info.years,
      Indicators: info.indicators,
    });

    // seting (for chart needs) statisticsItems indicators of the very first element
    // because they are the same for all the elements
    let entryToSetIndicators = response.data.find(
      (entry: RegionStatistics) => entry.yearStatistics.length != 0
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
      .map((region: RegionStatistics) => {
        return region.yearStatistics.map((yearStatistic) => {
          return {
            id: counter++,
            regionName: region.region.regionName,
            year: yearStatistic.year,
            ...yearStatistic.statisticsItems.map((it) => it.value),
            total: yearStatistic.statisticsItems.reduce(
              (sum, a) => sum + a.value,
              0
            ),
          };
        });
      })
      .flat();

    // reading statisticsItems' indicators of the very first element
    // because they are the same for all the items
    let statistics =
      entryToSetIndicators.yearStatistics[0].statisticsItems || [];

    setShowTable(true);
    setResult(data);
    setOnClickRow(null);

    // creating and seting columns for table
    let columnData = [
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

    setColumns(columnData);
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
    let indicatorsForChart = allDataForChart.slice(0, -4);
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
        <Title level={2}>Статистика округ</Title>
        <div className="formGlobal">
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
                    label="Округи"
                    name="regionIds"
                    rules={[
                      {
                        required: true,
                        message: shouldContain("хоча б одну округу"),
                        type: "array",
                      },
                    ]}
                  >
                    <Select
                      maxTagCount={4}
                      showSearch
                      allowClear
                      mode="multiple"
                      options={regions}
                      placeholder={
                        <span>
                          Обрати округу{" "}
                          {isLoadingRegions && <LoadingOutlined />}
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
                      <TreeNode value={0} title="Кількість пташат" />
                      <TreeNode value={1} title="Кількість новацтва" />
                      <TreeNode
                        value={2}
                        title="Кількість юнацтва загалом"
                        disabled={!selectableUnatstvaZahalom}
                      >
                        <TreeNode
                          value={3}
                          title="Кількість неіменованих"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={4}
                          title="Кількість прихильників"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={5}
                          title="Кількість учасників"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={6}
                          title="Кількість розвідувачів"
                          disabled={!selectableUnatstvaPart}
                        />
                        <TreeNode
                          value={7}
                          title="Кількість скобів/вірлиць"
                          disabled={!selectableUnatstvaPart}
                        />
                      </TreeNode>
                      <TreeNode
                        value={8}
                        title="Кількість старших пластунів загалом"
                        disabled={!selectableSeniorZahalom}
                      >
                        <TreeNode
                          value={9}
                          title="Кількість старших пластунів прихильників"
                          disabled={!selectableSeniorPart}
                        />
                        <TreeNode
                          value={10}
                          title="Кількість старших пластунів учасників"
                          disabled={!selectableSeniorPart}
                        />
                      </TreeNode>
                      <TreeNode
                        value={11}
                        title="Кількість сеньйорів загалом"
                        disabled={!selectableSeigneurZahalom}
                      >
                        <TreeNode
                          value={12}
                          title="Кількість сеньйорів пластунів прихильників"
                          disabled={!selectableSeigneurPart}
                        />
                        <TreeNode
                          value={13}
                          title="Кількість сеньйорів пластунів учасників"
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
                {title.regionName}, {title.year}
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
                          (parseInt(data.percent) / sumOfIndicators) *
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
        {showTable === false ? (
          ""
        ) : (
          <Form>
            <Form.Item>
              <Row id="rowIcon" gutter={[5, 0]}>
                <Col>
                  <AntTooltip
                    title="Для того, щоб сформувати діаграму даних округи клацніть один раз на рядок в таблиці тієї округи. 
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
                dataSource={result}
                scroll={{ x: "100%", scrollToFirstRowOnChange: true }}
                onRow={(regionRecord, index) => {
                  return {
                    onClick: async () => {
                      setShowDataChart(true);
                      setDataFromRow(regionRecord);
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
