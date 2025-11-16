import mongoose from "mongoose";
import Listing from '../models/listing.js';
import {data} from './initdb.js';

const MONGO_URI = 'mongodb://localhost:27017/mydatabase';
main()
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}
async function initializeSampleData() {
    await Listing.deleteMany({});
    await Listing.create(data);
    console.log('Sample data initialized');
}

initializeSampleData();