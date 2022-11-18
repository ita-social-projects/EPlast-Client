import React from "react";
import { Drawer } from "antd";
import { EventCategoriesEdit } from "./EventCategoriesEdit";
import EventCategories from "../../../../models/EventCreate/EventCategories";

interface EventCategoriesEditDrawerProps {
  isVisibleEventCategoriesEditDrawer: boolean;
  setIsVisibleEventCategoriesEditDrawer: (isVisible: boolean) => void;
  setIsVisibleEventCreateDrawer: (isVisible: boolean) => void;
  categories: EventCategories[];
  setCategories: (categories: EventCategories[]) => void;
  userAccesses: {[key: string]: boolean}
}

export const EventCategoriesEditDrawer: React.FC<EventCategoriesEditDrawerProps> = ({
  isVisibleEventCategoriesEditDrawer,
  setIsVisibleEventCategoriesEditDrawer,
  setIsVisibleEventCreateDrawer,
  categories,
  setCategories,
  userAccesses
}) => {
  return (
    <Drawer
      title="Редагування категорій"
      placement="right"
      width={420}
      height={1000}
      footer={null}
      visible={isVisibleEventCategoriesEditDrawer}
      onClose={() => {
        setIsVisibleEventCategoriesEditDrawer(false);
        setIsVisibleEventCreateDrawer(true);
      }}
    >
      <EventCategoriesEdit
        categories={categories}
        setCategories={setCategories}
        userAccesses={userAccesses}
      />
    </Drawer>
  );
};
