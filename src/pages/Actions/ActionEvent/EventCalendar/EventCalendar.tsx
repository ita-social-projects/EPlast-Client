import React, { useEffect, useState } from "react";
import eventUserApi from "../../../../api/eventUserApi";
import { Button, Modal } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ukLocale from "@fullcalendar/core/locales/uk";
import moment from "moment";
import { useHistory } from "react-router-dom";

const classes = require("./EventCalendar.module.css");

export default function () {
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState<any>([]);
  const [educations, setEducations] = useState<any>([]);
  const [camps, setCamps] = useState<any>([]);
  const [eventModal, setEventModal] = useState(false);
  const eventsColors: string[] = ["#6f8ab5", "#fdcb02", "#c01111"];
  const [eventInfo, setEventInfo] = useState<any>();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      await eventUserApi.getActionsForCalendar().then(async (response) => {
        setActions(response.data);

        await eventUserApi.getEducationsForCalendar().then(async (response) => {
          setEducations(response.data);

          await eventUserApi.getCampsForCalendar().then(async (response) => {
            setCamps(response.data);
          });
        });
      });
      setLoading(true);
    };
    fetchData();
  }, []);

  function getConcatedEvents(): Array<any> {
    (actions as Array<any>).forEach((event) => {
      Object.assign(event, { color: eventsColors[0] });
    });
    (educations as Array<any>).forEach((event) => {
      Object.assign(event, { color: eventsColors[1] });
    });
    (camps as Array<any>).forEach((event) => {
      Object.assign(event, { color: eventsColors[2] });
    });

    return (actions as Array<any>)
      .concat(educations as Array<any>)
      .concat(camps as Array<any>);
  }

  const handleEventClick = (clickInfo: any) => {
    setEventModal(true);
    setEventInfo(clickInfo);
  };

  return loading === false ? (
    <span />
  ) : (
    <div>
      <div>
        <div className={classes.legend}>
          <div className={classes.legendItem}>
            Акція
            <div
              className={classes.legendCircle}
              style={{ background: eventsColors[0] }}
            ></div>
          </div>

          <div className={classes.legendItem}>
            Вишкіл
            <div
              className={classes.legendCircle}
              style={{ background: eventsColors[1] }}
            ></div>
          </div>

          <div className={classes.legendItem}>
            Табір
            <div
              className={classes.legendCircle}
              style={{ background: eventsColors[2] }}
            ></div>
          </div>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          buttonText={{ today: "Поточний місяць" }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          displayEventEnd={false}
          locale={ukLocale}
          height={"auto"}
          eventClick={(event) => handleEventClick(event)}
          initialEvents={getConcatedEvents()}
          dayMaxEventRows={3}
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          moreLinkClick="popover"
          showNonCurrentDates={false}
          displayEventTime={false}
          defaultAllDay={false}
          forceEventDuration={true}
        />
        <Modal
          title="Деталі події"
          centered
          visible={eventModal}
          className={classes.modal}
          onCancel={() => setEventModal(false)}
          footer={[
            <div>
              <Button
                type="primary"
                key="submit"
                className={classes.buttonCancel}
                onClick={() => setEventModal(false)}
              >
                Закрити
              </Button>
            </div>
          ]}
        >
          <div className={classes.title}>
            <h1 className={classes.title}>{eventInfo?.event?.title}</h1>
          </div>
          <h2>
            Дата початку:{" "}
            {moment.utc(eventInfo?.event?.start).local().format("LLLL")}
          </h2>
          <h2>
            Дата завершення:{" "}
            {moment.utc(eventInfo?.event?.end).local().format("LLLL")}
          </h2>
          <h2>Локація: {eventInfo?.event?._def.extendedProps.eventlocation}</h2>
          <h2 className={classes.description}>
            Опис: {eventInfo?.event?._def.extendedProps.description}
          </h2>
          <Button
            type="primary"
            className={classes.button}
            id={classes.button}
            onClick={() =>
              history.push(`/events/details/${eventInfo?.event?.id}`)
            }
          >
            Деталі
          </Button>
        </Modal>
      </div>
    </div>
  );
}
