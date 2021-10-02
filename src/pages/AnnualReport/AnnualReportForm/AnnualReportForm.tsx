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
    const { title, cityMembers, cityLegalStatuses } = props;

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

    const allowOnlyThisKeysToBePressed = (e: any) => {
        if (
            e.keyCode !== 8 && //  backspace
            e.keyCode !== 46 && // delete
            e.keyCode !== 37 && // arrowLeft
            e.keyCode !== 38 && // arrowUp
            e.keyCode !== 39 && // arrowRight
            e.keyCode !== 40 && // arrowDown
            e.keyCode !== 188 && // comma
            e.keyCode !== 190 && // period
            e.keyCode !== 110 && // numpadDecimal
            e.keyCode !== 48 && // 0
            e.keyCode !== 49 && // 1
            e.keyCode !== 50 && // 2
            e.keyCode !== 51 && // 3
            e.keyCode !== 52 && // 4
            e.keyCode !== 53 && // 5
            e.keyCode !== 54 && // 6
            e.keyCode !== 55 && // 7
            e.keyCode !== 56 && // 8
            e.keyCode !== 57 && // 9
            e.keyCode !== 96 && // numpad 0
            e.keyCode !== 97 && // numpad 1
            e.keyCode !== 98 && // numpad 2
            e.keyCode !== 99 && // numpad 3
            e.keyCode !== 100 && // numpad 4
            e.keyCode !== 101 && // numpad 5
            e.keyCode !== 102 && // numpad 6
            e.keyCode !== 103 && // numpad 7
            e.keyCode !== 104 && // numpad 8
            e.keyCode !== 105 // numpad 9
        ) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Title>{title}</Title>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={12} md={12} lg={12} className="container">
                    <Text strong={true}>Голова новообраної Старшини</Text>
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
                    <Text strong={true}>Правовий статус осередку</Text>
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
                    <Text strong={true}>УПП</Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість гніздечок пташат</Text>
                            <Form.Item
                                className="w100"
                                name="numberOfSeatsPtashat"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
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
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>УПН</Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість самостійних роїв</Text>
                            <Form.Item
                                className="w100"
                                name="numberOfIndependentRiy"
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
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
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="container">
                <Text strong={true}>УПЮ</Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Text>
                            Кількість куренів у станиці/паланці (окрузі/регіоні)
                        </Text>
                        <Form.Item
                            className="w100"
                            name="numberOfClubs"
                            rules={validationSchema.number}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <Row gutter={16} align="bottom">
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>УСП</Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>
                                Кількість старших пластунів прихильників
                            </Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeniorPlastynSupporters",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
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
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} className="container">
                    <Text strong={true}>УПС</Text>
                    <Row gutter={16} align="bottom">
                        <Col xs={24} sm={12} md={24} lg={12}>
                            <Text>
                                Кількість сеньйорів пластунів прихильників
                            </Text>
                            <Form.Item
                                className="w100"
                                name={[
                                    "membersStatistic",
                                    "numberOfSeigneurSupporters",
                                ]}
                                rules={validationSchema.number}
                            >
                                <Input
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
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
                                    type="number"
                                    maxLength={6}
                                    min="0"
                                    onKeyDown={allowOnlyThisKeysToBePressed}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="container">
                <Text strong={true}>Адміністрування та виховництво</Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>
                            Кількість діючих виховників (з усіх членів УСП, УПС)
                        </Text>
                        <Form.Item
                            className="w100"
                            name="numberOfTeachers"
                            rules={validationSchema.number}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>
                            Кількість адміністраторів (в проводах будь якого
                            рівня)
                        </Text>
                        <Form.Item
                            className="w100"
                            name="numberOfAdministrators"
                            rules={validationSchema.number}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>
                            Кількість тих, хто поєднує виховництво та
                            адміністрування
                        </Text>
                        <Form.Item
                            className="w100"
                            name="numberOfTeacherAdministrators"
                            rules={validationSchema.number}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>Пластприят</Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість пільговиків</Text>
                        <Form.Item
                            className="w100"
                            name="numberOfBeneficiaries"
                            rules={validationSchema.number}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>Залучені кошти</Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Text>Державні кошти</Text>
                        <Form.Item
                            className="w100"
                            name="publicFunds"
                            rules={validationSchema.money}
                        >
                            <Input
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
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
                                type="number"
                                maxLength={6}
                                min="0"
                                onKeyDown={allowOnlyThisKeysToBePressed}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className="container">
                <Text strong={true}>Майно та потреби станиці</Text>
                <Row gutter={16} align="bottom">
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Text>
                            Вкажіть, що вам допоможе ефективніше залучати
                            волонтерів та створювати виховні частини (гнізда,
                            курені)
                        </Text>
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
