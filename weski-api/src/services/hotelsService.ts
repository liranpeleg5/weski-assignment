import { GetHotelsParams } from '../common/types';
import { availableProviders } from '../providers/providersIndex';

const getHotels = async ({ resortId, groupSize, startDate, endDate }: GetHotelsParams) => {
    const promises = availableProviders.map(provider => 
        provider.getHotels(resortId, groupSize, startDate, endDate)
    );

    const results = await Promise.all(promises);
    const hotels = results.flat().sort((a, b) => a.price - b.price);
    
    return hotels;
}

export const hotelsService = {
    getHotels
}