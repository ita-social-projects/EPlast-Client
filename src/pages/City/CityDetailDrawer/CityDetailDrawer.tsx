import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "./CityDetailDrawer.less";
import CityProfile from "./../../../models/City/CityProfile";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  city: CityProfile;
}

const CityDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі станиці ${
        props.city.name?.length > 0 ? props.city.name : ""
      }`}
      onClose={() => props.setVisibleDrawer(false)}
      visible={props.visibleDrawer}
      footer={null}
      forceRender={true}
      width=""
      className="cityDetail"
    >
      <Form className="detailsForm">
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="cityURL"
              label="Посилання"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.cityURL
              }
            >
              <a href={props.city.cityURL} target="_blank">
                <Input
                   placeholder="Не вказано"
                  disabled
                />
              </a>
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="phoneNumber"
              label="Номер телефону"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.phoneNumber
              }
            >
              <Input
               placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="email"
              label="Електронна пошта"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.email
              }
            >
              <Input
                placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="address"
              label="Адреса"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.address
              }
            >
              <Input
                 placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="region"
              label="Округа"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.region
              }
            >
              <Input
                placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="level"
              label="Рівень"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.level
              }
            >
              <Input
                 placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              name="description"
              label="Опис"
              labelCol={{ span: 24 }}
              initialValue={
                props.city.description
              }
            >
              <TextArea
                autoSize={{
                  minRows: 4,
                  maxRows: 9,
                }}
                placeholder="Не вказано"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CityDetailDrawer;
