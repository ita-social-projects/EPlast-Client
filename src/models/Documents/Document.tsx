export type Document = {
    id: number;
    name: string;
    type: string;
    governingBody: string;
    description: string;
    date: Date;
    fileName: string | null;
}