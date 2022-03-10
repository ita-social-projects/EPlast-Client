import React, { useState } from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import CityAdmin from "../../models/City/CityAdmin";
import AddAdministratorModal from "../City/AddAdministratorModal/AddAdministratorModal";
import CityUser from "../../models/City/CityUser";
import AdminType from "../../models/Admin/AdminType";

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any;
}
const ChangeUserCityModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user,
}: Props) => {
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  let cityId = user?.cityId;

  const newAdmin: CityAdmin = {
    id: 0,
    userId: record,
    user: new CityUser(),
    adminType: new AdminType(),
    cityId: cityId,
  };

  const onAdd = async (newAdmin: CityAdmin = new CityAdmin()) => {
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна адміністративна роль: '${newAdmin.adminType.adminTypeName}' в станиці`
    );
  };

  const createNotification = async (userId: string, message: string) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${newAdmin.cityId}`,
      user.cityName
    );
  };

  const handleClick = async () => {
    setShowModal(false);
  };
  if (!showModal) {
    return <div></div>;
  }

  return (
    <div>
      {cityId !== null ? (
        <AddAdministratorModal
          admin={newAdmin}
          setAdmin={setAdmin}
          visibleModal={showModal}
          setVisibleModal={setShowModal}
          cityId={cityId}
          cityName={user.cityName}
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
            не є членом станиці!{" "}
          </p>
          <p>
            В провід станиці можна додати лише користувача, який є хоча б
            прихильником!
          </p>
        </Modal>
      )}
      ;
    </div>
  );
};

export default ChangeUserCityModal;
