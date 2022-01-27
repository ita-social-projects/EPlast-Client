import React from "react";
import { Typography, Form, Row, Col, Input, Select } from "antd";
import Props from "./AnnualReportFormProps";
import "./AnnualReportForm.less";
import {
    emptyInput,
    maxLength,
    shouldContain,
} from "../../../components/Notifications/Messages";
import { getOnlyNums } from "../../../models/GllobalValidations/DescriptionValidation";

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

    return (
        <>
            <Title>{title}</Title>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={12} md={12} lg={12} className="container">
                    <Form.Item name="newCityAdminId" className="w100" 
                        label="Голова новообраної Старшини"
                            labelCol={{span: 24}}>
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
                    <Form.Item
                        className="w100"
                        name="newCityLegalStatusType"
                        label="Правовий статус осередку"
                        labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name="numberOfSeatsPtashat"
                                label="Кількість гніздечок пташат"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={["membersStatistic", "numberOfPtashata"]}
                                label="Кількість пташат"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name="numberOfIndependentRiy"
                                label="Кількість самостійних роїв"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={["membersStatistic", "numberOfNovatstva"]}
                                label="Кількість новацтва"
                                labelCol={{span: 24}}
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

                        <Form.Item
                            className="w100"
                            name="numberOfClubs"
                            label="Кількість куренів у станиці/паланці (окрузі/регіоні)"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfIndependentGroups"
                            label="Кількість самостійних гуртків"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaNoname",
                            ]}
                            label="Кількість неіменованих разом"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaSupporters",
                            ]}
                            label="Кількість прихильників/ць"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaMembers",
                            ]}
                            label="Кількість учасників/ць"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaProspectors",
                            ]}
                            label="Кількість розвідувачів"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name={[
                                "membersStatistic",
                                "numberOfUnatstvaSkobVirlyts",
                            ]}
                            label="Кількість скобів/вірлиць"
                            labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeniorPlastynSupporters",
                                ]}
                                label="Кількість старших пластунів прихильників"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeniorPlastynMembers",
                                ]}
                                label="Кількість старших пластунів"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeigneurSupporters",
                                ]}
                                label="Кількість сеньйорів пластунів прихильників"
                                labelCol={{span: 24}}
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
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeigneurMembers",
                                ]}
                                label="Кількість сеньйорів пластунів"
                                labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfTeachers"
                            label="Кількість діючих виховників (з усіх членів УСП, УПС)"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfAdministrators"
                            label="Кількість адміністраторів (в проводах будь-якого рівня)"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfTeacherAdministrators"
                            label="Кількість тих, хто поєднує виховництво та адміністрування"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfBeneficiaries"
                            label="Кількість пільговиків"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfPlastpryiatMembers"
                            label="Кількість членів Пластприяту"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="numberOfHonoraryMembers"
                            label="Кількість почесних членів"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="publicFunds"
                            label="Державні кошти"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="contributionFunds"
                            label="Внески"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="plastSalary"
                            label="Пластовий заробіток"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="sponsorshipFunds"
                            label="Спонсорські кошти"
                            labelCol={{span: 24}}
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
                        <Form.Item
                            className="w100"
                            name="listProperty"
                            label="Вкажіть, що вам допоможе ефективніше залучати волонтерів та створювати виховні частини (гнізда, курені)"
                            labelCol={{span: 24}}
                            rules={validationSchema.textarea}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            className="w100"
                            name="improvementNeeds"
                            label="Вкажіть перелік майна, що є в станиці"
                            labelCol={{span: 24}}
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
