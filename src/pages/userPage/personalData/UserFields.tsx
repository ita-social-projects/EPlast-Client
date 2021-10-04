import React, { useState, useEffect, useContext } from "react";
import { Alert, Button, Form, Input, Skeleton, Tooltip } from "antd";
import userApi from "../../../api/UserApi";
import moment from "moment";
import { Data, User } from "../Interface/Interface";
import { useParams, useHistory } from "react-router-dom";
import notificationLogic from "../../../components/Notifications/Notification";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import Facebook from "../../../assets/images/facebookGreen.svg";
import Twitter from "../../../assets/images/birdGreen.svg";
import Instagram from "../../../assets/images/instagramGreen.svg";
import { StickyContainer } from "react-sticky";
import AvatarAndProgressStatic from "./AvatarAndProgressStatic";
import { Roles } from "../../../models/Roles/Roles";
import UserApi from "../../../api/UserApi";
import { UserProfileContext } from "./PersonalData";

export default function () {
  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const {userProfile, ChangeUserProfile, UpdateUserProfile} = useContext(UserProfileContext);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [activeUserProfile, setActiveUserProfile] = useState<User>();

  const fetchData = async () => {
    const actUserId = await UserApi.getActiveUserId();
    setActiveUserId(actUserId);

    const userRoles = UserApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);

    const userProfile = await UserApi.getActiveUserProfile();
    setActiveUserProfile(userProfile);

    await userApi
      .getUserProfileById(actUserId, userId)
      .then((response) => {
        setLoading(true);
        if(ChangeUserProfile) ChangeUserProfile(response.data);
        response.data?.user
          ? PsevdonimCreator.setPseudonimLocation(
              `${response.data?.user.firstName}${response.data?.user.lastName}`,
              userId
            )
          : PsevdonimCreator.setPseudonimLocation(
              `${response.data?.shortUser.firstName}${response.data?.shortUser.lastName}`,
              userId
            );
      })
      .catch((error) => {
        notificationLogic("error", error.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userId]);
  return loading === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : userProfile?.user !== null ? (
    <div className="container">
      <Form name="basic" className="formContainer">
        <div className="wrapperContainer">
          {activeUserProfile?.gender.name === null && (
            <Alert
              className="alertWrapper"
              message="Попередження"
              description="Заповніть обов'язкові поля профілю українською мовою"
              type="warning"
              showIcon
            />
          )}
          {activeUserProfile?.city === null && (
            <Alert
              className="alertWrapper"
              message="Попередження"
              description="Оберіть станицю та доєднайтеся до неї"
              type="warning"
              showIcon
            />
          )}

          <div className="avatarWrapperUserFields">
            <StickyContainer className="kadraWrapper">
              <AvatarAndProgressStatic
                imageUrl={userProfile?.user.imagePath as string}
                time={userProfile?.timeToJoinPlast}
                firstName={userProfile?.user.firstName}
                lastName={userProfile?.user.lastName}
                isUserPlastun={userProfile?.isUserPlastun}
                pseudo={userProfile?.user.pseudo}
                governingBody={userProfile?.user.governingBody}
                region={userProfile?.user.region}
                city={userProfile?.user.city}
                club={userProfile?.user.club}
                cityId={userProfile?.user.cityId}
                clubId={userProfile?.user.clubId}
                regionId={userProfile?.user.regionId}
                governingBodyId={userProfile?.user.governingBodyId}
                cityMemberIsApproved={userProfile?.user.cityMemberIsApproved}
                clubMemberIsApproved={userProfile?.user.clubMemberIsApproved}
                showPrecautions = {userProfile?.shortUser === null}
              />
            </StickyContainer>
          </div>
        </div>

        <div className="allFields">
          <div className="rowBlock">
            <Form.Item label="Ім`я" className="formItem">
              {userProfile?.user.firstName !== null && userProfile?.user.firstName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.firstName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Прізвище" className="formItem">
              {userProfile?.user.lastName !== null && userProfile?.user.lastName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.lastName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="По-батькові" className="formItem">
              {userProfile?.user.fatherName !== null &&
              userProfile?.user.fatherName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.fatherName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Стать" className="formItem">
              {userProfile?.user.gender.name !== null &&
              userProfile?.user.gender.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.gender.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Псевдо" className="formItem">
              {userProfile?.user.pseudo !== null && userProfile?.user.pseudo !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.pseudo}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Пошта" className="formItem">
              {userProfile?.user.email !== null && userProfile?.user.email !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.email}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Дата народження" className="formItem">
              {userProfile?.user.birthday !== null &&
              userProfile?.user.birthday.toString() !== "0001-01-01T00:00:00" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={moment.utc(userProfile?.user.birthday).local().format("DD.MM.YYYY")}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Номер телефону" className="formItem">
              {userProfile?.user.phoneNumber !== null &&
              userProfile?.user.phoneNumber !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.phoneNumber}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Національність" className="formItem">
              {userProfile?.user.nationality.name !== null &&
              userProfile?.user.nationality.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.nationality.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Віровизнання" className="formItem">
              {userProfile?.user.religion.name !== null &&
              userProfile?.user.religion.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.religion.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Навчальний заклад" className="formItem">
              {userProfile?.user.education.placeOfStudy !== null &&
              userProfile?.user.education.placeOfStudy !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.education.placeOfStudy}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Спеціальність" className="formItem">
              {userProfile?.user.education.speciality !== null &&
              userProfile?.user.education.speciality !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.education.speciality}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Навчальний ступінь" className="formItem">
              {userProfile?.user.degree.name !== null &&
              userProfile?.user.degree.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.degree.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Місце праці" className="formItem">
              {userProfile?.user.work.placeOfwork !== null &&
              userProfile?.user.work.placeOfwork !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.work.placeOfwork}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Посада" className="formItem">
              {userProfile?.user.work.position !== null &&
              userProfile?.user.work.position !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.work.position}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Адреса проживання" className="formItem">
              {userProfile?.user.address !== null && userProfile?.user.address !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.address}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item
              label="Громадська, політична діяльність"
              className="formItem"
            >
              {userProfile?.user.publicPoliticalActivity !== null &&
              userProfile?.user.publicPoliticalActivity !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.user.publicPoliticalActivity}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Ступінь в УПЮ" className="formItem">
              {userProfile?.user.upuDegree.id === 1 ? (
                userProfile?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="не була в юнацтві"
                  />
                ) : userProfile?.user.gender.id === 1 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="не був в юнацтві"
                  />
                ) : (
                  <Input
                    readOnly
                    className="dataInput"
                    value="не бу-в/ла в юнацтві"
                  />
                )
              ) : userProfile?.user.upuDegree.id === 2 ? (
                userProfile?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка учасниця"
                  />
                ) : userProfile?.user.gender.id === 1 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластун учасник"
                  />
                ) : (
                  <Tooltip title = "пластун учасник/пластунка учасниця">
                    <Input
                      readOnly
                      className="dataInput"
                      value="пластун учасник/пластунка учасниця"
                    />
                  </Tooltip>
                )
              ) : userProfile?.user.upuDegree.id === 3 ? (
                userProfile?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка розвідувачка"
                  />
                ) : userProfile?.user.gender.id === 1 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластун розвідувач"
                  />
                ) : (
                  <Tooltip title = "пластун розвідувач/пластунка розвідувачка">
                    <Input
                      readOnly
                      className="dataInput"
                      value="пластун розвідувач/пластунка розвідувачка"
                    />
                  </Tooltip>
                )
              ) : userProfile?.user.upuDegree.id === 4 ? (
                userProfile?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка вірлиця"
                  />
                ) : userProfile?.user.gender.id === 1 ? (
                  <Input readOnly className="dataInput" value="пластун скоб" />
                ) : (
                  <Tooltip title = "пластун скоб/пластунка вірлиця">
                    <Input
                      readOnly
                      className="dataInput"
                      value="пластун скоб/пластунка вірлиця"
                    />
                  </Tooltip>
                )
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="links">
            {userProfile?.user.facebookLink !== null &&
            userProfile?.user.facebookLink !== "" ? (
              <a href={"https://www.facebook.com/" + userProfile?.user.facebookLink}>
                <img src={Facebook} alt="Facebook" />
              </a>
            ) : null}
            {userProfile?.user.twitterLink !== null &&
            userProfile?.user.twitterLink !== "" ? (
              <a href={"https://www.twitter.com/" + userProfile?.user.twitterLink}>
                <img src={Twitter} alt="Twitter" />
              </a>
            ) : null}
            {userProfile?.user.instagramLink !== null &&
            userProfile?.user.instagramLink !== "" ? (
              <a href={"https://www.instagram.com/" + userProfile?.user.instagramLink}>
                <img src={Instagram} alt="Instagram" />
              </a>
            ) : null}
            {userProfile?.user.facebookLink === null ||
            (userProfile?.user.facebookLink === "" &&
              userProfile?.user.twitterLink === null) ||
            (userProfile?.user.twitterLink === "" &&
              userProfile?.user.instagramLink === null) ||
            userProfile?.user.instagramLink === "" ? (
              <Form.Item className="formItem"></Form.Item>
            ) : null}
          </div>
          <div className="buttonWrapper">
            <Button
              className="confirmBtn"
              hidden={
                !(
                  activeUserId === userId ||
                  activeUserRoles.includes(Roles.Admin)
                )
              }
              onClick={() => history.push(`/userpage/edit/${userId}`)}
            >
              Редагувати профіль
            </Button>
            <Button
              className="confirmBtn"
              hidden={
                !(
                  activeUserId === userId ||
                  activeUserRoles.includes(Roles.Admin)
                )
              }
              onClick={() => history.push(`/cities`)}
            >
              Обрати/змінити станицю
            </Button>
            <Button
              className="confirmBtn"
              hidden={
                !(
                  activeUserId === userId ||
                  activeUserRoles.includes(Roles.Admin)
                ) || activeUserRoles.includes(Roles.RegisteredUser)
              }
              onClick={() => history.push(`/clubs`)}
            >
              Обрати/змінити курінь
            </Button>
          </div>
        </div>
      </Form>
    </div>
  ) : userProfile.shortUser !== null ? (
    <div className="container">
      <Form name="basic" className="formContainer">
        <div className="shortAvatarWrapperUserFields">
          <AvatarAndProgressStatic
            imageUrl={userProfile?.shortUser.imagePath as string}
            time={userProfile?.timeToJoinPlast}
            firstName={userProfile?.shortUser.firstName}
            lastName={userProfile?.shortUser.lastName}
            isUserPlastun={userProfile?.isUserPlastun}
            pseudo={userProfile?.shortUser.pseudo}
            governingBody={userProfile?.shortUser.governingBody}
            region={userProfile?.shortUser.region}
            city={userProfile?.shortUser.city}
            club={userProfile?.shortUser.club}
            governingBodyId={userProfile?.shortUser.governingBodyId}
            regionId={userProfile?.shortUser.regionId}
            cityId={userProfile?.shortUser.cityId}
            clubId={userProfile?.shortUser.clubId}
            cityMemberIsApproved={userProfile?.shortUser.cityMemberIsApproved}
            clubMemberIsApproved={userProfile?.shortUser.clubMemberIsApproved}
            showPrecautions = { userProfile.shortUser === null }
          />
        </div>
        <div className="shortAllFields">
          <div className="shortRowBlock">
            <Form.Item label="Прізвище" className="shortFormItem">
              {userProfile?.shortUser.lastName !== null &&
              userProfile?.shortUser.lastName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.shortUser.lastName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Ім`я" className="shortFormItem">
              {userProfile?.shortUser.firstName !== null &&
              userProfile?.shortUser.firstName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.shortUser.firstName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="По-батькові" className="shortFormItem">
              {userProfile?.shortUser.fatherName !== null &&
              userProfile?.shortUser.fatherName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.shortUser.fatherName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Псевдо" className="shortFormItem">
              {userProfile?.shortUser.pseudo !== null &&
              userProfile?.shortUser.pseudo !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.shortUser.pseudo}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Ступінь в УПЮ" className="shortFormItem">
              {userProfile?.shortUser.upuDegree !== null ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={userProfile?.shortUser.upuDegree.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>
          <div className="links">
            {userProfile?.shortUser.facebookLink !== null &&
            userProfile?.shortUser.facebookLink !== "" ? (
              <a
                href={
                  "https://www.facebook.com/" + userProfile?.shortUser.facebookLink
                }
              >
                <img src={Facebook} alt="Facebook" />
              </a>
            ) : null}
            {userProfile?.shortUser.twitterLink !== null &&
            userProfile?.shortUser.twitterLink !== "" ? (
              <a
                href={"https://www.twitter.com/" + userProfile?.shortUser.twitterLink}
              >
                <img src={Twitter} alt="Twitter" />
              </a>
            ) : null}
            {userProfile?.shortUser.instagramLink !== null &&
            userProfile?.shortUser.instagramLink !== "" ? (
              <a
                href={
                  "https://www.instagram.com/" + userProfile?.shortUser.instagramLink
                }
              >
                <img src={Instagram} alt="Instagram" />
              </a>
            ) : null}
          </div>
        </div>
      </Form>
    </div>
  ) : (
    <> </>
  );
}

