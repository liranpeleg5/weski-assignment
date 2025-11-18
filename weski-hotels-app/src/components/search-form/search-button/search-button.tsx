import React from "react";
import './search-button.scss';

interface Props {
    disabled?: boolean;
}

const SearchButton: React.FC<Props> = ({disabled = false}) => {
    return (
        <button 
            type="submit"
            className="search-button" 
            disabled={disabled}
        >
            {disabled ? 'Searching...' : 'Search'}
        </button>
    );
}

export default SearchButton;