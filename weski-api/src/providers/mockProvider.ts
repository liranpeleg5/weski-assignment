import { IHotelProvider } from './types';
import { IHotel } from '../common/types';
import axios from 'axios';

const providerEndpoint = 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator'

const getHotels = async (resortId: number, groupSize: number, startDate: Date, endDate: Date): Promise<IHotel[]> => {
    // Format dates as MM/DD/YYYY
    const formatDate = (date: Date): string => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    const requestBody = {
        query: {
            ski_site: resortId,
            from_date: formattedStartDate,
            to_date: formattedEndDate,
            group_size: groupSize
        }
    };

    // Send request with correct format
    const response = await axios.post(providerEndpoint, requestBody);

    // Handle the response format: { statusCode: 200, body: { success: "true", accommodations: [...] } }
    const data = response.data;
    
    if (data.statusCode !== 200 || !data.body?.accommodations) {
        return [];
    }
    
    const hotels = data.body.accommodations.map((accommodation: any) => {
        let imageUrl: string | undefined;
        const images = accommodation.HotelDescriptiveContent?.Images;
        
        if (images && images.length > 0) {
            const mainImage = images.find((img: any) => img.MainImage === "True");
            imageUrl = mainImage?.URL || images[0]?.URL;
        }
        
        return {
            id: accommodation.HotelCode,
            name: accommodation.HotelName,
            price: parseFloat(accommodation.PricesInfo?.AmountAfterTax || '0'),
            beds: accommodation.HotelInfo?.Beds ? parseInt(accommodation.HotelInfo.Beds, 10) : undefined,
            imageUrl,
            rating: accommodation.HotelInfo?.Rating ? parseInt(accommodation.HotelInfo.Rating, 10) : undefined
        };
    });
    
    return hotels;
}

export const mockProvider: IHotelProvider = {
    getHotels
}