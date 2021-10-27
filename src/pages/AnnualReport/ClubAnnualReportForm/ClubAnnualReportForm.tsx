import React from "react";
import { Form, Row, Col, Typography, Input, Table, Card } from "antd";
import moment from "moment";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";
import {
    administrationsColumns,
    followersColumns,
    getTableAdmins,
    getTableMembers,
} from "./ClubAnnualReportTableColumns";
import {
    emptyInput,
    maxLength,
} from "../../../components/Notifications/Messages";
import "./ClubAnnualReportForm.less";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
    club: {
        id: 0;
        name: "";
        phoneNumber: "";
        email: "";
        clubURL: "";
        slogan: "";
    };
    admins: ClubAdmin[];
    members: ClubMember[];
    followers: ClubMember[];
    head: ClubAdmin;
    countUsersPerYear: number;
    countdeletedUsersPerYear: number;
}

export const ClubAnnualReportForm = (props: Props) => {
    const {
        club,
        admins,
        members,
        followers,
        head,
        countUsersPerYear,
        countdeletedUsersPerYear,
    } = props;
    const validationSchema = {
        number: [
            { required: true, message: emptyInput() },
            {
                validator: (_: object, value: string) =>
                    String(value).length <= 7
                        ? Promise.resolve()
                        : Promise.reject(maxLength(7)),
            },
        ],
        textareaClubCenters: [
            { required: true, message: emptyInput() },
            { max: 200, message: maxLength(200) },
        ],
        textareaKbUSPWishes: [
            { required: true, message: emptyInput() },
            { max: 500, message: maxLength(500) },
        ],
    };

    const maxAmountSymbolsURL = 40;

    return (
        <>
            <Card>
                <Title level={4}>
                    Дані про членів куреня
                </Title>
                <Card.Grid className="container">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                            className="clubAnnualReportResponsiveCols"
                            xs={24}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={6}
                            span={6}
                        >
                            <Text strong={true}>
                                Дійсних членів куреня:
                            </Text>
                            <Form.Item
                                className="w100"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    value={members.length}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={6}
                            className="clubAnnualReportResponsiveCols"
                            span={6}
                        >
                            <Text strong={true}>
                                Прихильників куреня:
                            </Text>
                            <Form.Item
                                className="w100"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    value={followers.length}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={6}
                            className="clubAnnualReportResponsiveCols"
                            span={6}
                        >
                            <Text strong={true}>
                                До куреня приєдналось за звітній період:
                            </Text>
                            <Form.Item
                                className="w100"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    value={countUsersPerYear}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={6}
                            className="clubAnnualReportResponsiveCols"
                            span={6}
                        >
                            <Text strong={true}>
                                Вибули з куреня за звітній період:
                            </Text>
                            <Form.Item
                                className="w100"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    value={countdeletedUsersPerYear}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                            className="clubAnnualReportResponsiveCols"
                            span={12}
                        >
                            <Text strong={true}>
                                Географія куреня. Осередки в Україні:
                            </Text>
                            <Form.Item
                                className="w100"
                                name="clubCenters"
                                rules={validationSchema.textareaClubCenters}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col
                            className="clubAnnualReportResponsiveCols"
                            span={12}
                        >
                            <Text strong={true}>
                                Вкажіть побажання до КБ УСП:
                            </Text>
                            <Form.Item
                                className="w100"
                                name="kbUSPWishes"
                                rules={validationSchema.textareaKbUSPWishes}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card.Grid>
                <Card.Grid className="container">
                    <Title level={4}>
                        Провід куреня
                    </Title>
                    <Table
                        dataSource={getTableAdmins(admins)}
                        columns={administrationsColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                        scroll={{ x: true }}
                        onRow={(user) => {
                            return {
                                onDoubleClick: (event) => {
                                    if (user.key) {
                                        window.open(`/userpage/main/${user.key}`);
                                    }
                                },
                            };
                        }}
                    />
                </Card.Grid>
                <Card.Grid className="container">
                    <Title level={4}>
                        Члени куреня
                    </Title>
                    <Table
                        dataSource={getTableMembers(members)}
                        columns={followersColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                        scroll={{ x: true }}
                        onRow={(user) => {
                            return {
                                onDoubleClick: (event) => {
                                    if (user.key) {
                                        window.open(`/userpage/main/${user.key}`);
                                    }
                                },
                            };
                        }}
                    />
                </Card.Grid>
                <Card.Grid className="container">
                    <Title level={4}>
                        Прихильники куреня
                    </Title>
                    <Table
                        dataSource={getTableMembers(followers)}
                        columns={followersColumns}
                        pagination={{ defaultPageSize: 4 }}
                        className="table"
                        scroll={{ x: true }}
                        onRow={(user) => {
                            return {
                                onDoubleClick: (event) => {
                                    if (user.key) {
                                        window.open(`/userpage/main/${user.key}`);
                                    }
                                },
                            };
                        }}
                    />
                </Card.Grid>
                <Card.Grid className="clubAnnualReportFormDescription">
                    <Row gutter={20}>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            {head ? (
                                <>
                                    <Form.Item
                                        label={
                                            <Text strong={true}>
                                                {head.adminType?.adminTypeName}
                                            </Text>
                                        }
                                    >
                                        {head.user?.firstName}{" "}{head.user?.lastName}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Text strong={true}>
                                                Номер телефону
                                            </Text>
                                        }
                                    >
                                        {head.user?.phoneNumber.replace(" ", "") === "" ? "немає" : head.user?.phoneNumber}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Text strong={true}>
                                                Електронна пошта
                                            </Text>
                                        }
                                    >
                                        {head.user?.email.replace(" ", "") === "" ? "немає" : head.user?.email}
                                    </Form.Item>
                                </>
                            ) : (
                                <> Ще немає адміністратора куреня</>
                            )}
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                        >
                            <Form.Item
                                label={
                                    <Text strong={true}>
                                        Сайт/сторінка в інтернеті
                                    </Text>
                                }
                            >
                                {club.clubURL?.replace(" ", "") == "" ? (
                                    "немає"
                                ) : (
                                    <a target="_blank" href={club.clubURL}>
                                        {club.clubURL.length > maxAmountSymbolsURL ? (club.clubURL.substring(0, maxAmountSymbolsURL) + "...") : club.clubURL}
                                    </a>
                                )}
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Text strong={true}>Номер телефону</Text>
                                }
                            >
                                {club.phoneNumber?.replace(" ", "") === "" ? "немає" : club.phoneNumber}
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Text strong={true}>Електронна пошта</Text>
                                }
                            >
                                {club.email.replace(" ", "") === "" ? "немає" : club.email}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="ClubAnnualReportFormDescriptionDate">
                        <Col>
                            <Form.Item
                                label={
                                    <Text strong={true}>
                                        Дата заповнення
                                    </Text>
                                }
                            >
                                {moment().format("DD.MM.YYYY")}
                            </Form.Item>
                        </Col>
                    </Row>
                </Card.Grid>
            </Card>
        </>
    );
};

export default ClubAnnualReportForm;
