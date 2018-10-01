import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost/nodeibta'

export function connectDatabase(): void {
  mongoose.connect(MONGO_URI)
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB Connection error"));
  db.on("open", console.log.bind(console, 'Connected to mongo ⚡️'));
}