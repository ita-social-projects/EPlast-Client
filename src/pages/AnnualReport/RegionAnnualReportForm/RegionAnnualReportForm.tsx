import React from 'react';
import classes from '../AnnualReportTable/Form.module.css'
import { Typography, Form, Col, Input, Row } from 'antd';
import Props from './RegionAnnualReportFormProps';
import './RegionAnnualReportForm.less';
import { emptyInput, maxLength } from "../../../components/Notifications/Messages"
import RegionMembersTable from '../AnnualReportTable/RegionMembersTable/RegionMembersTable';
const { Title } = Typography;
const { TextArea } = Input;

const RegionAnnualReportForm = (props: Props) => {
  const { title, regionId, year } = props;

  return (
    <>
      <Title>{title}</Title>
      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item label="Загальна характеристика діяльності осередків в області" labelCol={{ span: 24 }} name="characteristic" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Стан підготовки/реалізації стратегії округи, осередків округи" labelCol={{ span: 24 }} name="stateOfPreparation" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Чи виконується стратегія у Вашій окрузі? Що допоможе її реалізувати?" labelCol={{ span: 24 }} name="statusOfStrategy" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Стан роботи із залученням волонтерів" labelCol={{ span: 24 }} name="involvementOfVolunteers" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Які вишколи потрібні членам вашої округи? та  Які вишколи із вказаних ви можете провести самостійно?" labelCol={{ span: 24 }} name="trainedNeeds" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Чи отримають станиці державне фінансування або іншу підтримку від влади? Якщо так, то яку?" labelCol={{ span: 24 }} name="publicFunding" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Чи співпрацюєте ви із церквою (вкажіть як саме, тип співпраці з церквою)" labelCol={{ span: 24 }} name="churchCooperation" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Чи займаються станиці фандрейзингом? Якщо так, то хто і в якому форматі?" labelCol={{ span: 24 }} name="fundraising" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Участь (організація) у соціальних проектах" labelCol={{ span: 24 }} name="socialProjects" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Проблемні ситуації, виклики, які мають негативний вплив на організацію на місцевому та національному рівні" labelCol={{ span: 24 }} name="problemSituations" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Row
        gutter={16}
        align='bottom'>
        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Вкажіть важливі потреби для розвитку округи та осередків" labelCol={{ span: 24 }} name="importantNeeds" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>

        <Col xs={24} sm={12} md={12} lg={12}>
          < Form.Item label="Розкажіть про ваші історії успіху, за цей період" labelCol={{ span: 24 }} name="successStories" rules={[{ required: true, message: emptyInput() }, { max: 500, message: maxLength(500) }]} >
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item></Col>
      </Row>

      <Form.Item style={{ textAlign: "right" }}>
        <RegionMembersTable
          regionId={regionId}
          year={year}
        />
      </Form.Item>
    </>
  );
}

export default RegionAnnualReportForm;