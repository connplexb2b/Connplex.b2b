async function run() {
  const url = "http://localhost:3000/api/hni-event";
  const payload = {
    "user_phone": "919561214185",
    "event_key": "hni-event",
    "payload": {
      "_id": "64df32813e8b03d23433ea2c",
      "guestName": "Jane Doe",
      "guestEmail": "janedoe@example.com",
      "guestPhone": "9876543211",
      "movie": "Toxic premier nights",
      "location": "Connplex Luxuriance – Adani Shantigram, Ahmedabad",
      "date": "18 July 2026",
      "time": "7:55 PM",
      "seats": ["Row A - Seat 7", "Row A - Seat 8"],
      "razorpay_order_id": "order_HniXYZ789",
      "razorpay_payment_id": "pay_HniABC012",
      "amount": 1000,
      "status": "Paid",
      "createdAt": "2026-08-21T08:06:00.000Z",
      "updatedAt": "2026-08-21T08:06:00.000Z"
    }
  };

  try {
    console.log("Sending POST request to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response body:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("HTTP request failed:", err.message);
  }
}

run();
