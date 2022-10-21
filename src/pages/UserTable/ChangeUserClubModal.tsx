import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import ClubAdmin from "../../models/Club/ClubAdmin";
import AddAdministratorModal from "../Club/AddAdministratorModal/AddAdministratorModal";
import ClubUser from "../../models/Club/ClubUser";
import AdminType from "../../models/Admin/AdminType";
import { getClubAdministration } from "../../api/clubsApi";

interface ChangeUserClubModalProps {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any;
}

const ChangeUserClubModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user,
}: ChangeUserClubModalProps) => {
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
  const [administration, setAdministration] = useState<ClubAdmin[]>([]);

  let clubId = user?.clubId;

  const newAdmin: ClubAdmin = {
    id: 0,
    userId: record,
    user: new ClubUser(),
    adminType: new AdminType(),
    clubId: clubId,
  };

  const onAdd = async (newAdmin: ClubAdmin = new ClubAdmin()) => {
    let previousAdmin: ClubAdmin = new ClubAdmin();
    administration.map(a => {
      if (a.adminType.adminTypeName === newAdmin.adminType.adminTypeName)
        previousAdmin = a;
        return;
    });
    if (previousAdmin.adminType.adminTypeName === newAdmin.adminType.adminTypeName) {
      await createNotification(
        previousAdmin?.userId!,
        `Ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в курені`,
        true
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в курені`,
      true
    );
  }

  const createNotification = async (userId: string, message: string, mustLogOut?: boolean) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/clubs/${clubId}`,
      user.clubName,
      mustLogOut
    );
  }

  const fetchData = async () => {
    const clubAdministration: ClubAdmin[] = (await getClubAdministration(clubId)).data;
    setAdministration(clubAdministration);
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
      {clubId !== null ? (
        <AddAdministratorModal
          admin={newAdmin}
          setAdmin={setAdmin}
          visibleModal={showModal}
          setVisibleModal={setShowModal}
          clubId={clubId}
          clubName={user.clubName}
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
            не є членом куреня!{" "}
          </p>
          <p>В провід куреня можна додати тільки дійсного члена!</p>
        </Modal>
      )}
      ;
    </div>
  );
};

export default ChangeUserClubModal;
