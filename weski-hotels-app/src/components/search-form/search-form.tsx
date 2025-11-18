import React, {useState} from "react";
import "./search-form.scss";
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

interface SearchFormProps {
    onSearch: (params: { resortId: number; groupSize: number; startDate: Date; endDate: Date }) => void;
    isSearching?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isSearching = false }) => {
    const [skiSiteId, setSkiSiteId] = useState<number>(1);
    const [groupSize, setGroupSize] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
    const [endDate, setEndDate] = useState<Date | null>(dayjs().add(7, 'days').toDate());

    const handleResortChange = (resortId: number) => {
        setSkiSiteId(resortId);
    };

    const handleGroupSizeChange = (size: number) => {
        setGroupSize(size);
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            return;
        }

        onSearch({
            resortId: skiSiteId,
            groupSize,
            startDate,
            endDate,
        });
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <ResortsSelect value={skiSiteId} onChange={handleResortChange} />
            <GuestsSelect value={groupSize} onChange={handleGroupSizeChange} />
            
            <DatePicker 
                className="search-form-date-picker" 
                selected={startDate} 
                onChange={handleStartDateChange} 
                enableTabLoop={false}
            />
            <DatePicker 
                className="search-form-date-picker" 
                selected={endDate} 
                onChange={handleEndDateChange} 
                enableTabLoop={false}
            />

            <SearchButton disabled={isSearching} />
        </form>
    );
}

export default SearchForm;