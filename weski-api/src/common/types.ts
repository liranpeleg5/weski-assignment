export interface IHotel {
    id: string;
    name: string;
    price: number;
    beds?: number;
    imageUrl?: string;
    rating?: number;
}

export interface GetHotelsParams {
    resortId: number;
    groupSize: number;
    startDate: Date;
    endDate: Date;
}