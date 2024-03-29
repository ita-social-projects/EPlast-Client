import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton } from "antd";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  getAllFollowers,
  getCityById,
  removeFollower,
} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityMember from "../../../models/City/CityMember";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { Roles } from "../../../models/Roles/Roles";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../../components/Tooltip";
import ModalAddPlastDegree from "../../userPage/ActiveMembership/PlastDegree/ModalAddPlastDegree";

const CityFollowers = () => {
  const { id } = useParams();
  const history = useHistory();

  const [followers, setFollowers] = useState<CityMember[]>([]);
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserID, setActiveUserID] = useState<string>();
  const [followersCount, setFollowersCount] = useState<number>();
  const [membersCount, setMembersCount] = useState<number>();
  const [isLoadingPlus, setIsLoadingPlus] = useState<boolean>(true);
  const [isLoadingMemberId, setIsLoadingMemberId] = useState<number>(0);
  const [selectedFollowerUID, setSelectedFollowerUID] = useState<string>();
  const [visibleAddModalDegree, setVisibleAddModalDegree] = useState<boolean>(
    false
  );

  const getFollowers = async () => {
    setLoading(true);
    const response = await getAllFollowers(id);

    setPhotosLoading(true);
    setPhotos(response.data.followers);
    setFollowers(response.data.followers);
    setCanEdit(response.data.canEdit);
    setCityName(response.data.name);
    setActiveUserID(userApi.getActiveUserId());
    setActiveUserRoles(userApi.getActiveUserRoles);
    setLoading(false);
  };

  function seeSkipModal(follower: CityMember) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете покинути дану станицю?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, покинути",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        removeMember(follower);
      },
    });
  }

  function seeDeleteModal(follower: CityMember) {
    return Modal.confirm({
      title: `Ви впевнені, що хочете видалити ${follower.user.firstName} ${follower.user.lastName} із прихильників?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        removeMember(follower);
      },
    });
  }

  const createNotification = async (userId: string, message: string, mustLogOut?: boolean) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${id}`,
      cityName,
      mustLogOut
    );
  };


  const removeMember = async (follower: CityMember) => {
    setFollowers(followers.filter((u) => u.id !== follower.id));
    await removeFollower(follower.id);
    await createNotification(
      follower.userId,
      "На жаль, ви були виключені з прихильників станиці",
      true
    );
  };

  const setPhotos = async (members: CityMember[]) => {
    for (let i of members) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }

    setPhotosLoading(false);
  };

  const handleAddDegree = async () => {
    const memberId = followers.find((item) => item.userId === selectedFollowerUID)?.id;
    setIsLoadingMemberId(memberId ?? NaN);

    setFollowers(followers.filter((f) => f.id !== memberId));

    const response = await getCityById(+id);
    setMembersCount(response.data.memberCount);
    setFollowersCount(response.data.followerCount);
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const canSeeProfiles = canEdit ||
    activeUserRoles.includes(Roles.Supporter) ||
    activeUserRoles.includes(Roles.PlastMember)

  return (
    <Layout.Content>
      <Title level={2}>Зголошені до станиці</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {followers.length > 0 ? (
            followers.map((follower: CityMember) => (
              <Card
                key={follower.id}
                className="detailsCard"
                actions={
                  (canEdit && isLoadingPlus) || (isLoadingMemberId !== follower.id &&
                    !isLoadingPlus)
                    ? [
                      <PlusOutlined
                        onClick={() => {
                          setSelectedFollowerUID(follower.userId);
                          setVisibleAddModalDegree(true);
                        }}
                      />,
                      <CloseOutlined
                        onClick={() => seeDeleteModal(follower)}
                      />,
                    ]
                    : follower.userId === activeUserID
                      ? [<CloseOutlined onClick={() => seeSkipModal(follower)} />]
                      : undefined
                }
              >
                <div
                  onClick={() =>
                    canSeeProfiles
                      ? history.push(`/userpage/main/${follower.userId}`)
                      : undefined
                  }
                  className={`cityMember ${canSeeProfiles || "notAccess"}`}
                >
                  {photosLoading ? (
                    <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                  ) : (
                    <Avatar
                      size={86}
                      src={follower.user.imagePath}
                      className="detailsIcon"
                    />
                  )}
                  <Card.Meta
                    className="detailsMeta"
                    title={extendedTitleTooltip(
                      parameterMaxLength,
                      `${follower.user.firstName} ${follower.user.lastName}`
                    )}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає прихильників станиці</Title>
          )}

        </div>
      )}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>
      {canEdit ||
        activeUserRoles.includes(Roles.Supporter) ||
        activeUserRoles.includes(Roles.PlastMember) ? (
        <ModalAddPlastDegree
          visibleModal={visibleAddModalDegree}
          setVisibleModal={setVisibleAddModalDegree}
          userId={selectedFollowerUID as string}
          handleAddDegree={handleAddDegree}
          isChangingUserDegree={false}
        ></ModalAddPlastDegree>
      ) : null}
    </Layout.Content>
  );
};

export default CityFollowers;
