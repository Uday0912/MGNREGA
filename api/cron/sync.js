/**
 * Vercel Cron Job - Data Sync
 * Runs daily at 2 AM UTC to sync data from data.gov.in API
 */

const connectDB = require('../../backend/config/db-serverless');
const { fetchDataFromAPI } = require('../../backend/utils/fetchData');
const Metrics = require('../../backend/models/Metrics');
const District = require('../../backend/models/District');

module.exports = async (req, res) => {
  // Verify it's a cron request
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Connect to database
    await connectDB();

    // Check if data is recent (within last 24 hours)
    const recentData = await Metrics.findOne({
      lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentData) {
      return res.json({
        success: true,
        message: 'Data is already up to date',
        lastUpdated: recentData.lastUpdated,
        timestamp: new Date().toISOString()
      });
    }

    // Fetch fresh data from API
    console.log('Starting data sync...');
    const apiData = await fetchDataFromAPI();

    if (!apiData || apiData.length === 0) {
      return res.status(503).json({
        success: false,
        error: 'No data available from API',
        timestamp: new Date().toISOString()
      });
    }

    // Process and save data
    let processedCount = 0;
    let errorCount = 0;

    for (const record of apiData) {
      try {
        // Update or create metrics record
        await Metrics.findOneAndUpdate(
          {
            districtId: record.districtId,
            year: record.year,
            month: record.month
          },
          record,
          { upsert: true, new: true }
        );
        processedCount++;
      } catch (error) {
        console.error('Error processing record:', error);
        errorCount++;
      }
    }

    console.log(`Sync completed: ${processedCount} processed, ${errorCount} errors`);

    return res.json({
      success: true,
      message: 'Data synchronization completed',
      processed: processedCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron sync error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to sync data from API',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

