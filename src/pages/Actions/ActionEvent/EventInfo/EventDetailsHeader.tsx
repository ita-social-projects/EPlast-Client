import { Descriptions, Tooltip, Typography } from "antd";
import React, { ReactNode } from "react";
import extendedTitleTooltip from "../../../../components/Tooltip";
import "./EventDetails.less";
import "./EventDetailsHeader.less";
import { EventInformation, EventParticipant } from "./EventInfo";

const { Text } = Typography;

function convertToURL(textEntered: string) {
  const matches = textEntered.match(/\bhttps?:\/\/\S+/gi);
  return matches ? matches[0] : "";
}

export function extendedLocationTooltip(number: number, text: string) {
  return convertToURL(text) ? (
    <>
      <Tooltip title={text}>
        <span>
          <a href={convertToURL(text)} target="_blank" className="url">
            {text}
          </a>
        </span>
      </Tooltip>
    </>
  ) : (
    text
  );
}

const textMaxLength = 16;
const textMaxLengthDesc = 200;
const renderLabel = (name: string): ReactNode => (
  <Text className="eventLabel">{name}</Text>
);
const renderLocationContent = (text: string): ReactNode => (
  <Text className="event-data-input">
    {extendedLocationTooltip(textMaxLengthDesc, text)}
  </Text>
);

const renderContent = (text: string): ReactNode => (
  <Text className="event-data-input">
    {extendedTitleTooltip(textMaxLength, text)}
  </Text>
);

const renderContentMaxlength = (text: string): ReactNode => (
  <Text className="event-data-input">
    {extendedTitleTooltip(textMaxLengthDesc, text)}
  </Text>
);

interface Props {
  eventInfo: EventInformation;
}

const EventDetailsHeader = ({
  eventInfo: {
    eventName,
    eventCategory,
    eventType,
    eventDateStart,
    eventDateEnd,
    eventStatus,
    eventLocation,
    description,
    forWhom,
    formOfHolding,
    eventParticipants,
    numberOfPartisipants,
  },
}: Props) => {
  return (
    <Descriptions layout="horizontal" className="descriptions" column={2}>
      <Descriptions.Item label={renderLabel("Форма проведення")}>
        {renderContent(formOfHolding)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Тип")}>
        {renderContent(eventType)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Статус")}>
        {renderContent(eventStatus)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Категорія")}>
        {renderContent(eventCategory)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Заплановано учасників")}>
        {renderContent(numberOfPartisipants.toString())}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Дата і час початку")}>
        {renderContent(eventDateStart)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Кількість учасників")}>
        {renderContent(
          eventParticipants
            .filter((p: EventParticipant) => p.status == "Учасник")
            .length.toString()
        )}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Дата і час завершення")}>
        {renderContent(eventDateEnd)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Локація")}>
        {renderLocationContent(eventLocation)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Призначена для")} span={3}>
        {renderContent(forWhom)}
      </Descriptions.Item>
      <Descriptions.Item label={renderLabel("Опис")}>
        {renderContentMaxlength(description)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default EventDetailsHeader;
