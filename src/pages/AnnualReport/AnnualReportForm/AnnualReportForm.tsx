import React from "react";
import { Typography, Form, Row, Col, Input, Select } from "antd";
import Props from "./AnnualReportFormProps";
import "./AnnualReportForm.less";
import {
    emptyInput,
    maxLength,
    shouldContain,
} from "../../../components/Notifications/Messages";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AnnualReportForm = (props: Props) => {
    const { title, cityMembers, cityLegalStatuses, formHook } = props;

    const numberMaxAmountDigit = 6
    const moneyMaxAmountDigit = 11

    const validationSchema = {
        cityLegalStatus: [{ required: true, message: emptyInput() }],
        number: [
            { required: true, message: emptyInput() },
            { pattern: /^\d+$/, message: shouldContain("додатні цілі числа") },
            {
                validator: (_: object, value: string) =>
                    String(value).length <= 5
                        ? Promise.resolve()
                        : Promise.reject(maxLength(5)),
            },
        ],
        textarea: [{ max: 2000, message: maxLength(2000) }],
        money: [
            { required: true, message: emptyInput() },
            { pattern: /^\d+$/, message: shouldContain("додатні цілі числа") },
            {
                validator: (_: object, value: string) =>
                    String(value).length <= 10
                        ? Promise.resolve()
                        : Promise.reject(maxLength(10)),
            },
        ],
    };

    const getOnlyNums = (text: string) => {
        return text.replace(/\D/g, "");
    };

    return (
        <>
            <Title>{title}</Title>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={12} md={12} lg={12} className="container">
                    <Text strong={true}>
                        Голова новообраної Старшини
                    </Text>
                    <Form.Item name="newCityAdminId" className="w100">
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label as string)
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            options={cityMembers}
                        ></Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} className="container">
                    <Text strong={true}>
                        Правовий статус осередку
                    </Text>
                    <Form.Item
                        className="w100"
                        name="newCityLegalStatusType"
                        rules={validationSchema.cityLegalStatus}
                    >
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label as string)
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            options={cityLegalStatuses}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>
                        УПП
                    </Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість гніздечок пташат</Text>
                            <Form.Item
                                className="w100"
                                name="numberOfSeatsPtashat"
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            numberOfSeatsPtashat: getOnlyNums(e.target.value),
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість пташат</Text>
                            <Form.Item
                                className="w100"
                                name={["membersStatistic", "numberOfPtashata"]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfPtashata: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>
                        УПН
                    </Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість самостійних роїв</Text>
                            <Form.Item
                                className="w100"
                                name="numberOfIndependentRiy"
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            numberOfIndependentRiy: getOnlyNums(e.target.value),
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість новацтва</Text>
                            <Form.Item
                                className="w100"
                                name={["membersStatistic", "numberOfNovatstva"]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfNovatstva: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="container">
                <Text strong={true}>
                    УПЮ
                </Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість куренів у станиці/паланці (окрузі/регіоні)</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfClubs"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfClubs: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість самостійних гуртків</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfIndependentGroups"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfIndependentGroups: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість неіменованих разом</Text>
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaNoname",
                            ]}
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        membersStatistic: {
                                            numberOfUnatstvaNoname: getOnlyNums(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Кількість прихильників/ць</Text>
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaSupporters",
                            ]}
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        membersStatistic: {
                                            numberOfUnatstvaSupporters: getOnlyNums(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість учасників/ць</Text>
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaMembers",
                            ]}
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        membersStatistic: {
                                            numberOfUnatstvaMembers: getOnlyNums(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість розвідувачів</Text>
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaProspectors",
                            ]}
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        membersStatistic: {
                                            numberOfUnatstvaProspectors: getOnlyNums(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість скобів/вірлиць</Text>
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaSkobVirlyts",
                            ]}
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        membersStatistic: {
                                            numberOfUnatstvaSkobVirlyts: getOnlyNums(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>
                        УСП
                    </Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість старших пластунів прихильників</Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeniorPlastynSupporters",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfSeniorPlastynSupporters: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість старших пластунів</Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeniorPlastynMembers",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfSeniorPlastynMembers: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>
                        УПС
                    </Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість сеньйорів пластунів прихильників</Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeigneurSupporters",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfSeigneurSupporters: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість сеньйорів пластунів</Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeigneurMembers",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    maxLength={numberMaxAmountDigit}
                                    onChange={(e) => {
                                        formHook.setFieldsValue({
                                            membersStatistic: {
                                                numberOfSeigneurMembers: getOnlyNums(e.target.value),
                                            },
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="container">
                <Text strong={true}>
                    Адміністрування та виховництво
                </Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість діючих виховників (з усіх членів УСП, УПС)</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfTeachers"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfTeachers: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість адміністраторів (в проводах будь-якого рівня)</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfAdministrators"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfAdministrators: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість тих, хто поєднує виховництво та адміністрування</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfTeacherAdministrators"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfTeacherAdministrators: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>
                    Пластприят
                </Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість пільговиків</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfBeneficiaries"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfBeneficiaries: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість членів Пластприяту</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfPlastpryiatMembers"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfPlastpryiatMembers: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість почесних членів</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfHonoraryMembers"
                            rules={validationSchema.number}
                        >
                            <Input
                                maxLength={numberMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        numberOfHonoraryMembers: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>
                    Залучені кошти
                </Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Державні кошти</Text>
                        <Form.Item
                            className="w100"
                            name="publicFunds"
                            rules={validationSchema.money}
                        >
                            <Input
                                maxLength={moneyMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        publicFunds: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Внески</Text>
                        <Form.Item
                            className="w100"
                            name="contributionFunds"
                            rules={validationSchema.money}
                        >
                            <Input
                                maxLength={moneyMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        contributionFunds: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Пластовий заробіток</Text>
                        <Form.Item
                            className="w100"
                            name="plastSalary"
                            rules={validationSchema.money}
                        >
                            <Input
                                maxLength={moneyMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        plastSalary: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Спонсорські кошти</Text>
                        <Form.Item
                            className="w100"
                            name="sponsorshipFunds"
                            rules={validationSchema.money}
                        >
                            <Input
                                maxLength={moneyMaxAmountDigit}
                                onChange={(e) => {
                                    formHook.setFieldsValue({
                                        sponsorshipFunds: getOnlyNums(e.target.value),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>
                    Майно та потреби станиці
                </Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Text>Вкажіть, що вам допоможе ефективніше залучати волонтерів та створювати виховні частини (гнізда, курені)</Text>
                        <Form.Item
                            className="w100"
                            name="listProperty"
                            rules={validationSchema.textarea}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Text>Вкажіть перелік майна, що є в станиці</Text>
                        <Form.Item
                            className="w100"
                            name="improvementNeeds"
                            rules={validationSchema.textarea}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AnnualReportForm;
