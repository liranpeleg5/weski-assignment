import { hotelsService } from '../services/hotelsService';
import { MAX_GROUP_SIZE } from '../common/consts';

export const getHotels = async (resortId: number, groupSize: number, startDate: Date, endDate: Date) => {
    // Search for rooms that fit the group size and larger (e.g., if searching for 2 people, also get rooms for 3, 4, etc.)
    const groupSizes = [];
    for (let i = groupSize; i <= MAX_GROUP_SIZE; i++) {
        groupSizes.push(i);
    }

    const promises = groupSizes.map(size => 
        hotelsService.getHotels({ resortId, groupSize: size, startDate, endDate })
    );

    const results = await Promise.allSettled(promises);
    
    const hotels = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value)
        .flat();

    return hotels.sort((a, b) => a.price - b.price);
};

export const getHotelsProgressive = async (
    resortId: number, 
    groupSize: number, 
    startDate: Date, 
    endDate: Date,
    onUpdate: (hotels: any[]) => void
) => {
    const groupSizes = [];
    for (let i = groupSize; i <= MAX_GROUP_SIZE; i++) {
        groupSizes.push(i);
    }
    
    const seenHotels = new Map<string, any>();
    
    const promises = groupSizes.map(async (size) => {
        try {
            const hotels = await hotelsService.getHotels({ resortId, groupSize: size, startDate, endDate });
            
            hotels.forEach(hotel => {
                if (!seenHotels.has(hotel.id)) {
                    seenHotels.set(hotel.id, hotel);
                }
            });
            
            const allHotels = Array.from(seenHotels.values()).sort((a, b) => a.price - b.price);
            onUpdate(allHotels);
            
            return hotels;
        } catch (error) {
            return [];
        }
    });
    
    await Promise.allSettled(promises);
    
    return Array.from(seenHotels.values()).sort((a, b) => a.price - b.price);
};