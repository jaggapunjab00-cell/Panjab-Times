import connectDB from '../../../lib/mongodb';
import Metric from '../../../models/Metric';
import Article from '../../../models/Article';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const visitMetric = await Metric.findOne({ type: 'site_visits' });
      const visits = visitMetric ? visitMetric.count : 0;

      const articles = await Article.find({});
      const reads = articles.reduce((sum, a) => sum + (a.reads || 0), 0);

      return res.status(200).json({ success: true, visits, reads });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const metric = await Metric.findOneAndUpdate(
        { type: 'site_visits' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, visits: metric.count });
    } catch (error) {
      console.error('Error updating site visits:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
