import Precaution from './Precaution'
import User from '../../Distinction/Interfaces/User'
type UserPrecaution = {
    id: number;
    precautionId: number;
    precaution: Precaution;
    reporter: string;
    reason: string;
    status: string;
    number: number;
    date: Date;
    userId: string;
    user: User
}
export default UserPrecaution;