import React, { useState, useEffect } from "react";
import { Alert, Button, Form, Input, Skeleton } from "antd";
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

export default function () {
  const { userId } = useParams<{userId:string}>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const [activeUserRoles, setActiveUserRoles]=useState<string[]>([]);
  const [activeUserId, setActiveUserId]=useState<string>("");
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
        setData(response.data);
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
  )  
  : data?.user !== null ? (
    <div className="container">
      <Form name="basic" className="formContainer">
      
        <div className="wrapperContainer">

          {activeUserProfile?.gender.name === null &&
          <Alert
            className="alertWrapper"
            message="Попередження"
            description="Заповніть обов'язкові поля профілю українською мовою"
            type="warning"
            showIcon
          />}
          {activeUserProfile?.city === null &&
          <Alert
            className="alertWrapper"
            message="Попередження"
            description="Оберіть станицю та доєднайтеся до неї"
            type="warning"
            showIcon
          />}
          
          <div className="avatarWrapperUserFields">

          <StickyContainer className="kadraWrapper">
              <AvatarAndProgressStatic
                imageUrl={data?.user.imagePath}
                time={data?.timeToJoinPlast}
                firstName={data?.user.firstName}
                lastName={data?.user.lastName}
                isUserPlastun={data?.isUserPlastun}
                pseudo={data?.user.pseudo}
                governingBody={data?.user.governingBody}
                region={data?.user.region}
                city={data?.user.city}
                club={data?.user.club}
                cityId={data?.user.cityId}
                clubId={data?.user.clubId}
                regionId={data?.user.regionId}
                governingBodyId={data?.user.governingBodyId}
              />
            </StickyContainer>

          </div>
        </div>
      
        <div className="allFields">
          <div className="rowBlock">
            <Form.Item label="Ім`я" className="formItem">
              {data?.user.firstName !== null && data?.user.firstName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.firstName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Прізвище" className="formItem">
              {data?.user.lastName !== null && data?.user.lastName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.lastName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="По-батькові" className="formItem">
              {data?.user.fatherName !== null &&
              data?.user.fatherName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.fatherName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Стать" className="formItem">
              {data?.user.gender.name !== null &&
              data?.user.gender.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.gender.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Псевдо" className="formItem">
              {data?.user.pseudo !== null && data?.user.pseudo !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.pseudo}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Пошта" className="formItem">
              {data?.user.email !== null && data?.user.email !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.email}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Дата народження" className="formItem">
              {data?.user.birthday !== null &&
              data?.user.birthday.toString() !== "0001-01-01T00:00:00" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={moment(data?.user.birthday).format("DD.MM.YYYY")}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Номер телефону" className="formItem">
              {data?.user.phoneNumber !== null &&
              data?.user.phoneNumber !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.phoneNumber}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Національність" className="formItem">
              {data?.user.nationality.name !== null &&
              data?.user.nationality.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.nationality.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Віровизнання" className="formItem">
              {data?.user.religion.name !== null &&
              data?.user.religion.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.religion.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Навчальний заклад" className="formItem">
              {data?.user.education.placeOfStudy !== null &&
              data?.user.education.placeOfStudy !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.education.placeOfStudy}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Спеціальність" className="formItem">
              {data?.user.education.speciality !== null &&
              data?.user.education.speciality !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.education.speciality}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Навчальний ступінь" className="formItem">
              {data?.user.degree.name !== null &&
              data?.user.degree.name !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.degree.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Місце праці" className="formItem">
              {data?.user.work.placeOfwork !== null &&
              data?.user.work.placeOfwork !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.work.placeOfwork}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="rowBlock">
            <Form.Item label="Посада" className="formItem">
              {data?.user.work.position !== null &&
              data?.user.work.position !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.work.position}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Адреса проживання" className="formItem">
              {data?.user.address !== null && data?.user.address !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.address}
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
              {data?.user.publicPoliticalActivity !== null &&
              data?.user.publicPoliticalActivity !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.user.publicPoliticalActivity}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
            <Form.Item label="Ступінь в УПЮ" className="formItem">
              {data?.user.upuDegree.id === 1 ? (
                data?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="не була в юнацтві"
                  />
                ) : (
                  <Input
                    readOnly
                    className="dataInput"
                    value="не був в юнацтві"
                  />
                )
              ) : data?.user.upuDegree.id === 2 ? (
                data?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка учасниця"
                  />
                ) : (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластун учасник"
                  />
                )
              ) : data?.user.upuDegree.id === 3 ? (
                data?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка розвідувачка"
                  />
                ) : (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластун розвідувач"
                  />
                )
              ) : data?.user.upuDegree.id === 4 ? (
                data?.user.gender.id === 2 ? (
                  <Input
                    readOnly
                    className="dataInput"
                    value="пластунка вірлиця"
                  />
                ) : (
                  <Input readOnly className="dataInput" value="пластун скоб" />
                )
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="links">
            {data?.user.facebookLink !== null &&
            data?.user.facebookLink !== "" ? (
              <a href={"https://www.facebook.com/" + data?.user.facebookLink}>
                <img src={Facebook} alt="Facebook" />
              </a>
            ) : null}
            {data?.user.twitterLink !== null &&
            data?.user.twitterLink !== "" ? (
              <a href={"https://www.twitter.com/" + data?.user.twitterLink}>
                <img src={Twitter} alt="Twitter" />
              </a>
            ) : null}
            {data?.user.instagramLink !== null &&
            data?.user.instagramLink !== "" ? (
              <a href={"https://www.instagram.com/" + data?.user.instagramLink}>
                <img src={Instagram} alt="Instagram" />
              </a>
            ) : null}
            {data?.user.facebookLink === null ||
            (data?.user.facebookLink === "" &&
              data?.user.twitterLink === null) ||
            (data?.user.twitterLink === "" &&
              data?.user.instagramLink === null) ||
            data?.user.instagramLink === "" ? (
              <Form.Item className="formItem"></Form.Item>
            ) : null}
          </div>
          <div className="buttonWrapper">
            <Button
              className="confirmBtn"
              hidden={!(activeUserId === userId || activeUserRoles.includes(Roles.Admin))}
              onClick={() => history.push(`/userpage/edit/${userId}`)}
            >
              Редагувати профіль
            </Button>
            <Button
              className="confirmBtn"
              hidden={!(activeUserId === userId || activeUserRoles.includes(Roles.Admin))}
              onClick={() => history.push(`/cities`)}
            >
              Обрати/змінити станицю
            </Button>
            <Button
              className="confirmBtn" 
              hidden={!(activeUserId === userId || activeUserRoles.includes(Roles.Admin)) || activeUserRoles.includes(Roles.RegisteredUser)}
              onClick={() => history.push(`/clubs`)}
            >
              Обрати/змінити курінь
            </Button>
          </div>
        </div>
      </Form>
    </div>
  ) : data.shortUser !== null ? (
    <div className="container">
      <Form name="basic" className="formContainer">
        <div className="shortAvatarWrapperUserFields">
          <AvatarAndProgressStatic
            imageUrl={data?.shortUser.imagePath}
            time={data?.timeToJoinPlast}
            firstName={data?.shortUser.firstName}
            lastName={data?.shortUser.lastName}
            isUserPlastun={data?.isUserPlastun}
            pseudo={data?.shortUser.pseudo}
            governingBody={data?.shortUser.governingBody}
            region={data?.shortUser.region}
            city={data?.shortUser.city}
            club={data?.shortUser.club}
            governingBodyId={data?.shortUser.governingBodyId}
            regionId={data?.shortUser.regionId}
            cityId={data?.shortUser.cityId}
            clubId={data?.shortUser.clubId}
          />
        </div>
        <div className="shortAllFields">
          <div className="shortRowBlock">
            <Form.Item label="Прізвище" className="shortFormItem">
              {data?.shortUser.lastName !== null &&
              data?.shortUser.lastName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.shortUser.lastName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Ім`я" className="shortFormItem">
              {data?.shortUser.firstName !== null &&
              data?.shortUser.firstName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.shortUser.firstName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="По-батькові" className="shortFormItem">
              {data?.shortUser.fatherName !== null &&
              data?.shortUser.fatherName !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.shortUser.fatherName}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Псевдо" className="shortFormItem">
              {data?.shortUser.pseudo !== null &&
              data?.shortUser.pseudo !== "" ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.shortUser.pseudo}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>

          <div className="shortRowBlock">
            <Form.Item label="Ступінь в УПЮ" className="shortFormItem">
              {data?.shortUser.upuDegree !== null ? (
                <Input
                  readOnly
                  className="dataInput"
                  value={data?.shortUser.upuDegree.name}
                />
              ) : (
                <Input readOnly className="dataInput" value="-" />
              )}
            </Form.Item>
          </div>
          <div className="links">
            {data?.shortUser.facebookLink !== null &&
            data?.shortUser.facebookLink !== "" ? (
              <a href={data?.shortUser.facebookLink}>
                <img src={Facebook} alt="Facebook" />
              </a>
            ) : null}
            {data?.shortUser.twitterLink !== null &&
            data?.shortUser.twitterLink !== "" ? (
              <a href={data?.shortUser.twitterLink}>
                <img src={Twitter} alt="Twitter" />
              </a>
            ) : null}
            {data?.shortUser.instagramLink !== null &&
            data?.shortUser.instagramLink !== "" ? (
              <a href={data?.shortUser.instagramLink}>
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
