import React from "react";
import { Drawer, Col, Row, Form, Input } from "antd";
import "../../City/CityDetailDrawer/CityDetailDrawer.less";
import TextArea from "antd/lib/input/TextArea";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  sector: SectorProfile;
}

const SectorDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі напряму керівного органу ${props.sector.name?.length > 0 ? props.sector.name : ""}`}
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
                props.sector.phoneNumber?.length > 0
                  ? props.sector.phoneNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.sector.phoneNumber?.length > 0
                    ? props.sector.phoneNumber
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
                props.sector.email?.length > 0 ? props.sector.email : "---"
              }
            >
              <Input
                value={props.sector.email?.length > 0 ? props.sector.email : "---"}
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
                props.sector.description?.length > 0
                  ? props.sector.description
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
                  props.sector.description?.length > 0
                    ? props.sector.description
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

export default SectorDetailDrawer;
