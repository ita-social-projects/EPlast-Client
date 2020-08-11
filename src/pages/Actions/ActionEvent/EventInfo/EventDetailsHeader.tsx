import React, {ReactNode} from "react";
import {PageHeader, Tabs, Typography, Statistic, Descriptions} from 'antd';
import "./EventDetails.less"

const {Text, Title} = Typography;


const renderLabel = (name: string): ReactNode => <Text className="eventLabel">{name}</Text>
const renderContent = (text: string): ReactNode => <Text className="event-data-input">{text}</Text>
const renderDescription = (text: string): ReactNode => <Text className="dataDescription">{text}</Text>


const EventDetailsHeader = () => {
    return (
        <Descriptions column={{xs: 1, sm: 2, md: 2, lg: 2, xxl:3}} layout="vertical">
            <Descriptions.Item  label={renderLabel("Назва")}>{renderContent("BrychEvent")}</Descriptions.Item>
            <Descriptions.Item  label={renderLabel("Тип")}>{renderContent("Акція")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Категорія")}>{renderContent("КПЗ")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Дата початку")}>{renderContent("2017-10-10")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Дата завершення")}>{renderContent("2017-10-10")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Локація")}>{renderContent("м.Стрий")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Призначений для")}>{renderContent("дітей")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Форма проведення")}>{renderContent("на вулиці")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Статус")}>{renderContent("Завершиний(-на)")}</Descriptions.Item>
            <Descriptions.Item label={renderLabel("Опис")}>
                {renderDescription("Метою даного заходу є участь усіх учасників Пласту.")}
                {/*<Title level={4} code={true} style={{fontStyle: "italic"}}>Gonghu Road, Xihu District, Hangzhou, Zhejiang,*/}
                {/*    China</Title>*/}
            </Descriptions.Item>
        </Descriptions>
    )
};

export default EventDetailsHeader;
