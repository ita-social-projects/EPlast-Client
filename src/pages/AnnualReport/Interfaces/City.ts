import { Region } from './Region';

export class City {
    id: number = 0;
    name: string = '';
    regionId: number = 0;
    region: Region = new Region();
}