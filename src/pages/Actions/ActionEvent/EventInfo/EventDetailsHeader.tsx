import React, {ReactNode} from "react";
import {PageHeader, Tabs, Typography, Statistic, Descriptions} from 'antd';
import "./EventDetails.less"
import {EventInformation} from "./EventInfo";

const {Text} = Typography;


const renderLabel = (name: string): ReactNode => <Text className="eventLabel">{name}</Text>
const renderContent = (text: string): ReactNode => <Text className="event-data-input">{text}</Text>
const renderDescription = (text: string): ReactNode => <Text className="dataDescription">{text}</Text>

interface Props {
    eventInfo: EventInformation;
}

const EventDetailsHeader = ({
                                eventInfo: {
                                    eventName, eventCategory, eventType, eventDateStart,
                                    eventDateEnd, eventStatus, eventLocation,
                                    description, forWhom, formOfHolding
                                }
                            }: Props) => {
    return (
        <Descriptions column={{xs: 1, sm: 2, md: 2, lg: 2, xxl: 3}} layout="vertical">
            <Descriptions.Item label={renderLabel("Назва")}>{renderContent(eventName)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Тип")}>{renderContent(eventType)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Категорія")}>{renderContent(eventCategory)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Дата початку")}>{renderContent(eventDateStart)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Дата завершення")}>{renderContent(eventDateEnd)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Локація")}>{renderContent(eventLocation)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Призначений для")}>{renderContent(forWhom)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Форма проведення")}>{renderContent(formOfHolding)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Статус")}>{renderContent(eventStatus)}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Кількість учасників")}>{renderContent("65")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Опис")}>
                {renderDescription(description)}
                {/*{renderDescription("Метою даного заходу є пробудження національного духу молоді. Виховання її як свідомих громадян. Метою даного заходу є пробудження національного духу молоді. Виховання її як свідомих громадян. Метою да")}*/}
            </Descriptions.Item>
        </Descriptions>
    )
};

export default EventDetailsHeader;
