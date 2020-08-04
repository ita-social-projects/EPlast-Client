<<<<<<< HEAD
import { Region } from './Region';

export class City {
    id: number = 0;
    name: string = '';
    regionId: number = 0;
    region: Region = new Region();
}
=======
import Region from './Region';

interface City {
    id: number;
    name: string;
    regionId: number;
    region: Region | null;
}

export default City;
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
