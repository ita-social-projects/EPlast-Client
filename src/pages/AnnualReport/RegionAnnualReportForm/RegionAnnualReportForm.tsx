import React, { useEffect, useState } from 'react';
import classes from '../AnnualReportTable/Form.module.css'
import { Typography, Form, Col, Input, Button, Row, Table } from 'antd';
import Props from './RegionAnnualReportFormProps';
import './RegionAnnualReportForm.less';
import { emptyInput, maxLength } from "../../../components/Notifications/Messages"
import StatisticsApi from '../../../api/StatisticsApi';
import RegionStatistics from '../../Statistics/Interfaces/RegionStatistics';
import StatisticsItemIndicator from '../../Statistics/Interfaces/StatisticsItemIndicator';
import DataFromResponse from '../../Statistics/Interfaces/DataFromResponse';
import { SortOrder } from 'antd/es/table/interface';

const { Title, Text } = Typography;
const { TextArea } = Input;

const RegionAnnualReportForm = (props: Props) => {
    const { title, regionId, year } = props;
    const [columns, setColumns] = useState(Array());
    const [result, setResult] = useState<DataFromResponse[]>(Array());

    const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());

    const indicatorsArray = [
        { value: StatisticsItemIndicator.NumberOfPtashata, label: "Кількість пташат" },
        { value: StatisticsItemIndicator.NumberOfNovatstva, label: "Кількість новацтва" },
        { value: StatisticsItemIndicator.NumberOfUnatstvaNoname, label: "Кількість неіменованих" },
        { value: StatisticsItemIndicator.NumberOfUnatstvaSupporters, label: "Кількість прихильників" },
        { value: StatisticsItemIndicator.NumberOfUnatstvaMembers, label: "Кількість учасників" },
        { value: StatisticsItemIndicator.NumberOfUnatstvaProspectors, label: "Кількість розвідувачів" },
        { value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts, label: "Кількість скобів/вірлиць" },
        { value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters, label: "Кількість старших пластунів прихильників" },
        { value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers, label: "Кількість старших пластунів учасників" },
        { value: StatisticsItemIndicator.NumberOfSeigneurSupporters, label: "Кількість сеньйорів пластунів прихильників" },
        { value: StatisticsItemIndicator.NumberOfSeigneurMembers, label: "Кількість сеньйорів пластунів учасників" }
      ];

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
          title: "Округа",
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

      useEffect(()=>{
        //fetchStatisticsMembers([regionId], [year], indicatorsArray.map(item=>{return item.value}))
      },[])

    const fetchStatisticsMembers = async (regionIds: number[], years: number[], indicators: StatisticsItemIndicator[]) => {
        let counter = 1;
    
        let response = await StatisticsApi.getRegionsStatistics({
          RegionIds: regionIds,
          Years: years,
          Indicators: indicators
        });
    
        // seting (for chart needs) statisticsItems indicators of the very first element 
        // because they are the same for all the elements
        setArrayOfIndicators(response.data[0].yearStatistics[0].statisticsItems.map((it: any)=> it.indicator));
        
        // reading data from response and seting data for table
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
    
        setResult(data);
    
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


    return (
        <>
            <Title>{title}</Title>
            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <Form.Item label="Загальна характеристика діяльності осередків в області" labelCol={{ span: 24 }} name="Characteristic" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Стан підготовки/реалізації стратегії округи, осередків округи" labelCol={{ span: 24 }} name="StateOfPreparation" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Чи виконується стратегія у Вашій окрузі? Що допоможе її реалізувати?" labelCol={{ span: 24 }} name="StatusOfStrategy" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Стан роботи із залученням волонтерів" labelCol={{ span: 24 }} name="InvolvementOfVolunteers" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Які вишколи потрібні членам вашої округи? та  Які вишколи із вказаних ви можете провести самостійно?" labelCol={{ span: 24 }} name="TrainedNeeds" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Чи отримають станиці державне фінансування або іншу підтримку від влади? Якщо так, то яку?" labelCol={{ span: 24 }} name="PublicFunding" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Чи співпрацюєте ви із церквою (вкажіть як саме, тип співпраці з церквою)" labelCol={{ span: 24 }} name="ChurchCooperation" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Чи займаються станиці фандрейзингом? Якщо так, то хто і в якому форматі?" labelCol={{ span: 24 }} name="Fundraising" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Участь (організація) у соціальних проектах" labelCol={{ span: 24 }} name="SocialProjects" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Проблемні ситуації, виклики, які мають негативний вплив на організацію на місцевому та національному рівні" labelCol={{ span: 24 }} name="ProblemSituations" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Row
                gutter={16}
                align='bottom'>
                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Вкажіть важливі потреби для розвитку округи та осередків" labelCol={{ span: 24 }} name="ImportantNeeds" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                    < Form.Item label="Розкажіть про ваші історії успіху, за цей період" labelCol={{ span: 24 }} name="SuccessStories" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
                        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item></Col>
            </Row>

            <Form.Item style={{ textAlign: "right" }}>
            {/* <Table
              bordered
              rowKey="id"
              columns={columns}
              dataSource={result}
              scroll={{ x: 1000 }}
              pagination={{
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
              }}
            /> */}
            </Form.Item>
        </>
    );
}

export default RegionAnnualReportForm;