import React from "react";
import { Drawer, Col, Row, Form } from "antd";
import { Link } from "react-router-dom";


interface Props {
    history: string[];
    visibleHistoryDrawer: boolean;
    setVisibleHistoryDrawer: (visibleDrawer: boolean) => void;
}

const HistoryDrawer = (props: Props) => {
    const pseudonimLocation: { userId: string, psevdonim: string }[] = sessionStorage.getItem("pseudonimLocation") !== null ? JSON.parse(sessionStorage['pseudonimLocation']) : [];

    return (
        <Drawer
            title={'Історія перегляду сторінок'}
            onClose={() => props.setVisibleHistoryDrawer(false)}
            visible={props.visibleHistoryDrawer}
            footer={null}
            forceRender={true}
            width=""
        >
            <Row gutter={[25, 10]}>
                <Col md={24} xs={24}>
                    <Form.Item
                        label="Посилання"
                        labelCol={{ span: 40 }}
                    >
                    </Form.Item>
                </Col>
            </Row>
            {props.history.map(element => {
                let msg = pseudonimLocation.filter(x => element.includes(x.userId.split("/")[x.userId.split("/").length - 1]) && element.includes(x.userId.split("/")[0]));
                return <Row gutter={[12, 0]}>
                    <Link to={element} className="historyLink" target="">{
                        msg.length === 1 ? element.replace(msg[0].userId.split("/")[msg[0].userId.split("/").length - 1], msg[0].psevdonim.split("/")[msg[0].psevdonim.split("/").length - 1]) : element
                    }
                    </Link>
                </Row>
            })}

        </Drawer >
    );
}

export default HistoryDrawer;