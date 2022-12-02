/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const dbUrl = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.info('Connected to mongodb...', {
      label: 'MongoDB',
      function: 'connectDB',
      database: process.env.MONGODB_DATABASE as string,
      success: true,
    });
  } catch (error: Error | any) {
    console.error('Failed to connect to mongodb', {
      label: 'MongoDB',
      function: 'connectDB',
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      success: false,
    });
    setTimeout(connectDB, 5000);
  }
};

// close the database connection
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.info('Disconnected from mongodb...', {
      label: 'MongoDB',
      function: 'closeDB',
      database: process.env.MONGODB_DATABASE as string,
      success: true,
    });
  } catch (error: Error | any) {
    console.error('Failed to disconnect from mongodb', {
      label: 'MongoDB',
      function: 'closeDB',
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      success: false,
    });
  }
};
