import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import './DistrictSelector.css';

const DistrictSelector = ({ onSelect, selectedDistrict, placeholder = "Select a district..." }) => {
  const { districts, loading, fetchDistricts } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    if (districts.length === 0) {
      fetchDistricts({ limit: 100 });
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = districts.filter(district =>
        district.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.stateName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts.slice(0, 50)); // Show first 50 by default
    }
  }, [districts, searchTerm]);

  const handleSelect = (district) => {
    if (onSelect && typeof onSelect === 'function') {
      onSelect(district);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayDistricts = searchTerm ? filteredDistricts : districts.slice(0, 50);

  return (
    <div className="district-selector">
      <div 
        className={`selector-trigger ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <div className="trigger-content">
          {selectedDistrict ? (
            <div className="selected-district">
              <MapPin size={16} />
              <span>{selectedDistrict.districtName}, {selectedDistrict.stateName}</span>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'rotated' : ''}`} />
      </div>

      {isOpen && (
        <div className="selector-dropdown">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search districts or states..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              autoFocus
            />
          </div>

          <div className="districts-list">
            {displayDistricts.length > 0 ? (
              displayDistricts.map((district) => (
                <div
                  key={district.districtId}
                  className={`district-item ${
                    selectedDistrict?.districtId === district.districtId ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(district)}
                >
                  <div className="district-info">
                    <div className="district-name">{district.districtName}</div>
                    <div className="district-state">{district.stateName}</div>
                  </div>
                  <MapPin size={14} />
                </div>
              ))
            ) : (
              <div className="no-results">
                <MapPin size={24} />
                <span>No districts found</span>
                <small>Try a different search term</small>
              </div>
            )}
          </div>

          {!searchTerm && districts.length > 50 && (
            <div className="dropdown-footer">
              <small>Showing first 50 districts. Use search to find specific districts.</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictSelector;
