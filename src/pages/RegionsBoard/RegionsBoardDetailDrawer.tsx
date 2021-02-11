import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "../Regions/RegionDetailDrawer.less";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  region: any;
}

const RegionDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі Крайового проводу ${props.region.regionname?.length > 0 ? props.region.regionname : ""}`}
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
