import React, { useEffect, useState } from "react";
import { Table, Empty } from "antd";
import columns from "./columnsFormerUser";

import activeMembershipApi, {
    UserFormerDates
  } from "../../../../api/activeMembershipApi";
  
import {
    Typography,
  } from "antd";
import notificationLogic from "../../../../components/Notifications/Notification";
  
interface props {
    UserId: string;
}

const { Title } = Typography;

export const UserFormerMembershipTable = ({ UserId }: props) => {
  const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
  const [formerDates, setFormerDates] =  useState<UserFormerDates[]>([]);

  const fetchFormerDates = async () => {
    setIsLoadingActive(true);
    try {
      const response = await activeMembershipApi.getUserFormerDates(UserId);
      setFormerDates(response.dates);
    } catch {
      notificationLogic(
        "error",
        "Не вдалося завантажити дати"
      );
    } finally {
      setIsLoadingActive(false);
    }
  };

   useEffect(() => {
    fetchFormerDates();
  }, []); 

  return (
    <div>
      <h1> Колишні членства </h1>
      <br />
      <Table
        loading={isLoadingActive}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Немає колишніх членств"
            />
          ),
        }}
        columns={columns}
        dataSource={formerDates}
        scroll={{ x: 400 }}
        pagination={false}
        size = "small"
      />
      <br />
    </div>
  );
};
