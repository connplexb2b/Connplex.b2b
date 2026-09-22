import requests
import json
import datetime
import schedule
import time

API_URL = "https://www.theconnplex.com/api/conncloud/ahilyanagar-revenue"

def fetch_ahilyanagar_daily_revenue(from_date=None, to_date=None):
    if not from_date or not to_date:
        today = datetime.date.today().strftime("%Y-%m-%d")
        from_date = today
        to_date = today

    payload = {
        "CinemaID": "Ahilyanagar",
        "FromDate": from_date,
        "ToDate": to_date
    }

    try:
        response = requests.post(API_URL, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        if data.get("Status") == "1":
            res_data = data.get("data", {})
            summary = res_data.get("Summary", {})
            breakdown = res_data.get("DailyBreakdown", [])
            print(f"✅ Success: Gross Revenue = ₹{summary.get('TotalGrossRevenue'):,}")
            print(f"   • Box Office = ₹{summary.get('TotalTicketRevenue'):,}")
            print(f"   • F&B = ₹{summary.get('TotalFnBRevenue'):,}")
            print(f"   • Records found: {len(breakdown)} days")
            return res_data
        else:
            print("❌ Failed:", data.get("msg"))
    except Exception as e:
        print(f"❌ Connection error: {e}")

if __name__ == "__main__":
    # Fetch MTD on start
    fetch_ahilyanagar_daily_revenue("2026-09-01", "2026-09-20")

    # Schedule everyday at 06:00 AM
    schedule.every().day.at("06:00").do(fetch_ahilyanagar_daily_revenue)

    while True:
        schedule.run_pending()
        time.sleep(60)
