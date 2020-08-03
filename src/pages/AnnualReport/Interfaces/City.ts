import Region from './Region';

interface City {
    id: number;
    name: string;
    regionId: number;
    region: Region | null;
}

export default City;