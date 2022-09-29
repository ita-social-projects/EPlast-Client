import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import eventsApi from "../../api/eventsApi";
import eventUserApi from "../../api/eventUserApi";
import {
  successfulDeleteAction,
  tryAgain,
} from "../../components/Notifications/Messages";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import { EventAdmin } from "./ActionEvent/EventInfo/EventInfo";

const { confirm } = Modal;

type ParameterizedCallback = (id: number) => void;
type UnParameterizedCallback = () => void;
type EventsStateCallback = ParameterizedCallback | UnParameterizedCallback;

interface EventData {
  eventId: number;
  eventName: string;
  successCallback: EventsStateCallback;
  isSingleEventInState: boolean;
  eventAdmins: EventAdmin[];
  eventParticipants: any;
}

interface EventDataForDeleting {
  eventId: number;
  eventName: string;
  eventTypeId: number;
  eventCategoryId: number;
  eventAdmins: any;
}

interface EventDataForApproving {
  eventId: number;
  eventName: string;
  eventStatusId: string;
  eventAdmins: any;
  setApprovedEvent: (visible: boolean) => void;
}

// eslint-disable-next-line import/prefer-default-export
export const Success = (message: string) => {
  Modal.success({
    title: "Вітаємо!",
    content: message,
  });
};

export const showError = () => {
  Modal.error({
    title: "Упсс...",
    content: tryAgain,
  });
};

export const showSubscribeConfirm = ({
  eventId,
  eventName,
  successCallback,
  isSingleEventInState,
  eventAdmins,
}: EventData) => {
  confirm({
    title: "Ви впевнені, що хочете зголоситися на дану подію?",
    icon: <ExclamationCircleOutlined />,
    content: `Подія: ${eventName}`,
    okText: "Так, зголоситися",
    cancelText: "Скасувати",
    onOk() {
      const createParticipant = async () => {
        await eventsApi.createParticipant(eventId);
      };
      NotificationBoxApi.createNotifications(
        eventAdmins.map((ad) => ad.userId),
        `На подію ${eventName}, у якій у вас є адміністративна роль, зголосився новий учасник.`,
        NotificationBoxApi.NotificationTypes.EventNotifications,
        `/events/details/${eventId}`,
        "Перейти до деталей події"
      );
      createParticipant()
        .then(() => {
          Success("Ви успішно надіслали заявку на участь у події.");
          if (isSingleEventInState) {
            // @ts-ignore
            successCallback();
          } else {
            successCallback(eventId);
          }
        })
        .catch(() => {
          showError();
        });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showUnsubscribeConfirm = ({
  eventId,
  eventName,
  successCallback,
  isSingleEventInState,
  eventAdmins,
}: EventData) => {
  confirm({
    title: "Ви впевнені, що хочете відписатися від події?",
    icon: <ExclamationCircleOutlined />,
    content: `Подія: ${eventName}`,
    okText: "Так, відписатися",
    cancelText: "Скасувати",
    onOk() {
      const deleteParticipant = async () => {
        await eventsApi.removeParticipant(eventId);
      };
      NotificationBoxApi.createNotifications(
        eventAdmins.map((ad) => ad.userId),
        `Від події ${eventName}, у якій у вас є адміністративна роль, відписався учасник.`,
        NotificationBoxApi.NotificationTypes.EventNotifications,
        `/events/details/${eventId}`,
        "Перейти до деталей події"
      );
      deleteParticipant()
        .then(() => {
          Success("Ви успішно відписалися від події.");
          if (isSingleEventInState) {
            // @ts-ignore
            successCallback();
          } else {
            successCallback(eventId);
          }
        })
        .catch(() => {
          showError();
        });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showDeleteConfirm = ({
  eventId,
  eventName,
  successCallback,
  isSingleEventInState,
  eventAdmins,
}: EventData) => {
  confirm({
    title: "Ви впевнені, що хочете видалити дану подію?",
    icon: <ExclamationCircleOutlined />,
    content: `Подія: ${eventName}`,
    okText: "Так, видалити",
    okType: "danger",
    cancelText: "Скасувати",
    onOk() {
      const deleteEvent = async () => {
        await eventsApi.remove(eventId);
      };
      NotificationBoxApi.createNotifications(
        eventAdmins.map((ad: { userId: any }) => ad.userId),
        `Подію ${eventName}, у якій у вас була адміністративна роль, успішно видалено `,
        NotificationBoxApi.NotificationTypes.EventNotifications
      );
      deleteEvent()
        .then(() => {
          Success("Подію успішно видалено");
          if (isSingleEventInState) {
            // @ts-ignore
            successCallback();
          } else {
            successCallback(eventId);
          }
        })
        .catch(() => {
          showError();
        });
    },
    onCancel() {
      console.log("Cancel Delete");
    },
  });
};

export const showDeleteConfirmForSingleEvent = ({
  eventId,
  eventName,
  eventTypeId,
  eventCategoryId,
  eventAdmins,
}: EventDataForDeleting) => {
  confirm({
    title: "Ви впевнені, що хочете видалити дану подію?",
    icon: <ExclamationCircleOutlined />,
    content: `Подія: ${eventName}`,
    okText: "Так, видалити",
    okType: "danger",
    cancelText: "Скасувати",
    onOk() {
      const deleteEvent = async () => {
        await eventsApi.remove(eventId);
      };
      NotificationBoxApi.createNotifications(
        eventAdmins.map((ad: { userId: any }) => ad.userId),
        `Подію ${eventName}, у якій у вас була адміністративна роль, успішно видалено `,
        NotificationBoxApi.NotificationTypes.EventNotifications
      );
      deleteEvent()
        .then(() => {
          window.location.replace(
            `/types/${eventTypeId}/categories/${eventCategoryId}/events`
          );
        })
        .catch(() => {
          showError();
        });
    },
    onCancel() {
      console.log("Cancel Delete");
    },
  });
};

export const showApproveConfirm = ({
  eventId,
  eventName,
  eventStatusId,
  setApprovedEvent,
  eventAdmins,
}: EventDataForApproving) => {
  confirm({
    title: "Ви впевнені, що хочете затвердити дану подію?",
    icon: <ExclamationCircleOutlined />,
    content: `Подія: ${eventName}`,
    okText: "Так, затвердити",
    cancelText: "Скасувати",
    onOk() {
      const approveEvent = async () => {
        await eventUserApi.getEventToApprove(eventId);
        setApprovedEvent(true);
      };
      NotificationBoxApi.createNotifications(
        eventAdmins.map((ad: { userId: any }) => ad.userId),
        `Подія ${eventName}, у якій у вас є адміністративна роль, успішно затверджена.`,
        NotificationBoxApi.NotificationTypes.EventNotifications,
        `/events/details/${eventId}`,
        "Перейти до деталей події"
      );
      approveEvent()
        .then(() => {
          Success("Ви успішно затвердили дану подію.");
          if (eventStatusId === "Затверджено") {
            // @ts-ignore
            successCallback();
          }
        })
        .catch(() => {
          showError();
        });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
