import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "../City/CityDetailDrawer/CityDetailDrawer.less";
import GoverningBodyProfile from "../../models/GoverningBody/GoverningBodyProfile";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  governingBody: GoverningBodyProfile;
}

const GoverningBodyDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі керівного органу ${props.governingBody.governingBodyName?.length > 0 ? props.governingBody.governingBodyName : ""}`}
      onClose={() => props.setVisibleDrawer(false)}
      visible={props.visibleDrawer}
      footer={null}
      forceRender={true}
      width=""
      className="cityDetail"
    >
      <Form className="detailsForm">
        <Row justify="center" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              name="phoneNumber"
              label="Номер телефону"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.phoneNumber?.length > 0
                  ? props.governingBody.phoneNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.governingBody.phoneNumber?.length > 0
                    ? props.governingBody.phoneNumber
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
              name="email"
              label="Електронна пошта"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.email?.length > 0 ? props.governingBody.email : "---"
              }
            >
              <Input
                value={props.governingBody.email?.length > 0 ? props.governingBody.email : "---"}
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
                props.governingBody.description?.length > 0
                  ? props.governingBody.description
                  : "---"
              }
            >
              <TextArea
                autoSize =
                {
                  {
                    minRows: 1,
                    maxRows: 9
                  }
                }
                value={
                  props.governingBody.description?.length > 0
                    ? props.governingBody.description
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

export default GoverningBodyDetailDrawer;
