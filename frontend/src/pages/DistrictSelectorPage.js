import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import DistrictSelector from '../components/DistrictSelector';
import MetricCard from '../components/MetricCard';
import ChartDisplay from '../components/ChartDisplay';
import { MapPin, Users, Briefcase, DollarSign } from 'lucide-react';
import './DistrictSelectorPage.css';

const DistrictSelectorPage = () => {
  const { selectedDistrict, setSelectedDistrict, fetchDistrictPerformance, metrics } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const handleDistrictSelect = async (district) => {
    setSelectedDistrict(district);
    setIsLoading(true);
    
    try {
      await fetchDistrictPerformance(district.districtId);
    } catch (error) {
      console.error('Failed to fetch district performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="district-selector-page">
      <div className="page-header">
        <h1>District Performance</h1>
        <p>Select a district to view detailed performance metrics</p>
      </div>

      <div className="selector-section">
        <h2>Choose a District</h2>
        <DistrictSelector
          onSelect={handleDistrictSelect}
          selectedDistrict={selectedDistrict}
          placeholder="Search and select a district..."
        />
      </div>

      {selectedDistrict && (
        <div className="district-details">
          <div className="district-header">
            <MapPin size={24} />
            <div>
              <h2>{selectedDistrict.districtName}</h2>
              <p>{selectedDistrict.stateName}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading district data...</p>
            </div>
          ) : (
            <>
              <div className="metrics-section">
                <h3>Performance Overview</h3>
                <div className="metrics-grid">
                  <MetricCard
                    title="Total Households"
                    value={metrics.reduce((sum, m) => sum + (m.totalHouseholds || 0), 0).toLocaleString()}
                    icon={Users}
                    color="blue"
                    description="Households registered for work"
                  />
                  <MetricCard
                    title="Persons Employed"
                    value={metrics.reduce((sum, m) => sum + (m.personsProvidedWork || 0), 0).toLocaleString()}
                    icon={Briefcase}
                    color="green"
                    description="People provided employment"
                  />
                  <MetricCard
                    title="Workdays Generated"
                    value={metrics.reduce((sum, m) => sum + (m.workdaysGenerated || 0), 0).toLocaleString()}
                    icon={Briefcase}
                    color="orange"
                    description="Total workdays created"
                  />
                  <MetricCard
                    title="Wages Paid"
                    value={`₹${metrics.reduce((sum, m) => sum + (m.wagesPaid || 0), 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="purple"
                    description="Total wages disbursed"
                  />
                </div>
              </div>

              <div className="chart-section">
                <ChartDisplay
                  type="overview"
                  data={metrics}
                  title="Performance Trends"
                  height={400}
                />
              </div>
            </>
          )}
        </div>
      )}

      {!selectedDistrict && (
        <div className="no-district-selected">
          <MapPin size={48} />
          <h3>Select a District</h3>
          <p>Choose a district from the dropdown above to view detailed performance data</p>
        </div>
      )}
    </div>
  );
};

export default DistrictSelectorPage;
