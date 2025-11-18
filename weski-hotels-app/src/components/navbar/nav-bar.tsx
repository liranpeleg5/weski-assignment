import React from "react";
import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm from "../search-form/search-form";

interface NavBarProps {
    onSearch: (params: { resortId: number; groupSize: number; startDate: Date; endDate: Date }) => void;
    isSearching?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, isSearching = false }) => {
    return (
        <div className="nav-bar">
            <WeSkiLogo />
            <SearchForm onSearch={onSearch} isSearching={isSearching} />
        </div>
    );
}

export default NavBar;