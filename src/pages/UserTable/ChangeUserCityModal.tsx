import React, {useState} from "react";
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

  const handleChange = (id: string, userRole: string) => {
    onChange(id, userRole);
    user.clubName &&
      NotificationBoxApi.createNotifications(
        [id],
        `Вам була присвоєна нова роль: '${userRole}' в станиці: `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/city/${cityId}`,user.cityName
      );
  };
  const handleClick = async () => {
    setShowModal(false);
  };
  if(!showModal)
  {
    return(<div></div>)
  }

  return (
    <div>
    {cityId!== null ? (
      <AddAdministratorModal
        admin={newAdmin}
        setAdmin={setAdmin}
        visibleModal={showModal}
        setVisibleModal={setShowModal}
        cityId={cityId}
        cityName={user.cityName}
        onChange={handleChange}
      ></AddAdministratorModal>
      ):
      (
        <Modal title="Попередження"
          visible={showModal}
          onOk={handleClick}
          onCancel={handleClick}>
          <p> Користувач  <b>{user.firstName} {user.lastName} </b>не є членом станиці!{" "}</p>
          <p>В провід станиці можна додати тільки дійсного члена!</p>
        </Modal>  
      )};
  </div>
  );
};

export default ChangeUserCityModal;
