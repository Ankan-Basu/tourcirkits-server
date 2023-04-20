const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://devbros:2DevBros%40HITK@cluster0.5q9v57a.mongodb.net/?retryWrites=true&w=majority'

const dbURL2 = 'mongodb+srv://devbros:2DevBros%40HITK@cluster0.5q9v57a.mongodb.net/tours_database?retryWrites=true&w=majority'

const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log('Connecting to DB...');
const connectToDB = async () => {
  try {
    await mongoose.connect(dbURL2);
    await client.connect();
  } catch(err) {
    console.log(err);
  }
}

const db = 'tours_database';

module.exports = {connectToDB, client, db};