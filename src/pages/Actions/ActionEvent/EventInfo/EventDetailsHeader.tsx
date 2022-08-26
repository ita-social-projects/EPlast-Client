import { Descriptions, Tooltip, Typography } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import extendedTitleTooltip from "../../../../components/Tooltip";
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
          <a
            style={{ display: "inline-block" }}
            href={convertToURL(text)}
            target="_blank"
            className="url"
          >
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
  const [useOneColumn, setUseOneColumn] = useState<boolean>(false);

  useEffect(() => {
    setUseOneColumn(window.innerWidth < 750);
    window.addEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setUseOneColumn(window.innerWidth < 750);
  };

  return (
    <Descriptions
      layout="horizontal"
      className="descriptions"
      column={useOneColumn ? 1 : 2}
      bordered
      size="small"
    >
      <Descriptions.Item
        label={renderLabel("Форма проведення")}
        className="descriptions-item"
      >
        {renderContent(formOfHolding)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Тип")}
        className="descriptions-item"
      >
        {renderContent(eventType)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Статус")}
        className="descriptions-item"
      >
        {renderContent(eventStatus)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Категорія")}
        className="descriptions-item"
      >
        {renderContent(eventCategory)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Заплановано учасників")}
        className="descriptions-item"
      >
        {renderContent(numberOfPartisipants.toString())}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Дата і час початку")}
        className="descriptions-item"
      >
        {renderContent(eventDateStart)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Кількість учасників")}
        className="descriptions-item"
      >
        {renderContent(
          eventParticipants
            .filter((p: EventParticipant) => p.status == "Учасник")
            .length.toString()
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Дата і час завершення")}
        className="descriptions-item"
      >
        {renderContent(eventDateEnd)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Локація")}
        className="descriptions-item"
      >
        {renderLocationContent(eventLocation)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Призначена для")}
        className="descriptions-item"
      >
        {renderContent(forWhom)}
      </Descriptions.Item>
      <Descriptions.Item
        label={renderLabel("Опис")}
        span={useOneColumn ? undefined : 2}
        className="descriptions-item"
      >
        {renderContentMaxlength(description)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default EventDetailsHeader;
