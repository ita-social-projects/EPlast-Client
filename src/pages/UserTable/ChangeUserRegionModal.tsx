import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import RegionAdmin from "../../models/Region/RegionAdmin";
import AddAdministratorModal from "../Regions/AddAdministratorModal";
import AdminType from "../../models/Admin/AdminType";
import { getRegionAdministration } from "../../api/regionsApi";

interface ChangeUserRegionModalProps {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any;
}

const ChangeUserRegionModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user,
}: ChangeUserRegionModalProps) => {
  const [admin, setAdmin] = useState<RegionAdmin>(new RegionAdmin());
  const [administration, setAdministration] = useState<RegionAdmin[]>([]);

  let regionId = user?.regionId;
  
  const newAdmin: any = {
    id: 0,
    userId: record,
    user: user,
    adminType: new AdminType(),
    regionId: regionId,
  };

  const onAdd = async (newAdmin: RegionAdmin = new RegionAdmin()) => {
    let previousAdmin: RegionAdmin = new RegionAdmin();
    administration.map(a => {
      if (a.adminType.adminTypeName === newAdmin.adminType.adminTypeName)
        previousAdmin = a;
        return;
    });
    if (previousAdmin.adminType.adminTypeName === newAdmin.adminType.adminTypeName) {
      await createNotification(
        previousAdmin.userId,
        `Ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в окрузі`
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в окрузі`
    );
  }

  const createNotification = async (userId: string, message: string) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regions/${regionId}`,
      user.regionName
    );
  }
  
  const fetchData = async () => {
    const regionAdministration: RegionAdmin[] = (await getRegionAdministration(regionId)).data;
    setAdministration(regionAdministration);
  }

  const handleClick = async () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal]);

  if (!showModal) return <div></div>

  return (
    <div>
      {regionId !== null ? (
        <AddAdministratorModal
          admin={newAdmin}
          setAdmin={setAdmin}
          visibleModal={showModal}
          setVisibleModal={setShowModal}
          regionId={regionId}
          regionName={user.regionName}
          onAdd={onAdd}
        ></AddAdministratorModal>
      ) : (
        <Modal
          title="Попередження"
          visible={showModal}
          onOk={handleClick}
          onCancel={handleClick}
        >
          <p>
            {" "}
            Користувач{" "}
            <b>
              {user.firstName} {user.lastName}{" "}
            </b>
            не є членом округи!{" "}
          </p>
          <p>
            В провід округи можна додати лише користувача, який є хоча б
            прихильником!
          </p>
        </Modal>
      )}
      ;
    </div>
  );
};

export default ChangeUserRegionModal;
