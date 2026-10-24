import app from './app.js';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CompetitorX Backend Agent is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🐠 TinyFish API Integration: ${process.env.TINYFISH_API_KEY ? 'Active (Configured)' : 'Direct Web Agent Ready'}`);
  console.log(`===============================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
