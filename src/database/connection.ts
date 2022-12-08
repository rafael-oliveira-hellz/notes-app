/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import logger from '../config/winston-logger';

const dbUrl = process.env.MONGODB_URI as string;

async function main() {
  await mongoose.connect(dbUrl);

  console.info('Connected to mongodb...', {
    label: 'MongoDB',
    function: 'connectDB',
    database: process.env.MONGODB_DATABASE as string,
    success: true,
  });
}

main()
  .then(() => {
    logger.info('Connected to mongodb...', {
      label: 'MongoDB',
      function: 'connectDB',
      database: process.env.MONGODB_DATABASE as string,
      success: true,
    });
  })
  .catch((err) => {
    logger.error('Error connecting to mongodb...', {
      label: 'MongoDB',
      function: 'connectDB',
      database: process.env.MONGODB_DATABASE as string,
      success: false,
      error: err,
    });
  });

export default mongoose;
