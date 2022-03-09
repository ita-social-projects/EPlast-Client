import React, { useEffect, useState } from "react";
import { Empty, Modal, Table, Tooltip } from "antd";
import {
  cancelClubAnnualReport,
  confirmClubAnnualReport,
  getClubAnnualReportById,
  getSearchedClubAnnualReports,
  removeClubAnnualReport,
} from "../../../api/clubsApi";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./DropdownsForClubAnnualReports/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./DropdownsForClubAnnualReports/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./DropdownsForClubAnnualReports/SavedDropdown/SavedDropdown";
import {
  successfulConfirmedAction,
  successfulCancelAction,
  successfulDeleteAction,
  tryAgain,
} from "../../../components/Notifications/Messages";
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from "react-router-dom";
import {
  ExclamationCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import IUserAnnualReportAccess from "../../../models/UserAccess/IUserAccess";
import UserApi from "../../../api/UserApi";
import { ReportType } from "../../../models/AnnualReport/ReportType";
import AnnualReportApi from "../../../api/AnnualReportApi";
import ClubAnnualReportLayout from "../../../models/PDF/AnnualReport/ClubAnnualReportLayout";
import { fonts } from "../../../models/PDF/fonts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfVFS from "../../../assets/VFS/vfs";

pdfMake.vfs = pdfVFS;
pdfMake.fonts = fonts;

interface props {
  columns: any;
  searchedData: any;
  sortKey: any;
  userCertainAnnualReportAccess: IUserAnnualReportAccess;
  setUserCertainAnnualReportAccess: any;
}

export const ClubAnnualReportTable = ({
  columns,
  searchedData,
  sortKey,
  userCertainAnnualReportAccess,
  setUserCertainAnnualReportAccess,
}: props) => {
  const history = useHistory();
  const [clubAnnualReport, setClubAnnualReport] = useState(Object);
  const [clubAnnualReports, setClubAnnualReports] = useState(Array());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [currentSearchedData, setCurrentSearchedData] = useState<string>();
  const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<
    boolean
  >(false);
  const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(
    false
  );
  const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authReport, setAuthReport] = useState(false);

  useEffect(() => {
    if (currentSearchedData != searchedData) {
      setCurrentSearchedData(searchedData);
      setPage(1);
    }
    fetchClubAnnualReports();
  }, [searchedData, page, pageSize, sortKey, authReport]);

  const fetchClubAnnualReports = async () => {
    setIsLoading(true);
    try {
      let response = await getSearchedClubAnnualReports(
        searchedData,
        page,
        pageSize,
        sortKey,
        authReport
      );
      setClubAnnualReports(response.data.clubAnnualReports);
      setTotal(response.data.clubAnnualReports[0]?.total);
      setCount(response.data.clubAnnualReports[0]?.count);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
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

  const handleView = async (id: number) => {
    hideDropdowns();
    history.push(`/annualreport/clubAnnualReport/${id}`);
  };
  const handleViewPDF = async (id: number) => {
    hideDropdowns();
    try {
      let annualReport = await (await getClubAnnualReportById(id)).data
        .annualreport;

      pdfMake.createPdf(ClubAnnualReportLayout(annualReport)).open();
    } catch (error) {
      notificationLogic("error", tryAgain);
    }
  };

  const handleCancel = async (id: number) => {
    hideDropdowns();
    try {
      let response = await cancelClubAnnualReport(id);
      setClubAnnualReports(
        clubAnnualReports.map((item) => {
          if (
            item.id === id ||
            (item.id !== id &&
              item.clubId === response.data.clubId &&
              item.status === 1)
          ) {
            item.status--;
          }
          return item;
        })
      );
      notificationLogic(
        "success",
        successfulCancelAction("Річний звіт", response.data.name)
      );
    } catch (error) {
      if (error.response?.status === 400) {
        notificationLogic("error", tryAgain);
        history.goBack();
      }
    }
  };

  const handleConfirm = async (id: number) => {
    hideDropdowns();
    try {
      let response = await confirmClubAnnualReport(id);
      setClubAnnualReports(
        clubAnnualReports.map((item) => {
          if (
            item.id === id ||
            (item.id !== id &&
              item.clubId === response.data.clubId &&
              item.status === 1)
          ) {
            item.status++;
          }
          return item;
        })
      );
      notificationLogic(
        "success",
        successfulConfirmedAction("Річний звіт", response.data.name)
      );
    } catch (error) {
      notificationLogic("error", tryAgain);
      history.goBack();
    }
  };

  const handleRemove = async (id: number) => {
    hideDropdowns();
    try {
      Modal.confirm({
        title: "Ви дійсно хочете видалити річний звіт?",
        icon: <ExclamationCircleOutlined />,
        okText: "Так, видалити",
        okType: "danger",
        cancelText: "Скасувати",
        maskClosable: true,
        async onOk() {
          let response = await removeClubAnnualReport(id);
          setClubAnnualReports(
            clubAnnualReports?.filter((item) => item.id !== id)
          );
          notificationLogic(
            "success",
            successfulDeleteAction("Річний звіт", response.data.name)
          );
        },
      });
    } catch (error) {
      notificationLogic("error", tryAgain);
      history.goBack();
    }
  };

  const handleEdit = (id: number) => {
    hideDropdowns();
    history.push(`/club/editClubAnnualReport/${id}`);
  };

  const handlePageChange = (page: number) => {
    hideDropdowns();
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    hideDropdowns();
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <div hidden={isLoading} className={"TableGeneralInfo"}>
        <p>{count ? "Знайдено " + count + "/" + total + " результатів" : ""}</p>
        {userCertainAnnualReportAccess?.CanSubmitClubReport &&
        !userCertainAnnualReportAccess?.IsSuperAdmin ? (
          <div className={"AuthReport"}>
            <Tooltip placement="topLeft" title="Звіти в моєму розпорядженні">
              <button
                onClick={() => {
                  setPage(1);
                  setAuthReport(!authReport);
                }}
              >
                {authReport ? <StarFilled /> : <StarOutlined />}
              </button>
            </Tooltip>
          </div>
        ) : null}
      </div>
      <Table
        {...{ loading: isLoading }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="За вашим запитом нічого не знайдено"
            />
          ),
        }}
        bordered
        rowKey="id"
        columns={columns}
        scroll={{ x: 1300 }}
        dataSource={clubAnnualReports.map((item: any) => {
          if (item.canManage && !userCertainAnnualReportAccess?.IsSuperAdmin)
            return {
              ...item,
              idView: (
                <>
                  {item.id}{" "}
                  <text style={{ color: "#3c5438" }}>
                    <Tooltip
                      placement="topLeft"
                      title="Звіт у моєму розпорядженні"
                    >
                      <StarOutlined />
                    </Tooltip>
                  </text>
                </>
              ),
            };
          else return { ...item, idView: <>{item.id}</> };
        })}
        onRow={(record) => {
          return {
            onDoubleClick: (event) => {
              if (
                record.id &&
                userCertainAnnualReportAccess?.CanViewReportDetails
              )
                history.push(`/annualreport/clubAnnualReport/${record.id}`);
            },
            onClick: () => {
              hideDropdowns();
            },
            onContextMenu: async (event) => {
              event.preventDefault();
              event.pageX + 277 > window.innerWidth
                ? setX(window.innerWidth - 280)
                : setX(event.pageX);
              setY(event.pageY);
              userCertainAnnualReportAccess.CanEditReport =
                userCertainAnnualReportAccess?.IsSuperAdmin;
              setClubAnnualReport(record);
              setUserCertainAnnualReportAccess(
                await (
                  await AnnualReportApi.getUserCertainAnnualReportAccess(
                    UserApi.getActiveUserId(),
                    ReportType.Club,
                    record.id
                  )
                ).data
              );
              showDropdown(record.status);
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
          current: page,
          pageSize: pageSize,
          total: count,
          showLessItems: true,
          responsive: true,
          showSizeChanger: true,
          onChange: (page) => handlePageChange(page),
          onShowSizeChange: (page, size) => handleSizeChange(page, size),
        }}
      />
      <ClickAwayListener onClickAway={hideDropdowns}>
        <UnconfirmedDropdown
          showDropdown={showUnconfirmedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          userAnnualReportAccess={userCertainAnnualReportAccess}
          onView={handleView}
          onViewPDF={handleViewPDF}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedDropdown
          showDropdown={showConfirmedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          userAnnualReportAccess={userCertainAnnualReportAccess}
          onView={handleView}
          onViewPDF={handleViewPDF}
          onCancel={handleCancel}
        />
        <SavedDropdown
          showDropdown={showSavedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          userAnnualReportAccess={userCertainAnnualReportAccess}
          onView={handleView}
          onViewPDF={handleViewPDF}
        />
      </ClickAwayListener>
    </div>
  );
};
