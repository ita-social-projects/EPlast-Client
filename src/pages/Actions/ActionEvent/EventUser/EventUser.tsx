import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    Modal,
    Button,
    Typography,
    Badge,
    Tooltip,
    Drawer,
    Tag,
    Input,
} from "antd";
import eventUserApi from "../../../../api/eventUserApi";
import EventsUser from "../../../../models/EventUser/EventUser";
import classes from "./EventUser.module.css";
import userApi from "../../../../api/UserApi";
import AuthStore from "../../../../stores/AuthStore";
import jwt from "jwt-decode";
import {
    CalendarOutlined,
    NotificationTwoTone,
    ToolTwoTone,
    FlagTwoTone,
} from "@ant-design/icons";
import moment from "moment";
import EventCreateDrawer from "../EventCreate/EventCreateDrawer";
import EventEditDrawer from "../EventEdit/EventEditDrawer";
import EventCalendar from "../EventCalendar/EventCalendar";
import Spinner from "../../../Spinner/Spinner";
import CreatedEvents from "../../../../models/EventUser/CreatedEvents";
import AvatarAndProgressStatic from "../../../userPage/personalData/AvatarAndProgressStatic";

const { Title } = Typography;
const userGenders = ["Чоловік", "Жінка", "Інша"];


const EventUser = () => {
    let user: any;
    let curToken = AuthStore.getToken() as string;
    user = jwt(curToken);
    let roles = user[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string[];

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>();
    const [createdEventsModal, setCreatedEventsModal] = useState(false);
    const [plannedEventsModal, setPlannedEventsModal] = useState(false);
    const [visitedEventsModal, setVisitedEventsModal] = useState(false);
    const { userId } = useParams();
    const [allEvents, setAllEvents] = useState<EventsUser>(new EventsUser());
    const [createdEvents, setCreatedEvents] = useState<CreatedEvents[]>([
        new CreatedEvents(),
    ]);
    const [currentUser, setCurrentUser] = useState<any>({});
    const [showEventCreateDrawer, setShowEventCreateDrawer] = useState(false);
    const [showEventCalendarDrawer, setShowEventCalendarDrawer] = useState(false);
    const [showEventEditDrawer, setShowEventEditDrawer] = useState(false);
    const [eventId, setEventId] = useState<number>();
    const [canCreate] = useState(!((roles == ["Прихильник"] || roles == ["Зареєстрований користувач"])
        || (roles.length === 2 && roles.includes("Прихильник") && roles.includes("Зареєстрований користувач"))));
    const [userToken, setUserToken] = useState<any>([
        {
            nameid: "",
        },
    ]);

    useEffect(() => {
        userApi.getById(userId).then(async (response) => {
            setCurrentUser(response.data.user);
        });
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = AuthStore.getToken() as string;
        setUserToken(jwt(token));
        await eventUserApi.getEventsUser(userId).then(async (response) => {
            setCreatedEvents(response.data);
            setAllEvents(response.data);
            await userApi
                .getImage(response.data.user.imagePath)
                .then((response: { data: any }) => {
                    setImageBase64(response.data);
                });

            setLoading(true);
        });
    };

    const setEventTypeName = (typeId: number) => {
        let name = "";
        if (typeId === 1) {
            name = "Акція";
        }
        if (typeId === 2) {
            name = "Вишкіл";
        }
        if (typeId === 3) {
            name = "Табір";
        }
        return name;
    };

    const setEventColor = (typeId: number) => {
        let color = "";
        if (typeId === 1) {
            color = "#6f8ab5";
        }
        if (typeId === 2) {
            color = "#fdcb02";
        }
        if (typeId === 3) {
            color = "#c01111";
        }
        return color;
    };

    const closeEventCalendarDrawer = () => setShowEventCalendarDrawer(false);

    const [searchedData, setSearchedData] = useState("");

    const filter = searchedData
        ? allEvents.createdEvents?.filter((item: any) => {
            return Object.values(item).find((element) => {
                return String(element)
                    .toLowerCase()
                    .includes(searchedData.toLowerCase());
            });
        })
        : allEvents.createdEvents;

    const handleSearch = (event: any) => {
        setSearchedData(event.target.value);
    };

    const newLocal = "#3c5438";
    return loading === false ? (
        <Spinner />
    ) : (
        <div className={classes.wrapper}>
            <div className={classes.wrapperImg}>
                <div className={classes.avatarWrapper}>
                    <AvatarAndProgressStatic
                        imageUrl={currentUser.imagePath}
                        time={currentUser.timeToJoinPlast}
                        firstName={currentUser.firstName}
                        lastName={currentUser.lastName}
                        isUserPlastun={true}
                        pseudo={currentUser.pseudo}
                        city={currentUser.city}
                        club={currentUser.club}
                        cityId={currentUser.cityId}
                        clubId={currentUser.clubId}
                    />
                </div>
                {userToken.nameid === userId && canCreate && (
                    <Button
                        type="primary"
                        className={classes.buttonInside}
                        style={{ marginBottom: "15px" }}
                        onClick={() => setShowEventCreateDrawer(true)}
                    >
                        Створити подію
                    </Button>
                )}
            </div>

            <div className={classes.wrapperCol}>
                <div className={classes.wrapper}>
                    <div className={classes.wrapper2}>
                        <Title level={2}> Відвідані події </Title>
                        {allEvents.visitedEvents?.length === 0 &&
                            userToken.nameid !== userId && (
                                <h2>
                                    {allEvents?.user.firstName} {allEvents?.user.lastName} ще не
                                    { userGenders[0] === currentUser.gender?.name ? (<> відвідав</>) :
                                        userGenders[1] === currentUser.gender?.name ? (<> відвідала</>) :
                                            (<> відвідав(ла)</>)} жодної події
                                </h2>
                            )}
                        {allEvents?.visitedEvents?.length === 0 &&
                            userToken.nameid === userId && (
                                <h2>Ви ще не відвідали жодної події</h2>
                            )}
                        {allEvents?.visitedEvents?.length !== 0 && (
                            <div>
                                <Badge
                                    count={allEvents?.visitedEvents?.length}
                                    style={{ backgroundColor: newLocal }}
                                />
                                <br />
                                <Button
                                    type="primary"
                                    className={classes.buttonInside}
                                    onClick={() => setVisitedEventsModal(true)}
                                >
                                    Список
                                </Button>
                            </div>
                        )}
                        <Modal
                            title="Відвідані події"
                            centered
                            visible={visitedEventsModal}
                            className={classes.modal}
                            onCancel={() => setVisitedEventsModal(false)}
                            footer={[
                                <Button
                                    type="primary"
                                    className={classes.buttonSmall}
                                    style={{ marginRight: "110px", marginLeft: "110px" }}
                                    onClick={() => setVisitedEventsModal(false)}
                                >
                                    Закрити
                                </Button>,
                            ]}
                        >
                            {allEvents?.visitedEvents?.map((item: any) => (
                                <div>
                                    <h1>{item.eventName} </h1>
                                    <h2>
                                        {" "}
                                        Дата початку:{" "}
                                        {moment(item.eventDateStart).format(
                                            "DD.MM.YYYY HH:mm"
                                        )}{" "}
                                    </h2>
                                    <h2>
                                        {" "}
                                        Дата завершення:{" "}
                                        {moment(item.eventDateEnd).format("DD.MM.YYYY HH:mm")}{" "}
                                    </h2>
                                    <Button
                                        type="primary"
                                        className={classes.buttonSmall}
                                        onClick={() => history.push(`/events/details/${item.id}`)}
                                    >
                                        Деталі
                                    </Button>
                                    <hr />
                                </div>
                            ))}
                        </Modal>
                    </div>
                    <div className={classes.wrapper3}>
                        <Title level={2}> Створені події </Title>
                        {allEvents.createdEvents.length === 0 &&
                            userToken.nameid === userId && (
                                <div>
                                    <h2>Ви ще не створили жодної події</h2>
                                    {canCreate &&
                                        <Button
                                            type="primary"
                                            className={classes.buttonInside}
                                            style={{ marginBottom: "15px" }}
                                            onClick={() => setShowEventCreateDrawer(true)}>
                                            Створити подію
                                </Button>}
                                </div>
                            )}
                        {allEvents.createdEvents.length !== 0 && (
                            <div>
                                <Badge
                                    count={allEvents.createdEvents.length}
                                    style={{ backgroundColor: "#3c5438" }}
                                />
                                <br />
                                <Button
                                    type="primary"
                                    className={classes.buttonInside}
                                    onClick={() => setCreatedEventsModal(true)}
                                >
                                    Список
                                </Button>
                            </div>
                        )}

                        <EventCreateDrawer
                            visibleEventCreateDrawer={showEventCreateDrawer}
                            setShowEventCreateDrawer={setShowEventCreateDrawer}
                            onCreate={fetchData}
                        />

                        {userToken.nameid !== userId &&
                            allEvents.createdEvents.length === 0 && (
                                <div>
                                    <h2>
                                        {allEvents?.user.firstName} {allEvents?.user.lastName} ще не
                                        {userGenders[0] === currentUser.gender?.name ? (<> створив</>) :
                                            userGenders[1] === currentUser.gender?.name ? (<> створила</>) :
                                                (<> створив(ла)</>)} жодної події
                                </h2>
                                </div>
                            )}
                        <Modal
                            title="Створені події"
                            centered
                            visible={createdEventsModal}
                            className={classes.modal}
                            onCancel={() => setCreatedEventsModal(false)}
                            footer={[
                                <div className={classes.Modal}>
                                    <Button
                                        type="primary"
                                        className={classes.buttonSmall}
                                        style={{ marginRight: "110px", marginLeft: "110px" }}
                                        onClick={() => setCreatedEventsModal(false)}
                                    >
                                        Закрити
                                    </Button>
                                </div>,
                            ]}
                        >
                            <Input.Search
                                placeholder="Пошук"
                                onChange={handleSearch}
                                enterButton
                            />
                            {filter.map((item: any) => (
                                <div>
                                    {item.eventStatusID === 3 && (
                                        <div className={classes.modalContent}>
                                            <h1>{item.eventName} </h1>
                                            <Tag
                                                color={setEventColor(item.eventTypeID)}
                                                className={classes.eventTag}
                                            >
                                                {setEventTypeName(item.eventTypeID)}
                                            </Tag>
                                            <Tooltip title="Затверджено">
                                                <NotificationTwoTone
                                                    className={classes.icon}
                                                    twoToneColor={newLocal}
                                                    key="approved"
                                                />
                                            </Tooltip>
                                        </div>
                                    )}
                                    {item.eventStatusID === 2 && (
                                        <div className={classes.modalContent}>
                                            <h1>{item.eventName} </h1>
                                            <Tag
                                                color={setEventColor(item.eventTypeID)}
                                                className={classes.eventTag}
                                            >
                                                {setEventTypeName(item.eventTypeID)}
                                            </Tag>
                                            <Tooltip title="Не затверджено">
                                                <ToolTwoTone
                                                    className={classes.icon}
                                                    twoToneColor={newLocal}
                                                    key="notApproved"
                                                />
                                            </Tooltip>
                                        </div>
                                    )}
                                    {item.eventStatusID === 1 && (
                                        <div className={classes.modalContent}>
                                            <h1>{item.eventName} </h1>
                                            <Tag
                                                color={setEventColor(item.eventTypeID)}
                                                className={classes.eventTag}
                                            >
                                                {setEventTypeName(item.eventTypeID)}
                                            </Tag>
                                            <Tooltip title="Затверджено">
                                                <FlagTwoTone
                                                    className={classes.icon}
                                                    twoToneColor={newLocal}
                                                    key="approved"
                                                />
                                            </Tooltip>
                                        </div>
                                    )}
                                    <h2>
                                        {" "}
                                        Дата початку:{" "}
                                        {moment(item.eventDateStart).format(
                                            "DD.MM.YYYY HH:mm"
                                        )}{" "}
                                    </h2>
                                    <h2>
                                        {" "}
                                        Дата завершення:{" "}
                                        {moment(item.eventDateEnd).format("DD.MM.YYYY HH:mm")}{" "}
                                    </h2>
                                    <Button
                                        type="primary"
                                        className={classes.buttonSmall}
                                        onClick={() => history.push(`/events/details/${item.id}`)}
                                    >
                                        Деталі
                                    </Button>
                                    {item.eventStatusID !== 1 && userToken.nameid === userId &&
                                        !(roles == ["Прихильник"] || roles == ["Зареєстований користувач"] || roles == ["Прихильник", "Зареєстований користувач"]) &&
                                        (
                                            <Button
                                                type="primary"
                                                className={classes.buttonSmall}
                                                onClick={() => {
                                                    setShowEventEditDrawer(true);
                                                    setEventId(item.id);
                                                }}
                                            >
                                                Редагувати
                                            </Button>
                                        )}
                                    <hr />
                                </div>
                            ))}
                            <EventEditDrawer
                                id={eventId!}
                                visibleEventEditDrawer={showEventEditDrawer}
                                setShowEventEditDrawer={setShowEventEditDrawer}
                                onEdit={fetchData}
                            />
                        </Modal>
                    </div>
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.wrapper4}>
                        <Title level={2} className={classes.sectionTitle}>
                            {" "}
                            Заплановані події{" "}
                        </Title>
                        {allEvents?.planedEvents?.length === 0 &&
                            userToken.nameid === userId && (
                                <div>
                                    <h2>Ви ще не запланували жодної події</h2>
                                    {roles != ["Зареєстрований користувач"] && <Button
                                        type="primary"
                                        className={classes.buttonInside}
                                        onClick={() => history.push("/events/types")}>
                                        Зголоситись на подію
                                </Button>}
                                </div>
                            )}
                        {allEvents?.planedEvents?.length === 0 &&
                            userToken.nameid !== userId && (
                                <h2>
                                    {allEvents?.user.firstName} {allEvents?.user.lastName} ще не
                                    {userGenders[0] === currentUser.gender?.name ? (<> запланував</>) :
                                            userGenders[1] === currentUser.gender?.name ? (<> запланувала</>) :
                                                (<> запланував(ла)</>)} жодної події
                                </h2>
                            )}
                        {allEvents?.planedEvents?.length !== 0 && (
                            <div>
                                <Badge
                                    count={allEvents?.planedEvents?.length}
                                    style={{ backgroundColor: "#3c5438" }}
                                />
                                <br />
                                <Button
                                    type="primary"
                                    className={classes.buttonInside}
                                    onClick={() => setPlannedEventsModal(true)}
                                >
                                    Список
                                </Button>
                            </div>
                        )}
                        <Modal
                            title="Заплановані події"
                            centered
                            visible={plannedEventsModal}
                            className={classes.modal}
                            onCancel={() => setPlannedEventsModal(false)}
                            footer={[
                                <Button
                                    type="primary"
                                    className={classes.buttonSmall}
                                    style={{ marginRight: "110px", marginLeft: "110px" }}
                                    onClick={() => history.push("/events/types")}
                                >
                                    Зголоситись на подію
                                </Button>,
                                <Button
                                    type="primary"
                                    className={classes.buttonSmall}
                                    style={{ marginRight: "110px", marginLeft: "110px" }}
                                    onClick={() => setPlannedEventsModal(false)}
                                >
                                    Закрити
                                </Button>,
                            ]}
                        >
                            {allEvents?.planedEvents?.map((item: any) => (
                                <div>
                                    <h1>{item.eventName} </h1>
                                    <h2>
                                        {" "}
                                        Дата початку:{" "}
                                        {moment(item.eventDateStart).format(
                                            "DD.MM.YYYY HH:mm"
                                        )}{" "}
                                    </h2>
                                    <h2>
                                        {" "}
                                        Дата завершення:{" "}
                                        {moment(item.eventDateEnd).format("DD.MM.YYYY HH:mm")}{" "}
                                    </h2>
                                    <Button
                                        type="primary"
                                        className={classes.buttonSmall}
                                        onClick={() => history.push(`/events/details/${item.id}`)}
                                    >
                                        Деталі
                                    </Button>
                                    <hr />
                                </div>
                            ))}
                        </Modal>
                    </div>
                    <div className={classes.wrapper5}>
                        <Title level={2} className={classes.sectionTitle}>
                            {" "}
                            Календар подій{" "}
                        </Title>
                        <CalendarOutlined
                            style={{ fontSize: "23px", marginBottom: "7.5px" }}
                        />
                        <Button
                            type="primary"
                            className={classes.buttonInside}
                            onClick={() => setShowEventCalendarDrawer(true)}
                        >
                            Переглянути
                        </Button>
                    </div>
                    <Drawer
                        title="Календар подій"
                        width="auto"
                        onClose={closeEventCalendarDrawer}
                        visible={showEventCalendarDrawer}
                        footer={null}
                        forceRender={true}
                    >
                        <EventCalendar />
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

export default EventUser;
