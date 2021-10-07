import CityUser from "../../../models/City/CityUser";

interface SecretaryModel{
    id: number,
    user: CityUser,
    adminType: string,
    startDate: Date,
    endDate: Date,
    club?: {
        id: number,
        name: string
    },
    city?: {
        id: number,
        name: string
    },
    region?: {
        id: number,
        name: string
    },
    governingBody?: {
        id: number,
        name: string
    },
    sector?: {
        id: number,
        name: string
    }
}

export default SecretaryModel;