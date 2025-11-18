import { IHotel } from '../common/types';

export interface IHotelProvider {
    getHotels: (resortId: number, groupSize: number, startDate: Date, endDate: Date) => Promise<IHotel[]>;
}