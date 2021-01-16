import { Organization } from "../../api/decisionsApi";

export type DocumentPost = {
    id: number;
    name: string;
    type: number;
    organization: Organization;
    description: string;
    date: string;
    fileName: string | null;
}