import React, { useEffect, useState, PropsWithRef } from "react";
import { Modal, Table} from 'antd';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import { cancelClubAnnualReport, confirmClubAnnualReport, getClubAnnualReport, getClubAnnualReportById, removeClubAnnualReport } from "../../../api/clubsApi";
import ClubAnnualReportInformation from "./ClubAnnualReportInformation/ClubAnnualReportInformation";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./DropdownsForClubAnnualReports/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./DropdownsForClubAnnualReports/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./DropdownsForClubAnnualReports/SavedDropdown/SavedDropdown";
import{successfulConfirmedAction, successfulDeleteAction, successfulUpdateAction, tryAgain} from "../../../components/Notifications/Messages";
import notificationLogic from '../../../components/Notifications/Notification';
import { useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface props {
    columns: any;
    filteredData: any;
  }

  export const ClubAnnualReportTable =({columns, filteredData}:props)=>{
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>(Object);
    const [clubAnnualReports, setClubAnnualReports] = useState<ClubAnnualReport[]>(Array());
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [showClubAnnualReportModal, setShowClubAnnualReportModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const checkAccessToManage = () => {
    let jwt = AuthStore.getToken() as string;
    let decodedJwt = jwt_decode(jwt) as any;
    let roles = decodedJwt[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];
    setCanManage(roles.includes("Admin") || roles.includes("Голова Куреня"));
    };

    const handleClickAway = () => {
      setShowUnconfirmedDropdown(false);
      setShowConfirmedDropdown(false);
      setShowSavedDropdown(false);
    }

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

    const  renewPage = ()=>{
      window.location.reload(false);
    }

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
          history.goBack(); 
        };
      }
    }

    const handleCancel = async (id:number) => {
      hideDropdowns();
      setLoading(true);
      try {
        let response = await cancelClubAnnualReport(id);
        setClubAnnualReports(clubAnnualReports?.filter((item) => item.id !== id));
        notificationLogic('success', successfulUpdateAction ('Річний звіт', response.data.name));
        renewPage();
      } catch (error)
      {
        if (error.response?.status === 400) {
          notificationLogic('error', tryAgain);
          history.goBack(); 
        };
      }
    }

    const handleConfirm = async (id: number) => {
      hideDropdowns();
      setLoading(false);
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
        renewPage();
      } catch (error) {
        notificationLogic('error', tryAgain);
        history.goBack(); 
      }
    }

    const handleRemove = async (id: number) => {
      hideDropdowns(); 
      try {
        Modal.confirm({
          title: "Ви дійсно хочете видалити річний звіт?",
          icon: <ExclamationCircleOutlined/>,
          okText: 'Так, видалити',
          okType: 'danger',
          cancelText: 'Скасувати',
          maskClosable: true,
          async onOk() {
        let response = await removeClubAnnualReport(id);
        setClubAnnualReports(clubAnnualReports?.filter((item) => item.id !== id));
        notificationLogic('success', successfulDeleteAction ('Річний звіт', response.data.name));
        renewPage();
      }
        });
      } catch (error) {
        notificationLogic('error', tryAgain);
        history.goBack(); 
      }
    };

    const handleEdit = (id: number) => {
      hideDropdowns();
      history.push(`/club/editClubAnnualReport/${id}`);
    };
    
    const fetchData = async () => {
    await getClubAnnualReport();
    setLoading(true);
    }

    useEffect(() => {
      checkAccessToManage();
      fetchData();
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
        onClick: () => {hideDropdowns();},
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
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedDropdown
          showDropdown={showConfirmedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleCancel}
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
