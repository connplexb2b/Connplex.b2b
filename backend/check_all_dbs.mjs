import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '..', 'Downloads', 'b2b-website-main', 'b2b-website-main', 'backend', '.env') });

const mongoURI = process.env.MONGO_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function checkAllDbs() {
  try {
    await mongoose.connect(mongoURI);
    const adminDb = mongoose.connection.client.db().admin();
    const dbsList = await adminDb.listDatabases();
    
    console.log('--- ALL DATABASES ---');
    for (const dbInfo of dbsList.databases) {
      console.log(`\nDatabase: ${dbInfo.name}`);
      const clientDb = mongoose.connection.client.db(dbInfo.name);
      const collections = await clientDb.listCollections().toArray();
      
      for (const col of collections) {
        const count = await clientDb.collection(col.name).countDocuments();
        console.log(`  - Collection [${col.name}] has ${count} documents`);
        
        if (col.name === 'feedbacks' || col.name === 'careerapplications') {
          const sample = await clientDb.collection(col.name).find().sort({ _id: -1 }).limit(1).toArray();
          if (sample.length > 0) {
            console.log(`    Latest sample in ${dbInfo.name}.${col.name}:`, JSON.stringify(sample[0], null, 2));
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllDbs();
