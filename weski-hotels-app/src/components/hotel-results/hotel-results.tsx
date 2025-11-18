import React from 'react';
import './hotel-results.scss';
import { Hotel } from '../../services/api';

interface HotelResultsProps {
  hotels: Hotel[];
  isLoading: boolean;
  error: string | null;
  resortName?: string;
  startDate?: string;
  endDate?: string;
  groupSize?: number;
}

const HotelResults: React.FC<HotelResultsProps> = ({ hotels, isLoading, error, resortName, startDate, endDate, groupSize }) => {
  if (isLoading && hotels.length === 0) {
    return (
      <div className="hotel-results">
        <div className="hotel-results-loading">Searching for hotels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotel-results">
        <div className="hotel-results-error">Error: {error}</div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="hotel-results">
        <div className="hotel-results-empty">No hotels found. Try adjusting your search criteria.</div>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtitle = resortName && startDate && endDate && groupSize
    ? `${hotels.length} ski trips options • ${resortName} • ${formatDate(startDate)} - ${formatDate(endDate)} • ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`
    : `${hotels.length} hotel${hotels.length !== 1 ? 's' : ''} found`;

  return (
    <div className="hotel-results">
      <div className="hotel-results-header">
        <div className="hotel-results-title-section">
          <h1 className="hotel-results-title">Select your ski trip</h1>
          <p className="hotel-results-subtitle">{subtitle}</p>
        </div>
        {isLoading && <span className="hotel-results-updating">Updating results...</span>}
      </div>
      <div className="hotel-results-list">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-card-image">
              {hotel.imageUrl ? (
                <img 
                  src={hotel.imageUrl} 
                  alt={hotel.name}
                  className="hotel-card-image-img"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const placeholder = img.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <div 
                className="hotel-card-image-placeholder" 
                style={{ display: hotel.imageUrl ? 'none' : 'block' }}
              ></div>
            </div>
            <div className="hotel-card-content">
              <div className="hotel-card-header">
                <div className="hotel-card-info">
                  <h3 className="hotel-card-name">{hotel.name}</h3>
                  {hotel.rating && (
                    <div className="hotel-card-rating">
                      {Array.from({ length: hotel.rating }, (_, i) => (
                        <span key={i} className="hotel-card-star">★</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="hotel-card-details">
                {resortName && (
                  <div className="hotel-card-location">
                    <span className="hotel-card-location-icon">📍</span>
                    <span>{resortName}</span>
                  </div>
                )}
                {hotel.beds && (
                  <div className="hotel-card-beds">
                    {hotel.beds} {hotel.beds === 1 ? 'bed' : 'beds'}
                  </div>
                )}
              </div>
              <div className="hotel-card-footer">
                <div className="hotel-card-price-section">
                  <span className="hotel-card-price">{formatPrice(hotel.price)}</span>
                  <span className="hotel-card-price-label">/per person</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelResults;

