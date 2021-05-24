import { GoverningBody } from "../../api/decisionsApi";

export type DocumentPost = {
    id: number;
    name: string;
    type: number;
    governingBody: GoverningBody;
    description: string;
    date: Date;
    fileName: string | null;
}
