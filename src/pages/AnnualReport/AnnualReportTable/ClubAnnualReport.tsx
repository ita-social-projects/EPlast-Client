import React, { useEffect, useState, PropsWithRef } from "react";
import { Table} from 'antd';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import { confirmClubAnnualReport, getClubAnnualReportById } from "../../../api/clubsApi";
import ClubAnnualReportInformation from "./ClubAnnualReportInformation/ClubAnnualReportInformation";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./DropdownsForClubAnnualReports/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./DropdownsForClubAnnualReports/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./DropdownsForClubAnnualReports/SavedDropdown/SavedDropdown";
import{successfulConfirmedAction, successfulUpdateAction, tryAgain} from "../../../components/Notifications/Messages";
import notificationLogic from '../../../components/Notifications/Notification';
import { useHistory } from "react-router-dom";

interface props {
    columns: any;
    filteredData: any;
  }

  export const ClubAnnualReportTable =({columns, filteredData}:props)=>{
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>(Object);
    const history = useHistory();
    const [clubAnnualReports, setClubAnnualReports] = useState<ClubAnnualReport[]>(Array());
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [showClubAnnualReportModal, setShowClubAnnualReportModal] = useState<boolean>(false);

    const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    setCanManage(roles.includes("Admin") || roles.includes("Голова Куреня"));
    };

    const hideDropdowns = () => {
      setShowUnconfirmedDropdown(false);
      setShowConfirmedDropdown(false);
      setShowSavedDropdown(false);
    };

    const showDropdown = (annualReportStatus: number) => {
      switch (annualReportStatus) {
        case 0:
          hideDropdowns();
          setShowUnconfirmedDropdown(true);
          break;
        case 1:
          hideDropdowns();
          setShowConfirmedDropdown(true);
          break;
        case 2:
          hideDropdowns();
          setShowSavedDropdown(true);
          break;
      }
    };

    const handleView = async (id:number) => {
      hideDropdowns();
      try {
        let response = await getClubAnnualReportById(id);
        setClubAnnualReport(response.data.annualreport);
        setShowClubAnnualReportModal(true);
      } catch (error)
      {
        if (error.response?.status === 400) {
          notificationLogic('error', tryAgain);
        };
      }
    }

    const handleConfirm = async (id: number) => {
      hideDropdowns();
      try {
        let response = await confirmClubAnnualReport(id);
        setClubAnnualReports(
          clubAnnualReports.map((item) => {
            if (
              item.id === id ||
              (item.id !== id && item.clubId === response.data.clubId && item.status === 1)
            ) {
              item.status++;
            }
            return item;
          })
        );
        notificationLogic('success', successfulConfirmedAction ('Річний звіт', response.data.name));
        history.goBack();
      } catch (error) {
        notificationLogic('error', tryAgain);
        history.push(`/annualreport/table`);
      }
    }

    useEffect(() => {
      checkAccessToManage();
    }, []);
    
    return(
        <div>
        <Table
        bordered
        rowKey="id"
        columns={columns}
        scroll={{ x: 1300 }}
        dataSource={filteredData}
        onRow={(record) => {
    return {
      onClick: () => 
      {
        hideDropdowns();
      },
      onContextMenu: (event) => {
        event.preventDefault();
        showDropdown(record.status);
        setClubAnnualReport(record);
        setX(event.pageX);
        setY(event.pageY-200);
      },
    };
  }}
  onChange={(pagination) => {
    if (pagination) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }}
  pagination={{
    showLessItems: true,
    responsive: true,
    showSizeChanger: true,
  }}
/>
<ClickAwayListener onClickAway={hideDropdowns}>
        <UnconfirmedDropdown
          showDropdown={showUnconfirmedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onEdit={handleView}
          onConfirm={handleConfirm}
          onRemove={handleView}
        />
        <ConfirmedDropdown
          showDropdown={showConfirmedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleView}
        />
        <SavedDropdown
          showDropdown={showSavedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      </ClickAwayListener>
      <ClubAnnualReportInformation
        visibleModal={showClubAnnualReportModal}
        clubAnnualReport={clubAnnualReport}
        handleOk={() => setShowClubAnnualReportModal(false)}
      />
  </div>
    )
  }
