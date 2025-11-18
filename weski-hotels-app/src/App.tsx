import React, { useState } from 'react'
import NavBar from './components/navbar/nav-bar'
import HotelResults from './components/hotel-results/hotel-results'
import { searchHotelsProgressive, Hotel } from './services/api'
import { resorts } from './common/constants'
import dayjs from 'dayjs'

const App: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<{ resortId: number; groupSize: number; startDate: string; endDate: string } | null>(null);

  const handleSearch = async (params: { resortId: number; groupSize: number; startDate: Date; endDate: Date }) => {
    setIsLoading(true);
    setError(null);
    setHotels([]);

    const formattedParams = {
      resortId: params.resortId,
      groupSize: params.groupSize,
      startDate: dayjs(params.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(params.endDate).format('YYYY-MM-DD'),
    };

    setSearchParams(formattedParams);

    try {
      await searchHotelsProgressive(
        formattedParams,
        (updatedHotels) => {
          setHotels(updatedHotels);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search hotels');
    } finally {
      setIsLoading(false);
    }
  };

  const resortName = searchParams ? resorts.find(r => r.id === searchParams.resortId)?.name : undefined;

  return (
    <div className='app'>
      <NavBar onSearch={handleSearch} isSearching={isLoading} />
      <HotelResults 
        hotels={hotels} 
        isLoading={isLoading} 
        error={error}
        resortName={resortName}
        startDate={searchParams?.startDate}
        endDate={searchParams?.endDate}
        groupSize={searchParams?.groupSize}
      />
    </div>
  )
}

export default App
