interface Props {
    regionRecord: {
        id: number,
        regionId: number,
        regionName: string,
        date: Date,
        status: number,
        count: number,
        total: number,
        canManage: boolean;
    };
    pageX: number;
    pageY: number;
    canManage: boolean;
    showDropdown: boolean;
    onView: (id: number, year: number) => Promise<void>;
    onEdit: (id: number, year: number) => void;
    onConfirm: (id: number) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
}

export default Props;