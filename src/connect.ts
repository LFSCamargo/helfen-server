import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://root:unibta2018A@ds018558.mlab.com:18558/unibtapet';

export function connectDatabase(): void {
  mongoose.connect(MONGO_URI);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB Connection error'));
  db.on('open', console.log.bind(console, 'Connected to mongo ⚡️'));
}
