import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartcut-builder';

    await mongoose.connect(mongoUri);

    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.warn('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};
