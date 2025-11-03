const axios = require('axios');
const District = require('../models/District');
const Metrics = require('../models/Metrics');

const DATA_GOV_BASE_URL = process.env.DATA_GOV_BASE_URL || 'https://api.data.gov.in/resource';
const API_KEY = process.env.DATA_GOV_API_KEY;

// MGNREGA API endpoints (these would need to be updated with actual data.gov.in endpoints)
const ENDPOINTS = {
  districts: '/mgnrega-districts',
  employment: '/mgnrega-employment-data',
  works: '/mgnrega-works-data',
  wages: '/mgnrega-wages-data'
};

/**
 * Fetch data from data.gov.in API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - API response data
 */
const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const url = `${DATA_GOV_BASE_URL}${endpoint}`;
    const queryParams = {
      'api-key': API_KEY,
      format: 'json',
      limit: 1000,
      ...params
    };
    
    console.log(`Fetching data from: ${url}`);
    
    const response = await axios.get(url, {
      params: queryParams,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'User-Agent': 'MGNREGA-Data-Viz/1.0'
      }
    });
    
    if (response.data && response.data.records) {
      console.log(`Fetched ${response.data.records.length} records from ${endpoint}`);
      return response.data.records;
    }
    
    console.warn(`No records found in response from ${endpoint}`);
    return [];
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw new Error(`API request failed: ${error.message}`);
  }
};

/**
 * Process and normalize district data
 * @param {Array} rawData - Raw API data
 * @returns {Array} - Normalized district data
 */
const processDistrictData = (rawData) => {
  return rawData.map(record => ({
    districtId: record.district_id || record.districtId,
    districtName: record.district_name || record.districtName,
    stateName: record.state_name || record.stateName,
    stateCode: record.state_code || record.stateCode,
    coordinates: {
      latitude: parseFloat(record.latitude) || null,
      longitude: parseFloat(record.longitude) || null
    },
    population: parseInt(record.population) || null,
    area: parseFloat(record.area) || null
  })).filter(district => district.districtId && district.districtName);
};

/**
 * Process and normalize metrics data
 * @param {Array} rawData - Raw API data
 * @returns {Array} - Normalized metrics data
 */
const processMetricsData = (rawData) => {
  return rawData.map(record => {
    const year = parseInt(record.year) || new Date().getFullYear();
    const month = parseInt(record.month) || new Date().getMonth() + 1;
    
    // Calculate performance rates
    const employmentRate = record.total_households > 0 ? 
      (record.households_provided_work / record.total_households) * 100 : 0;
    const workCompletionRate = record.total_workdays > 0 ? 
      (record.workdays_generated / record.total_workdays) * 100 : 0;
    const wagePaymentRate = record.total_wages > 0 ? 
      (record.wages_paid / record.total_wages) * 100 : 0;
    
    return {
      districtId: record.district_id || record.districtId,
      districtName: record.district_name || record.districtName,
      stateName: record.state_name || record.stateName,
      year,
      month,
      financialYear: record.financial_year || `${year}-${(year + 1).toString().slice(-2)}`,
      totalHouseholds: parseInt(record.total_households) || 0,
      householdsDemandedWork: parseInt(record.households_demanded_work) || 0,
      householdsProvidedWork: parseInt(record.households_provided_work) || 0,
      totalPersons: parseInt(record.total_persons) || 0,
      personsDemandedWork: parseInt(record.persons_demanded_work) || 0,
      personsProvidedWork: parseInt(record.persons_provided_work) || 0,
      totalWorkdays: parseInt(record.total_workdays) || 0,
      workdaysGenerated: parseInt(record.workdays_generated) || 0,
      totalWages: parseFloat(record.total_wages) || 0,
      wagesPaid: parseFloat(record.wages_paid) || 0,
      materialCost: parseFloat(record.material_cost) || 0,
      administrativeCost: parseFloat(record.administrative_cost) || 0,
      employmentRate: Math.round(employmentRate * 100) / 100,
      workCompletionRate: Math.round(workCompletionRate * 100) / 100,
      wagePaymentRate: Math.round(wagePaymentRate * 100) / 100,
      dataSource: 'data.gov.in',
      lastUpdated: new Date()
    };
  }).filter(metrics => metrics.districtId);
};

/**
 * Fetch all MGNREGA data from API
 * @returns {Promise<Array>} - Combined data from all endpoints
 */
const fetchDataFromAPI = async () => {
  try {
    console.log('Starting data fetch from data.gov.in API...');
    
    if (!API_KEY) {
      throw new Error('DATA_GOV_API_KEY is not configured');
    }
    
    // Fetch data from multiple endpoints
    const [districtsData, employmentData, worksData, wagesData] = await Promise.allSettled([
      fetchFromAPI(ENDPOINTS.districts),
      fetchFromAPI(ENDPOINTS.employment),
      fetchFromAPI(ENDPOINTS.works),
      fetchFromAPI(ENDPOINTS.wages)
    ]);
    
    const results = {
      districts: districtsData.status === 'fulfilled' ? districtsData.value : [],
      employment: employmentData.status === 'fulfilled' ? employmentData.value : [],
      works: worksData.status === 'fulfilled' ? worksData.value : [],
      wages: wagesData.status === 'fulfilled' ? wagesData.value : []
    };
    
    console.log('Data fetch results:', {
      districts: results.districts.length,
      employment: results.employment.length,
      works: results.works.length,
      wages: results.wages.length
    });
    
    // Process and combine data
    const processedDistricts = processDistrictData(results.districts);
    const processedMetrics = processMetricsData([
      ...results.employment,
      ...results.works,
      ...results.wages
    ]);
    
    return {
      districts: processedDistricts,
      metrics: processedMetrics
    };
  } catch (error) {
    console.error('Error in fetchDataFromAPI:', error);
    throw error;
  }
};

/**
 * Sync districts data to database
 * @param {Array} districtsData - Processed districts data
 */
const syncDistricts = async (districtsData) => {
  try {
    console.log(`Syncing ${districtsData.length} districts...`);
    
    let syncedCount = 0;
    let errorCount = 0;
    
    for (const district of districtsData) {
      try {
        await District.findOneAndUpdate(
          { districtId: district.districtId },
          district,
          { upsert: true, new: true }
        );
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing district ${district.districtId}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Districts sync completed: ${syncedCount} synced, ${errorCount} errors`);
    return { syncedCount, errorCount };
  } catch (error) {
    console.error('Error syncing districts:', error);
    throw error;
  }
};

/**
 * Sync metrics data to database
 * @param {Array} metricsData - Processed metrics data
 */
const syncMetrics = async (metricsData) => {
  try {
    console.log(`Syncing ${metricsData.length} metrics records...`);
    
    let syncedCount = 0;
    let errorCount = 0;
    
    for (const metrics of metricsData) {
      try {
        await Metrics.findOneAndUpdate(
          {
            districtId: metrics.districtId,
            year: metrics.year,
            month: metrics.month
          },
          metrics,
          { upsert: true, new: true }
        );
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing metrics for ${metrics.districtId}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Metrics sync completed: ${syncedCount} synced, ${errorCount} errors`);
    return { syncedCount, errorCount };
  } catch (error) {
    console.error('Error syncing metrics:', error);
    throw error;
  }
};

/**
 * Full data synchronization
 * @returns {Promise<Object>} - Sync results
 */
const fullDataSync = async () => {
  try {
    console.log('Starting full data synchronization...');
    const startTime = Date.now();
    
    // Fetch data from API
    const apiData = await fetchDataFromAPI();
    
    if (!apiData.districts.length && !apiData.metrics.length) {
      throw new Error('No data received from API');
    }
    
    // Sync districts
    const districtResults = apiData.districts.length > 0 ? 
      await syncDistricts(apiData.districts) : { syncedCount: 0, errorCount: 0 };
    
    // Sync metrics
    const metricsResults = apiData.metrics.length > 0 ? 
      await syncMetrics(apiData.metrics) : { syncedCount: 0, errorCount: 0 };
    
    const duration = Date.now() - startTime;
    
    const results = {
      success: true,
      duration: `${Math.round(duration / 1000)}s`,
      districts: districtResults,
      metrics: metricsResults,
      timestamp: new Date()
    };
    
    console.log('Data synchronization completed:', results);
    return results;
  } catch (error) {
    console.error('Full data sync failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
  }
};

module.exports = {
  fetchDataFromAPI,
  fetchFromAPI,
  processDistrictData,
  processMetricsData,
  syncDistricts,
  syncMetrics,
  fullDataSync
};
