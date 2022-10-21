import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import CityAdmin from "../../models/City/CityAdmin";
import AddAdministratorModal from "../City/AddAdministratorModal/AddAdministratorModal";
import AdminType from "../../models/Admin/AdminType";
import { getCityAdministration } from "../../api/citiesApi";

interface ChangeUserCityModalProps {
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
}: ChangeUserCityModalProps) => {
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [administration, setAdministration] = useState<CityAdmin[]>([]);

  let cityId = user?.cityId;

  const newAdmin: CityAdmin = {
    id: 0,
    userId: record,
    user: user,
    adminType: new AdminType(),
    cityId: cityId,
  };

  const onAdd = async (newAdmin: CityAdmin = new CityAdmin()) => {
    let previousAdmin: CityAdmin = new CityAdmin();
    
    administration.map(a => {
      if (a.adminType.adminTypeName === newAdmin.adminType.adminTypeName)
        previousAdmin = a;
        return;
    });
    console.log('administration: ', administration);
    console.log('previousAdmin: ', previousAdmin);
    console.log('newAdmin: ', newAdmin);
    if (previousAdmin.adminType.adminTypeName === newAdmin.adminType.adminTypeName) {
      await createNotification(
        previousAdmin.userId,
        `Ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в станиці`
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна адміністративна роль: '${newAdmin.adminType.adminTypeName}' в станиці`,
      true
    );
  };

  const createNotification = async (userId: string, message: string, mustLogOut?: boolean) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${newAdmin.cityId}`,
      user.cityName,
      mustLogOut
    );
  };

  const fetchData = async () => {
    console.log('cityId: ', cityId);
    const cityAdministration: CityAdmin[] = (await getCityAdministration(cityId)).data;
    setAdministration(cityAdministration);
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
