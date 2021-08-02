import React, { useState } from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import ClubAdmin from "../../models/Club/ClubAdmin";
import AddAdministratorModal from "../Club/AddAdministratorModal/AddAdministratorModal";
import ClubUser from "../../models/Club/ClubUser";
import AdminType from "../../models/Admin/AdminType";


interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any
}
const ChangeUserClubModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user
}: Props) => {
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
 
  let clubId =user?.clubId;
  const newAdmin: ClubAdmin = {
    id: 0,
    userId: record,
    user: new ClubUser(),
    adminType: new AdminType(),
    clubId: clubId,
  };

  const handleChange = (id: string, userRole: string) => {
    onChange(id, userRole);
    user.clubName &&
      NotificationBoxApi.createNotifications(
        [id],
        `Вам була присвоєна нова роль: '${userRole}' в курені: `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/clubs/${clubId}`,user.clubName
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
      {clubId!== null ? (
        <AddAdministratorModal
          admin={newAdmin}
          setAdmin={setAdmin}
          visibleModal={showModal}
          setVisibleModal={setShowModal}
          clubId={clubId}
          onChange={handleChange}
        ></AddAdministratorModal>
        ):
        (
          <Modal title="Попередження"
            visible={showModal}
            onOk={handleClick}
            onCancel={handleClick}>
            <p> Користувач  <b>{user.firstName} {user.lastName} </b>не являється членом курення!{" "}</p>
            <p>В провід курення можна додати тільки дійсного члена!</p>
          </Modal>  
        )};
    </div>
  );
};

export default ChangeUserClubModal;
