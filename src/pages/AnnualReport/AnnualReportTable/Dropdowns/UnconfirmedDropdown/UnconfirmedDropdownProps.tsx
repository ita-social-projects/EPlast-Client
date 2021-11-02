interface Props {
    record: {
        id: number;
        status: number;
        cityId: number;
        cityName: string;
        regionName: string;
        date: Date;
        canManage: boolean;
    };
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    canManage: boolean;
    onView: (id: number) => Promise<void>;
    onViewPDF: (id: number) => Promise<void>;
    onEdit: (id: number) => void;
    onConfirm: (id: number) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
}

export default Props;
