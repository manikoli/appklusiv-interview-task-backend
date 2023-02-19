import mongoose, { ConnectOptions } from 'mongoose';

export default function createDb() {
  const MONGODB_URI = 'mongodb://localhost:27017/appklusiv_db';

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  mongoose.set('strictQuery', true);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  return db;
}
