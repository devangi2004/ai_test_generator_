// Load env variables (Render automatically provides them)
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect Database
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Create default admin if not exists
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPass = process.env.DEFAULT_ADMIN_PASSWORD;

    if (adminEmail && adminPass) {
      const existing = await User.findOne({ email: adminEmail });

      if (!existing) {
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPass,
          role: 'admin'
        });

        console.log('👑 Default admin created:', adminEmail);
      }
    }

    // Start Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing'}`);
    });

  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

// Handle crashes properly (Render friendly)
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

start();
