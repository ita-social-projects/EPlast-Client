import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "./RegionDetailDrawer.less";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  region: any;
}

const RegionDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі округу ${props.region.regionname?.length > 0 ? props.region.regionname : ""}`}
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
                props.region.link?.length > 0 ? props.region.link : "---"
              }
            >
              <a href={props.region.link} target="_blank">
                <Input
                  value={
                    props.region.link?.length > 0 ? props.region.link : "---"
                  }
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
                props.region.phoneNumber?.length > 0
                  ? props.region.phoneNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.region.phoneNumber?.length > 0
                    ? props.region.phoneNumber
                    : "---"
                }
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
                props.region.email?.length > 0 ? props.region.email : "---"
              }
            >
              <Input
                value={props.region.email?.length > 0 ? props.region.email : "---"}
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="City"
              label="Місто"
              labelCol={{ span: 24 }}
              initialValue={
                props.region.city?.length > 0 ? props.region.city : "---"
              }
            >
              <Input
                value={props.region.city?.length > 0 ? props.region.city : "---"}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="street"
              label="Вулиця"
              labelCol={{ span: 24 }}
              initialValue={
                props.region.street?.length > 0 ? props.region.street : "---"
              }
            >
              <Input
                value={
                  props.region.street?.length > 0 ? props.region.street : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="houseNumber"
              label="Номер будинку"
              labelCol={{ span: 24 }}
              initialValue={
                props.region.houseNumber?.length > 0
                  ? props.region.houseNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.region.houseNumber?.length > 0
                    ? props.region.houseNumber
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="officeNumber"
              label="Номер офісу/квартири"
              labelCol={{ span: 24 }}
              initialValue={
                props.region.officeNumber?.length > 0
                  ? props.region.officeNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.region.officeNumber?.length > 0
                    ? props.region.officeNumber
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="postIndex"
              label="Поштовий індекс"
              labelCol={{ span: 24 }}
              initialValue={
                props.region.postIndex > 0 ? props.region.postIndex : "---"
              }
            >
              <Input
                value={
                  props.region.postIndex?.length > 0
                    ? props.region.postIndex
                    : "---"
                }
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
                props.region.description?.length > 0
                  ? props.region.description
                  : "---"
              }
            >
              <TextArea
                autoSize
                value={
                  props.region.description?.length > 0
                    ? props.region.description
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default RegionDetailDrawer;
