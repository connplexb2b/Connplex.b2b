const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collection = db.collection('contactmessages');

    const testId = new mongoose.Types.ObjectId();
    const payload = {
      _id: testId,
      fullName: "Test Franchise Lead",
      email: "inquiry@theconnplex.com",
      phone: "9999988888",
      state: "N/A",
      city: "Ahmedabad",
      preferredInvestment: "N/A",
      preferredCity: "Ahmedabad",
      company: "N/A",
      businessType: "N/A",
      hasProperty: "No",
      timeframe: "Immediate",
      message: "[Test Franchise Lead Payment Integration]",
      razorpay_order_id: "order_test_12345",
      razorpay_payment_id: "pay_test_67890",
      razorpay_signature: "sig_test_abcde",
      amountPaid: 1250000,
      paymentStatus: "Paid",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Inserting test lead entry with payment details...");
    await collection.insertOne(payload);

    console.log("Querying database to retrieve inserted entry...");
    const doc = await collection.findOne({ _id: testId });

    if (doc) {
      console.log("✅ Successfully retrieved document!");
      console.log(`- fullName: ${doc.fullName}`);
      console.log(`- phone: ${doc.phone}`);
      console.log(`- razorpay_order_id: ${doc.razorpay_order_id}`);
      console.log(`- razorpay_payment_id: ${doc.razorpay_payment_id}`);
      console.log(`- amountPaid: ${doc.amountPaid}`);
      console.log(`- paymentStatus: ${doc.paymentStatus}`);
      
      const verified = 
        doc.razorpay_order_id === "order_test_12345" &&
        doc.razorpay_payment_id === "pay_test_67890" &&
        doc.amountPaid === 1250000 &&
        doc.paymentStatus === "Paid";
      
      if (verified) {
        console.log("🎉 DATABASE INTEGRATION VERIFICATION SUCCESSFUL!");
      } else {
        console.log("❌ Database values mismatch!");
      }
    } else {
      console.log("❌ Failed to retrieve document!");
    }

    console.log("Cleaning up test document...");
    await collection.deleteOne({ _id: testId });
    console.log("Cleaned up successfully.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
