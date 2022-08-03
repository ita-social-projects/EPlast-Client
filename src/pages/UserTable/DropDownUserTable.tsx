import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  MailOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import classes from "./UserTable.module.css";
import userDeleteCofirm from "./UserDeleteConfirm";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import ChangeUserCityModal from "./ChangeUserCityModal";
import ModalAddPlastDegree from "../userPage/ActiveMembership/PlastDegree/ModalAddPlastDegree";
import ChangeUserRegionModal from "./ChangeUserRegionModal";
import ChangeUserClubModal from "./ChangeUserClubModal";
import AuthorizeApi from "../../api/authorizeApi";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";
import { AdminRole } from "../../models/Roles/AdminRole";
import { NonAdminRole } from "../../models/Roles/NonAdminRole";
import { IDropdownItem, DropdownItemCreator } from "./DropdownItem";
import { DropdownFunc } from "../../models/UserTable/DropdownFunc";
import ChangeUserGoverningBodyModal from "./ChangeUserGoverningBodyModal";
import DeleteGoverningBodyAdminModal from "./DeleteGoverningBodyAdminModal";
import AcceptUserToCityModal from "./AcceptUserToCityModal";
import DeleteCityFollowerModal from "./DeleteCityFollowerModal";

const authService = new AuthorizeApi();

interface Props {
  record: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  inActiveTab: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, userRoles: string) => void;
  selectedUser: any;
  selectedUserRoles: Array<string>;
  currentUser: any;
  canView: boolean;
  offsetTop: number;
  offsetLeft: number;
}

const DropDown = (props: Props) => {
  const {
    record,
    pageX,
    pageY,
    showDropdown,
    inActiveTab,
    onDelete,
    onChange,
    selectedUser,
    selectedUserRoles,
    currentUser,
    canView,
    offsetTop,
    offsetLeft,
  } = props;

  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleAddDegree, setVisibleAddDegree] = useState<boolean>(false);
  const [visibleChangeDegree, setVisibleChangeDegree] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);
  const [showGoverningBodyModal, setShowGoverningBodyModal] = useState<boolean>(
    false
  );
  const [
    showDeleteGoverningBodyAdminModal,
    setShowDeleteGoverningBodyAdminModal,
  ] = useState<boolean>(false);
  const [showAcceptToCityModal, setShowAcceptToCityModal] = useState<boolean>(
    false
  );
  const [showDeleteCityFollower, setShowDeleteCityFollower] = useState<boolean>(false);

  const [superAdmin, setSuperAdmin] = useState<boolean>(false);
  const [, setGoverningBodyHead] = useState<boolean>(true);
  const [currentUserAdminRoles] = useState<Array<AdminRole>>([]);
  const [canViewProfile, setCanViewProfile] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [
    canChangeCityAdministration,
    setCanChangeCityAdministration,
  ] = useState<boolean>(false);
  const [
    canChangeClubAdministration,
    setCanChangeClubAdministration,
  ] = useState<boolean>(false);
  const [
    canChangeRegionAdministration,
    setCanChangeRegionAdministration,
  ] = useState<boolean>(false);
  const [
    canChangeGoverningBodyAdministration,
    setCanChangeGoverningBodyAdministration,
  ] = useState<boolean>(false);
  const [
    canDeleteGoverningBodyAdministration,
    setCanDeleteGoverningBodyAdministration,
  ] = useState<boolean>(false);
  const [canChangeUserAccess, setCanChangeUserAccess] = useState<boolean>(
    false
  );
  const [canChangeDegree, setCanChangeDegree] = useState<boolean>(false);
  const [canAddDegree, setCanAddDegree] = useState<boolean>(false);
  const [canRemoveFollowers, setCanRemoveFollowers] = useState<boolean>(false);
  const [chainOfAccessibility, setChainOfAccessibility] = useState<
    IDropdownItem
  >();

  const selfRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const [position, setPosition] = useState<[number, number]>([pageX, pageY]);

  // Some megamind function, taken from StackOverflow to convert enum string value to appropriate key
  // I have no idea what's going on here
  function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string
  ): keyof T | null {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  // Takes only those roles, which can access User Table and
  // writes them in array in descending order (as in AdminRole enum)
  const setUserAdminRoles = (allUserRoles: Array<string>): Array<AdminRole> => {
    // All possible AdminRole keys are converted to string array
    const allAdminRolesAsEnumKeys: Array<string> = new Array<string>();
    for (var key in AdminRole) {
      allAdminRolesAsEnumKeys.push(AdminRole[key]);
    }

    // Current user roles as strings (values) are converted to corresponding
    // Roles enum keys, which are also saved as array of string
    const userRolesAsEnumKeys: Array<string> = new Array<string>();
    allUserRoles?.forEach((role) => {
      const result = getEnumKeyByEnumValue(Roles, role);
      if (result !== null) {
        userRolesAsEnumKeys.push(result);
      }
    });

    // Intersection of possible Admin roles and current admin roles
    const userAdminRolesAsEnumKeys: Array<string> = allAdminRolesAsEnumKeys.filter(
      (role) => userRolesAsEnumKeys.includes(role)
    );

    // Roles are converted  to AdminRole enum
    const currentUserAdminRoles = new Array<AdminRole>();
    userAdminRolesAsEnumKeys.forEach((role) => {
      currentUserAdminRoles.push(AdminRole[role as keyof typeof AdminRole]);
    });

    return currentUserAdminRoles;
  };

  // Takes user Plast roles, writes them in array in descending order (as in NonAdminRole enum)
  const setUserNonAdminRoles = (
    allUserRoles: Array<string>
  ): Array<NonAdminRole> => {
    // All possible NonAdminRole keys are converted to string array
    const allAdminRolesAsEnumKeys: Array<string> = new Array<string>();
    for (var key in NonAdminRole) {
      allAdminRolesAsEnumKeys.push(NonAdminRole[key]);
    }

    // Current user roles as strings (values) are converted to corresponding
    // Roles enum keys, which are also saved as array of string
    const userRolesAsEnumKeys: Array<string> = new Array<string>();
    allUserRoles?.forEach((role) => {
      const result = getEnumKeyByEnumValue(Roles, role);
      if (result !== null) {
        userRolesAsEnumKeys.push(result);
      }
    });

    // Intersection of possible NonAdmin roles and current admin roles
    const userNonAdminRolesAsEnumKeys: Array<string> = allAdminRolesAsEnumKeys.filter(
      (role) => userRolesAsEnumKeys.includes(role)
    );

    // Roles are converted to NonAdminRole enum
    const userNonAdminRoles = new Array<NonAdminRole>();
    userNonAdminRolesAsEnumKeys.forEach((role) => {
      userNonAdminRoles.push(NonAdminRole[role as keyof typeof NonAdminRole]);
    });

    return userNonAdminRoles;
  };

  const roles = UserApi.getActiveUserRoles();

  useEffect(() => {
    const buildChain = async () => {
      const builder: DropdownItemCreator = new DropdownItemCreator();
      setChainOfAccessibility(builder.build());
    };
    buildChain();
  }, []);

  const lookThroughChain = async () => {
    chainOfAccessibility?.handle(
      currentUser,
      setUserAdminRoles(roles),
      selectedUser,
      setUserAdminRoles(selectedUserRoles),
      setUserNonAdminRoles(selectedUserRoles)
    );

    return chainOfAccessibility?.getHandlersResults();
  };

  const fetchUser = async () => {
    const result:
      | Map<DropdownFunc, any>
      | undefined
      | null = await lookThroughChain();

    // To make changes in user access for context menu look in DropdownItem.tsx

    setCanViewProfile(result?.get(DropdownFunc.CheckProfile) ?? false);

    setCanDelete(result?.get(DropdownFunc.Delete) ?? false);

    setCanChangeRegionAdministration(
      result?.get(DropdownFunc.EditRegion) ?? false
    );
    setCanChangeGoverningBodyAdministration(
      result?.get(DropdownFunc.EditGoverningBody) ?? false
    );
    setCanDeleteGoverningBodyAdministration(
      result?.get(DropdownFunc.DeleteGoverningBody) ?? false
    );

    setCanChangeCityAdministration(result?.get(DropdownFunc.EditCity) ?? false);

    setCanChangeClubAdministration(result?.get(DropdownFunc.EditClub) ?? false);

    setCanChangeUserAccess(result?.get(DropdownFunc.EditRole) ?? false);

    setCanChangeDegree(result?.get(DropdownFunc.ChangeDegree) ?? false);

    setCanAddDegree(result?.get(DropdownFunc.AddDegree) ?? false);
    setCanRemoveFollowers(result?.get(DropdownFunc.DeleteFollower) ?? false);

    setSuperAdmin(currentUserAdminRoles.includes(AdminRole.Admin));
    setGoverningBodyHead(
      currentUserAdminRoles.includes(AdminRole.GoverningBodyHead)
    );
  };

  useLayoutEffect(() => {
    fetchUser().then(() => {
      calculatePosition(selfRef.current?.clientWidth as number, selfRef.current?.clientHeight as number);
    });
  }, [selectedUser]);

  const calculatePosition = (width: number, height: number) => {
    let footer = document.getElementsByClassName("ant-layout-footer Footer_footerContainer__gKNSx").item(0);

    let y = pageY + height + offsetTop >= document.body.scrollHeight - (footer?.clientHeight as number)
      ? document.body.scrollHeight - offsetTop - (footer?.clientHeight as number) - height - 10
      : pageY;

    let x = pageX + width + offsetLeft >= document.body.clientWidth
    ? document.body.clientWidth - width - offsetLeft - 10
    : pageX;

    setPosition([x, y]);
  }

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        onChange("", "")
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
        await setVisibleChangeDegree(true);
        break;
      case "8":
        await setVisibleAddDegree(true);
        break;
      case "9":
        await authService.resendEmailForRegistering(record);
        break;
      case "10":
        await setShowGoverningBodyModal(true);
        break;
      case "11":
        await setShowDeleteGoverningBodyAdminModal(true);
        break;
      case "12":
        await setShowDeleteCityFollower(true);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={selfRef}
      className={classes.menu}
      style={{
        top: position[1],
        left: position[0],
        display: showDropdown ? "block" : "none",
      }}>
      {canView ? (
        <Menu
          theme="dark"
          onClick={handleItemClick}
        >
          {canViewProfile ? (
            <Menu.Item key="1">
              <FileSearchOutlined />
              Переглянути профіль
            </Menu.Item>
          ) : (
            <> </>
          )}
          {canDelete ? (
            <Menu.Item key="2">
              <DeleteOutlined />
              Видалити
            </Menu.Item>
          ) : (
            <> </>
          )}
          {inActiveTab && canChangeRegionAdministration ? (
            <Menu.Item key="3">
              <EditOutlined />
              Провід округи
            </Menu.Item>
          ) : (
            <> </>
          )}
          {inActiveTab && canChangeCityAdministration ? (
            <Menu.Item key="4">
              <EditOutlined />
              Провід станиці
            </Menu.Item>
          ) : (
            <> </>
          )}
          {inActiveTab && canChangeClubAdministration ? (
            <Menu.Item key="5">
              <EditOutlined />
              Провід куреня
            </Menu.Item>
          ) : (
            <> </>
          )}
          {inActiveTab && canChangeUserAccess ? (
            <Menu.Item key="6">
              <EditOutlined />
              Поточний стан користувача
            </Menu.Item>
          ) : (
            <> </>
          )}
          {!canAddDegree && canChangeDegree ? (
            <Menu.Item key="7">
              <PlusCircleOutlined />
              Змінити ступінь
            </Menu.Item>
          ) : (
            <> </>
          )}

          {!canChangeDegree && canAddDegree ? (
            <Menu.Item key="8">
              <PlusCircleOutlined />
              Додати до уладу
            </Menu.Item>
          ) : (
            <> </>
          )}
          {superAdmin ? (
            <Menu.Item key="9">
              <MailOutlined />
              Активувати
            </Menu.Item>
          ) : (
            <> </>
          )}
          {canChangeGoverningBodyAdministration ? (
            <Menu.Item key="10">
              <EditOutlined />
              Провід Пласту
            </Menu.Item>
          ) : (
            <> </>
          )}
          {canDeleteGoverningBodyAdministration ? (
            <Menu.Item key="11">
              <EditOutlined />
              Відмінити роль Адміна
            </Menu.Item>
          ) : (
            <> </>
          )}
          {canRemoveFollowers ? (
            <Menu.Item key="12">
              <CloseOutlined />
              Відхилити зголошення
            </Menu.Item>
          ) : (
            <> </>
          )}

          <ChangeUserRoleModal
            record={record}
            showModal={showEditModal}
            setShowModal={setShowEditModal}
            onChange={onChange}
            user={selectedUser}
          />
          <ChangeUserCityModal
            record={record}
            showModal={showCityModal}
            setShowModal={setShowCityModal}
            user={selectedUser}
            onChange={onChange}
          />
          <ChangeUserRegionModal
            record={record}
            showModal={showRegionModal}
            setShowModal={setShowRegionModal}
            onChange={onChange}
            user={selectedUser}
          />
          <ChangeUserClubModal
            record={record}
            showModal={showClubModal}
            user={selectedUser}
            setShowModal={setShowClubModal}
            onChange={onChange}
          />
          <ChangeUserGoverningBodyModal
            record={record}
            showModal={showGoverningBodyModal}
            user={selectedUser}
            setShowModal={setShowGoverningBodyModal}
            onChange={onChange}
          />
          <DeleteGoverningBodyAdminModal
            user={selectedUser}
            showModal={showDeleteGoverningBodyAdminModal}
            setShowModal={setShowDeleteGoverningBodyAdminModal}
            onChange={onChange}
          />
          <ModalAddPlastDegree
            handleAddDegree={() => onChange("", "")} // forcefully updating the table on exit
            userId={record}
            visibleModal={visibleAddDegree || visibleChangeDegree}
            setVisibleModal={(bool) => {
              setVisibleAddDegree(bool);
              setVisibleChangeDegree(bool);
            }}
            isChangingUserDegree={visibleChangeDegree}
          />
          <AcceptUserToCityModal
            record={record}
            showModal={showAcceptToCityModal}
            user={selectedUser}
            setShowModal={setShowAcceptToCityModal}
            onChange={onChange}
          />
          <DeleteCityFollowerModal
            record={record}
            showModal={showDeleteCityFollower}
            user={selectedUser}
            setShowModal={setShowDeleteCityFollower}
            onChange={onChange}
          />
        </Menu>
      ) : null}
    </div>
  );
};

export default DropDown;
