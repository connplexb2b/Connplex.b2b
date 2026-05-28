import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '..', 'Downloads', 'b2b-website-main', 'b2b-website-main', 'backend', '.env') });

const mongoURI = process.env.MONGO_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function printAll() {
  try {
    await mongoose.connect(mongoURI);
    const db = mongoose.connection.db;
    
    const feedbackList = await db.collection('feedbacks').find().toArray();
    console.log('--- FEEDBACKS ---');
    console.log(JSON.stringify(feedbackList, null, 2));
    
    const careerList = await db.collection('careerapplications').find().toArray();
    console.log('--- CAREERS ---');
    console.log(JSON.stringify(careerList, null, 2));
    
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

printAll();
