import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
  PlusCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import classes from "./UserTable.module.css";
import userDeleteCofirm from "./UserDeleteConfirm";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import ChangeUserCityModal from "./ChangeUserCityModal";
import adminApi from "../../api/adminApi";
import ModalAddPlastDegree from "../userPage/ActiveMembership/PlastDegree/ModalAddPlastDegree";
import ChangeUserRegionModal from "./ChangeUserRegionModal";
import ChangeUserClubModal from "./ChangeUserClubModal";
import AuthStore from "../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import AuthorizeApi from "../../api/authorizeApi";
import UserApi from "../../api/UserApi";
import { User } from "../userPage/Interface/Interface";
import ClickAwayListener from "react-click-away-listener";

let authService = new AuthorizeApi();

interface Props {
  record: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, userRoles: string) => void;
  roles: string | undefined;
  inActiveTab: boolean;
  user: any;
}

const { SubMenu } = Menu;

const DropDown = (props: Props) => {
  const {
    record,
    pageX,
    pageY,
    showDropdown,
    onDelete,
    onChange,
    user,
  } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleModalDegree, setVisibleModalDegree] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);
  const [superAdmin, setsuperAdmin] = useState<boolean>(false);
  const [regionAdm, setRegionAdm] = useState<boolean>(false);
  const [regionAdmDeputy, setRegionAdmDeputy] = useState<boolean>(false);
  const [cityAdm, setCityAdm] = useState<boolean>(false);
  const [cityAdmDeputy, setCityAdmDeputy] = useState<boolean>(false);
  const [clubAdm, setClubAdm] = useState<boolean>(false);
  const [clubAdmDeputy, setClubAdmDeputy] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(false)
  const [activeUserProfile, setActiveUserProfile] = useState<User>();
  const [changeRoles, setChangeRoles] = useState<boolean>(true);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const formerUser:string = "Колишній член пласту"

  const fetchUser = async () => {
    const activeUser = await UserApi.getActiveUserProfile();
      setActiveUserProfile(activeUser)
    const userRoles = UserApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
    
    setsuperAdmin(userRoles.includes("Admin"));
    setRegionAdm(userRoles.includes("Голова Округи"));
    setRegionAdmDeputy(userRoles.includes("Заступник Голови Округи"));
    setCityAdm(userRoles.includes("Голова Станиці"));
    setCityAdmDeputy(userRoles.includes("Заступник Голови Станиці"));
    setClubAdm(userRoles.includes("Голова Куреня"));
    setClubAdmDeputy(userRoles.includes("Заступник Голови Куреня"));
    setMember(userRoles.includes("Дійсний член організації"))
  };

  useEffect(() => {
    fetchUser();
  }, [user, changeRoles]);


  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        break;
      case "3":
        await setShowCityModal(true);
        break;
      case "4":
        await setShowRegionModal(true);
        break;
      case "5":
        await setShowClubModal(true);
        break;
      case "6":
        await setShowEditModal(true);
        break;
      case "7":
        await setVisibleModalDegree(true);
        break;
      case "8":
        await adminApi.putExpiredRole(record);
        break;
      case "9":
        await authService.resendEmailForRegistering(record);
        break;
      default:
        break;
    }
    item.key = "0";
  };

  return (
    <>
      <Menu
        theme="dark"
        className={classes.menu}
        onClick={handleItemClick}
        style={{
          top: pageY,
          left:
            window.innerWidth - (pageX + 223) < 0
              ? window.innerWidth - 266
              : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        {props.inActiveTab === false &&
        superAdmin === true ||
        ((clubAdm === true || member === true  && activeUserProfile?.club === user?.clubName) ||
          (clubAdmDeputy === true || member === true  && activeUserProfile?.club === user?.clubName) ||
          (cityAdm === true && activeUserProfile?.city == user?.cityName) ||
          (cityAdmDeputy === true && activeUserProfile?.city == user?.cityName)) ? (
          <Menu.Item key="1">
            <FileSearchOutlined />
            Переглянути профіль
          </Menu.Item>
        ) : (
          <> </>
        )}
        {superAdmin === true ? (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false &&
        (superAdmin === true ||
          regionAdm === true ||
          regionAdmDeputy === true ||
          (cityAdm === true && activeUserProfile?.city == user?.cityName) ||
          (cityAdmDeputy === true && activeUserProfile?.city == user?.cityName) ||
          (clubAdm === true && activeUserProfile?.club === user?.clubName) ||
          (clubAdmDeputy === true && activeUserProfile?.club === user?.clubName)) ? (
          <SubMenu
            key="sub"
            icon={<EditOutlined />}
            title="Змінити права доступу"
          >
            {(superAdmin === true || regionAdm === true || regionAdmDeputy === true || cityAdm === true || cityAdmDeputy === true) 
            && user?.userRoles !== formerUser 
            && (!user?.userRoles.includes("Голова Станиці") || !activeUserRoles.includes("Заступник Голови Станиці")) ? (
              <Menu.Item key="3">Провід станиці</Menu.Item>
            ) : (
              <> </>
            )}
            {(superAdmin === true || regionAdm === true || regionAdmDeputy === true) 
            && user?.userRoles !== formerUser
            && (!user?.userRoles.includes("Голова Округи") || !activeUserRoles.includes("Заступник Голови Округи")) ? (
              <Menu.Item key="4">Провід округи</Menu.Item>
            ) : (
              <> </>
            )}
            {(superAdmin === true || clubAdm === true || clubAdmDeputy === true) 
            && user?.userRoles !== formerUser 
            && (!user?.userRoles.includes("Голова Куреня") || !activeUserRoles.includes("Заступник Голови Куреня")) ? (
              <Menu.Item key="5">Провід куреня</Menu.Item>
            ) : (
              <> </>
            )}
            {superAdmin === true || regionAdm === true || regionAdmDeputy === true || cityAdm === true || cityAdmDeputy === true ? (
              <Menu.Item key="6">Поточний стан користувача</Menu.Item>
            ) : (
              <> </>
            )}
          </SubMenu>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false &&
        (superAdmin === true ||
          regionAdm === true ||
          regionAdmDeputy === true ||
          (cityAdm === true && activeUserProfile?.city == user?.cityName) ||
          (cityAdmDeputy === true && activeUserProfile?.city == user?.cityName) ||
          (clubAdm === true && activeUserProfile?.club === user?.clubName) ||
          (clubAdmDeputy === true && activeUserProfile?.club === user?.clubName)) ? (
          <Menu.Item key="7">
            <PlusCircleOutlined />
            Додати ступінь
          </Menu.Item>
        ) : (
          <> </>
        )}
        {(props.inActiveTab === false && superAdmin === true) ||
        regionAdm === true ||
        regionAdmDeputy === true ||
        (cityAdm === true && activeUserProfile?.city == user?.cityName) ||
        (cityAdmDeputy === true && activeUserProfile?.city == user?.cityName) ||
        (clubAdm === true && activeUserProfile?.club === user?.clubName) ||
        (clubAdmDeputy === true && activeUserProfile?.club === user?.clubName) ? (
          <Menu.Item key="8">
            <ScissorOutlined />
            Заархівувати користувача
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === true ? (
          <Menu.Item key="9">
            <MailOutlined />
            Активувати
          </Menu.Item>
        ) : (
          <> </>
        )}
        <ChangeUserRoleModal
          record={record}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          onChange={onChange}
          user={user}
        />
        <ChangeUserCityModal
          record={record}
          showModal={showCityModal}
          setShowModal={setShowCityModal}
          onChange={onChange}
        />
        <ChangeUserRegionModal
          record={record}
          showModal={showRegionModal}
          setShowModal={setShowRegionModal}
          onChange={onChange}
          roles={props.roles}
        />
        <ChangeUserClubModal
          record={record}
          showModal={showClubModal}
          user={user}
          setShowModal={setShowClubModal}
          onChange={onChange}
        />
        <ModalAddPlastDegree
          handleAddDegree={() => {}}
          userId={record}
          visibleModal={visibleModalDegree}
          setVisibleModal={setVisibleModalDegree}
        />
      </Menu>
    </>
  );
};

export default DropDown;
