import React, {useState} from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import RegionAdmin from "../../models/Region/RegionAdmin";
import AddAdministratorModal from "../Regions/AddAdministratorModal";
import RegionUser from "../../models/Region/RegionUser";
import AdminType from "../../models/Admin/AdminType";
interface Props {
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
  user
}: Props) => {
  const [admin, setAdmin] = useState<RegionAdmin>(new RegionAdmin());
 
  let regionId =user?.regionId;
  let cityId = user?.cityId;
  const newAdmin: any = {
    id: 0,
    userId: record,
    user: new RegionUser(),
    adminType: new AdminType(),
    regionId: regionId,
  };

  const handleChange = (id: string, userRole: string) => {
    onChange(id, userRole);
    user.clubName &&
      NotificationBoxApi.createNotifications(
        [id],
        `Вам була присвоєна нова роль: '${userRole}' в окрузі: `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/regions/${regionId}`,user.regionName
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
      {regionId!== null ? (
        <AddAdministratorModal
          admin={newAdmin}
          setAdmin={setAdmin}
          visibleModal={showModal}
          setVisibleModal={setShowModal}
          regionId={regionId}
          regionName={user.regionName}
          onChange={handleChange}
        ></AddAdministratorModal>
        ):
        (
          <Modal title="Попередження"
            visible={showModal}
            onOk={handleClick}
            onCancel={handleClick}>
            <p> Користувач  <b>{user.firstName} {user.lastName} </b>не є членом округи!{" "}</p>
            <p>В провід округи можна додати тільки дійсного члена!</p>
          </Modal>  
        )};
    </div>
  );
};

export default ChangeUserRegionModal;
