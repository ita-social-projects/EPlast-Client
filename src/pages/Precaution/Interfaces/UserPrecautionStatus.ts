enum UserPrecautionStatus
{
    Accepted,
    Confirmed,
    Cancelled
}

export const userPrecautionStatusRecord: Record<UserPrecautionStatus, string> = {
    [UserPrecautionStatus.Accepted]: "Прийнято",
    [UserPrecautionStatus.Confirmed]: "Потверджено",
    [UserPrecautionStatus.Cancelled]: "Скасовано",
};

export const userPrecautionStatuses: Readonly<[UserPrecautionStatus, string][]> = Object.entries(userPrecautionStatusRecord)
    .map(([key, value]) => {
        const tuple: [UserPrecautionStatus, string] = [Number(key), value];
        return tuple;
    });

export const getUserPrecautionStatusStr = (status: UserPrecautionStatus) => {
   return userPrecautionStatuses.find(s => s[0] === status)?.[1]
}

export default UserPrecautionStatus;