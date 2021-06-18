import { Empty, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import regionsApi, { getSearchedRegionsReports } from "../../../api/regionsApi";
import ConfirmedRegionDropdown from "./DropdownsForRegionReports/ConfirmedDropdown/ConfirmedRegionDropdown";
import notificationLogic from "../../../components/Notifications/Notification";
import SavedRegionDropdown from "./DropdownsForRegionReports/SavedDropdown/SavedRegionDropdown";
import UnconfirmedRegionDropdown from "./DropdownsForRegionReports/UnconfirmedDropdown/UnconfirmedRegionDropdown";
import { successfulDeleteAction, successfulEditAction, tryAgain } from "../../../components/Notifications/Messages";
import { ExclamationCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import UserApi from "../../../api/UserApi";

interface props {
  columns: any;
  searchedData: any;
  sortKey: any;
}

interface regionReport {
  count: number,
  date: Date,
  id: number,
  regionName: string,
  regionId: number,
  status: number,
  total: number
};

export const RegionAnnualReportTable = ({ columns, searchedData, sortKey }: props) => {
  const [regionAnnualReport, setRegionAnnualReport] = useState(Object);
  const [regionAnnualReports, setRegionsAnnualReports] = useState<regionReport[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [canView, setCanView] = useState<boolean>();
  const [currentSearchedData, setCurrentSearchedData] = useState<string>();
  const [showConfirmedRegionDropdown, setShowConfirmedRegionDropdown] = useState<boolean>(false);
  const [showUnconfirmedRegionDropdown, setShowUnconfirmedRegionDropdown] = useState<boolean>(false);
  const [showSavedRegionDropdown, setShowSavedRegionDropdown] = useState<boolean>(false);
  const [isRegionAdmin, setIsRegionAdmin] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(false);
  const [authReport, setAuthReport] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (currentSearchedData != searchedData) {
      setCurrentSearchedData(searchedData);
      setPage(1);
    }
    fetchRegionAnnualReports();
    checkAccessToManage();
  }, [searchedData, page, pageSize, sortKey, authReport]);


  const fetchRegionAnnualReports = async () => {
    setIsLoading(true)
    try {
      let response = await getSearchedRegionsReports(searchedData, page, pageSize, sortKey, authReport);
      setRegionsAnnualReports(response.data);
      setTotal(response.data[0]?.total);
      setCount(response.data[0]?.count);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hideDropdowns = () => {
    setShowUnconfirmedRegionDropdown(false);
    setShowConfirmedRegionDropdown(false);
    setShowSavedRegionDropdown(false);
  };

  const showDropdown = (annualReportStatus: number) => {
    switch (annualReportStatus) {
      case 0:
        hideDropdowns();
        setShowUnconfirmedRegionDropdown(true);
        break;
      case 1:
        hideDropdowns();
        setShowConfirmedRegionDropdown(true);
        break;
      case 2:
        hideDropdowns();
        setShowSavedRegionDropdown(true);
        break;
    }
  };

  const handleView = async (id: number, year: number) => {
    hideDropdowns();
    history.push(`/annualreport/region/${id}/${year}`)
  };

  const handleEdit = (id: number, year: number) => {
    hideDropdowns();
    history.push(`/annualreport/region/edit/${id}/${year}`);
  };

  const handleConfirm = async (id: number) => {
    hideDropdowns();
    try {
      let response = await regionsApi.confirm(id);
      let regionId = regionAnnualReports.find((item) => item.id === id)?.regionId;
      setRegionsAnnualReports(
        regionAnnualReports.map((item) => {
          if (
            item.id === id ||
            (item.id !== id && item.regionId === regionId && item.status === 1)
          ) {
            item.status++;
          }
          return item;
        })
      );
      notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
    } catch (error) {
      notificationLogic("error", tryAgain);
    }
  };

  const handleRemove = async (id: number) => {
    hideDropdowns();
    try {
      Modal.confirm({
        title: "Ви дійсно хочете видалити річний звіт?",
        icon: <ExclamationCircleOutlined />,
        okText: 'Так, видалити',
        okType: 'danger',
        cancelText: 'Скасувати',
        maskClosable: true,
        async onOk() {
          let response = await regionsApi.removeAnnualReport(id);
          setRegionsAnnualReports(regionAnnualReports?.filter((item) => item.id !== id));
          notificationLogic('success', successfulDeleteAction('Річний звіт', response.data.name));
          setTotal(total - 1);
          setCount(count - 1);
        }
      });
    } catch (error) {
      notificationLogic("error", tryAgain);
    }
  };

  const handleCancel = async (id: number) => {
    hideDropdowns();
    try {
      let response = await regionsApi.cancel(id);
      setRegionsAnnualReports(
        regionAnnualReports.map((item) => {
          if (item.id === id) {
            item.status--;
          }
          return item;
        })
      );
      notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
    } catch (error) {
      notificationLogic("error", tryAgain);
    }
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const checkAccessToManage = () => {
    let roles = UserApi.getActiveUserRoles();
    setIsRegionAdmin(roles.includes("Голова Округи"));
    setIsAdmin(roles.includes("Admin"));
    setCanView(roles.includes("Голова Станиці") || roles.includes("Голова Округи") || roles.includes("Admin"));
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
      <div
        hidden={isLoading}
        className={"TableGeneralInfo"}>
        <p>
          {count ? 'Знайдено ' + count + '/' + total + ' результатів' : ''}
        </p>
        {isRegionAdmin ? <div className={"AuthReport"}>
          <Tooltip
            placement="topLeft"
            title="Звіти в моєму розпорядженні">

            <button
              onClick={() => { setPage(1); setAuthReport(!authReport) }} >
              {authReport ? <StarFilled /> : <StarOutlined />}
            </button>
          </Tooltip>
        </div> : null}
      </div>
      <Table
        {...{ loading: isLoading }}
        locale={{
          emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="За вашим запитом нічого не знайдено" />)
        }}
        bordered
        rowKey="id"
        columns={columns}
        scroll={{ x: 1300 }}
        dataSource={regionAnnualReports.map((item: any) => {
          if (item.canManage && !isAdmin)
            return {
              ...item, idView: (<>{item.id}    <text style={{ color: "#3c5438" }}>
                <Tooltip
                  placement="topLeft"
                  title="Звіт у моєму розпорядженні">
                  <StarOutlined />
                </Tooltip>
              </text></>)
            };
          else return { ...item, idView: (<>{item.id}</>) };
        })}
        onRow={(regionRecord) => {
          return {
            onDoubleClick: event => { if (regionRecord.id && canView) history.push(`/annualreport/region/${regionRecord.id}/${(new Date(regionRecord.date)).getFullYear()}`) },
            onClick: () => {
              hideDropdowns();
            },
            onContextMenu: (event) => {
              event.preventDefault();
              if (canView){
                showDropdown(regionRecord.status);
                setRegionAnnualReport(regionRecord);
                setX(event.pageX);
                setY(event.pageY - 200);
              }else{hideDropdowns();}
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
        <UnconfirmedRegionDropdown
          showDropdown={showUnconfirmedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          canManage={isAdmin!}
          onView={handleView}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedRegionDropdown
          showDropdown={showConfirmedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          canManage={isAdmin!}
          onView={handleView}
          onCancel={handleCancel}
        />
        <SavedRegionDropdown
          showDropdown={showSavedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      </ClickAwayListener>
    </div>
  )
}
