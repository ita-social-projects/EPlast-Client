import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import activeMembershipApi, {
  PlastDegree,
  UserPlastDegree,
} from "../../../../api/activeMembershipApi";
import FormAddPlastDegree from "./FormAddPlastDegree";
import { LoadingOutlined } from "@ant-design/icons";
import userApi from "../../../../api/UserApi";

type ModalAddPlastDegreeProps = {
  userId: string;
  visibleModal: boolean;
  isCityAdmin?: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  handleAddDegree: () => void;
};

const ModalAddPlastDegree = (props: ModalAddPlastDegreeProps) => {
  const [plastDegrees, setPlastDegrees] = useState<Array<PlastDegree>>([]);
  const [currentUserDegree, setCurrentUserDegree] = useState<UserPlastDegree>();
  const [cancel, setCancel] = useState<boolean>(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const userAllData = useRef<any>({});
  const [fullName, setFullName] = useState<string>();
  const [age, setAge] = useState<number | string>();

  const handleCancel = () => {
    props.setVisibleModal(false);
    setIsUserDataLoaded(false);
    setCancel(true);
  };

  async function getAge() {
    const userBirthday = userAllData.current.user.birthday;
    if (userBirthday === "0001-01-01T00:00:00" || undefined) {
      return "?";
    } else {
      const birthday = new Date(userBirthday);
      const today = new Date();
      const distance = today.getTime() - birthday.getTime();
      const daysOld = Math.floor(distance / (1000 * 60 * 60 * 24));
      const yearsOld = Number((daysOld / 365).toFixed(0));
      return yearsOld;
    }
  };

  const fetchData = async () => {
    await activeMembershipApi.getAllPlastDegrees().then((response) => {setPlastDegrees(response)});
    await activeMembershipApi.getUserPlastDegree(props.userId).then((response) => setCurrentUserDegree(response));
    const userData = (await userApi.getById(props.userId)).data;
    userAllData.current = userData;
    setFullName(userData.user.firstName + " " + userData.user.lastName);
    setAge(await getAge());
    setIsUserDataLoaded(true);
  };

  useEffect(() => {
    if (props.visibleModal) fetchData();
  }, [props.visibleModal]);

  return (
    <Modal
      visible={props.visibleModal}
      onCancel={handleCancel}
      title={isUserDataLoaded ? `Прийняти до станиці ${fullName} (${age} р.)` : "Завантаження..."}
      footer={null}
    >
      {isUserDataLoaded ? <FormAddPlastDegree
        handleAddDegree={props.handleAddDegree}
        userId={props.userId}
        setVisibleModal={props.setVisibleModal}
        plastDegrees={plastDegrees}
        currentUserDegree={currentUserDegree}
        resetAvailablePlastDegree={fetchData}
        cancel={cancel}
        isModalVisible={props.visibleModal}
      /> : <LoadingOutlined style={{fontSize: 24}}/> }
    </Modal>
  );
};

export default ModalAddPlastDegree;
