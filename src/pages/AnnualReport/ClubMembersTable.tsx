import React, { useEffect, useState, PropsWithRef } from "react";
import { Table, Spin, Input } from "antd";
import columns from "./columnsClubsMembers";
import { getUsersAdministrations } from "../../api/clubsApi";

interface props {
  UserId: string;
}

export const ClubMembersTable = ({ UserId }: props) => {
  const [data, setData] = useState<any>([
    {
      id: "",
      user: "",
      adminType: "",
      startDate: "",
      endDate: "",
      clubId: "",
    },
  ]);

  const fetchData = async () => {
    await getUsersAdministrations(UserId).then((response: { data: any }) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Список членів куреня:</h1>
      <br />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
