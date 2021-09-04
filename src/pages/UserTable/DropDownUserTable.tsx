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
import AuthorizeApi from "../../api/authorizeApi";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";

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
  currentUser: any;
  canView: boolean;
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
    currentUser,
    canView
  } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleModalDegree, setVisibleModalDegree] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);

  const [superAdmin, setsuperAdmin] = useState<boolean>(false);
  const [governingBodyHead, setGoverningBodyHead] = useState<boolean>(true);
  const [canChangeCityAdministration, setCanChangeCityAdministration] = useState<boolean>(false);
  const [canChangeClubAdministration, setCanChangeClubAdministration] = useState<boolean>(false);
  const [canChangeRegionAdministration, setCanChangeRegionAdministration] = useState<boolean>(false);
  const [canChangeGoverningBodyAdministration, setCanChangeGoverningBodyAdministration] = useState<boolean>(false);
  const [canChangeUserAccess, setCanChangeUserAccess] = useState<boolean>(false);
  const [canAddDegree, setCanAddDegree] = useState<boolean>(false);

  const fetchUser = async () => {

    const roles = UserApi.getActiveUserRoles();

    setCanChangeCityAdministration((): boolean => {
      const isCurrentUserAdmin = roles.includes(Roles.Admin);
      const isCurrentUserGoverningBodyHead = roles.includes(Roles.GoverningBodyHead);
      const isUserFromSameCityAndRegion = roles.includes(Roles.OkrugaHead)
        && currentUser?.cityId == user?.cityId;
      const isCurrentUserRegionHeadDeputy = roles.includes(Roles.OkrugaHeadDeputy) 
        && currentUser?.regionId == user?.regionId;
      const isUserCityHead = roles.includes(Roles.CityHead) 
        && currentUser?.cityId == user?.cityId;
      const isUserCityHeadDeputy = roles.includes(Roles.CityHeadDeputy) 
        && currentUser?.cityId == user?.cityId;

      return isCurrentUserAdmin ||
      isCurrentUserGoverningBodyHead ||
      isUserFromSameCityAndRegion ||
      isCurrentUserRegionHeadDeputy ||
      isUserCityHead ||
      isUserCityHeadDeputy;
    });

    setCanChangeClubAdministration((): boolean => {
      const isCurrentUserAdmin = roles.includes(Roles.Admin);
      const isCurrentUserGoverningBodyHead = roles.includes(Roles.GoverningBodyHead);
      const isCurrentUserKurinHeadDeputy = roles.includes(Roles.KurinHeadDeputy) 
        && currentUser?.clubId == user?.clubId;
      const isCurrentUserKurinHead = roles.includes(Roles.KurinHead) 
        && currentUser?.clubId == user?.clubId;

      return isCurrentUserAdmin ||
      isCurrentUserGoverningBodyHead ||
      isCurrentUserKurinHeadDeputy ||
      isCurrentUserKurinHead;
    });
      
    setCanChangeRegionAdministration((): boolean => {
      const isCurrentUserAdmin = roles.includes(Roles.Admin);
      const isCurrentUserGoverningBodyHead = roles.includes(Roles.GoverningBodyHead);
      const isCurrentUserRegionHead = roles.includes(Roles.OkrugaHead) 
        && currentUser?.regionId == user?.regionId;
      const isCurrentUserRegionHeadDeputy = roles.includes(Roles.OkrugaHeadDeputy) 
        && currentUser?.regionId == user?.regionId;
       
      return isCurrentUserAdmin ||
      isCurrentUserGoverningBodyHead ||      
      isCurrentUserRegionHead ||      
      isCurrentUserRegionHeadDeputy;
    });

    setCanChangeGoverningBodyAdministration(roles.includes(Roles.Admin) || roles.includes(Roles.GoverningBodyHead));

    setCanChangeUserAccess((): boolean => {
      const isCurrentUserAdmin = roles.includes(Roles.Admin);
      const isCurrentUserGoverningBodyHead = roles.includes(Roles.GoverningBodyHead);
      const isCurrentUserRegionHead = roles.includes(Roles.OkrugaHead) 
        && currentUser?.regionId == user?.regionId;
      const isCurrentUserRegionHeadDeputy = roles.includes(Roles.OkrugaHeadDeputy) 
        && currentUser?.regionId == user?.regionId;
      const isUserCityHead = roles.includes(Roles.CityHead) 
        && currentUser?.cityId == user?.cityId;
      const isUserCityHeadDeputy = roles.includes(Roles.CityHeadDeputy) 
        && currentUser?.cityId == user?.cityId;

      return isCurrentUserAdmin ||
      isCurrentUserGoverningBodyHead ||      
      isCurrentUserRegionHead ||      
      isCurrentUserRegionHeadDeputy ||
      isUserCityHead ||
      isUserCityHeadDeputy;
    });

    setCanAddDegree((): boolean => {
      const isCurrentUserAdmin = roles.includes(Roles.Admin);
      const isCurrentUserGoverningBodyHead = roles.includes(Roles.GoverningBodyHead);
      const isCurrentUserRegionHead = roles.includes(Roles.OkrugaHead) 
        && currentUser?.regionId == user?.regionId;
      const isCurrentUserRegionHeadDeputy = roles.includes(Roles.OkrugaHeadDeputy) 
        && currentUser?.regionId == user?.regionId;
      const isUserCityHead = roles.includes(Roles.CityHead) 
        && currentUser?.cityId == user?.cityId;
      const isUserCityHeadDeputy = roles.includes(Roles.CityHeadDeputy) 
        && currentUser?.cityId == user?.cityId;

      return isCurrentUserAdmin ||
      isCurrentUserGoverningBodyHead ||      
      isCurrentUserRegionHead ||      
      isCurrentUserRegionHeadDeputy ||
      isUserCityHead ||
      isUserCityHeadDeputy;
    });

    setsuperAdmin(roles.includes(Roles.Admin));
    setGoverningBodyHead(roles.includes(Roles.GoverningBodyHead));
  };

  useEffect(() => {
    fetchUser();
  }, [user]);


  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        break;
      case "3":
        await setShowRegionModal(true);
        break;
      case "4":
        await setShowCityModal(true);
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
      {canView ? <Menu
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
        {props.inActiveTab === false && canView ? (
          <Menu.Item key="1">
            <FileSearchOutlined />
            Переглянути профіль
          </Menu.Item>
        ) : (
          <> </>
        )}
        {superAdmin || governingBodyHead ? (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : (
          <> </>
        )}
        {!props.inActiveTab &&
          (canChangeCityAdministration || canChangeClubAdministration || canChangeRegionAdministration
            || canChangeGoverningBodyAdministration || canChangeUserAccess) ? (
          <SubMenu
            key="sub"
            icon={<EditOutlined />}
            title="Змінити права доступу"
            onTitleClick={() => { }}
          >
            {canChangeRegionAdministration ? (
              <Menu.Item key="3">Провід округи</Menu.Item>
            ) : (
              <> </>
            )}
            {canChangeCityAdministration ? (
              <Menu.Item key="4">Провід станиці</Menu.Item>
            ) : (
              <> </>
            )}
            {canChangeClubAdministration ? (
              <Menu.Item key="5" >Провід куреня </Menu.Item>
            ) : (
              <> </>
            )}
            {canChangeUserAccess ? (
              <Menu.Item key="6">Поточний стан користувача</Menu.Item>
            ) : (
              <> </>
            )}
          </SubMenu>
        ) : (
          <> </>
        )}
        {!props.inActiveTab && canAddDegree ? (
          <Menu.Item key="7">
            <PlusCircleOutlined />
            Додати ступінь
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab && superAdmin ? (
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
          user={user}
          onChange={onChange}
        />
        <ChangeUserRegionModal
          record={record}
          showModal={showRegionModal}
          setShowModal={setShowRegionModal}
          onChange={onChange}
          user={user}
        />
        <ChangeUserClubModal
          record={record}
          showModal={showClubModal}
          user={user}
          setShowModal={setShowClubModal}
          onChange={onChange}
        />
        <ModalAddPlastDegree
          handleAddDegree={() => { }}
          userId={record}
          visibleModal={visibleModalDegree}
          setVisibleModal={setVisibleModalDegree}
        />
      </Menu> : null}
    </>
  );
};

export default DropDown;
