import distinction from './Distinction'
import { User } from '../../userPage/EditUserPage/Interface';
 interface UserDistinction {
     id: number;
     distinctionId: number;
     distinction: distinction;
     reporter: string;
     reason: string;
     date: string;
     userId: string;
     user: User
 }
 export default UserDistinction;