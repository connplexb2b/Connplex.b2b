'use client';

import React, { useState } from 'react';

interface AhilyanagarApiIntegrationProps {
  onNotification?: (msg: string) => void;
  defaultExpanded?: boolean;
}

export default function AhilyanagarApiIntegration({ 
  onNotification,
  defaultExpanded = true 
}: AhilyanagarApiIntegrationProps) {
  const [activeTab, setActiveTab] = useState<'endpoint' | 'nodejs' | 'python' | 'prompt' | 'sample'>('endpoint');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [serverHost, setServerHost] = useState('<YOUR_VISTA_SERVER_IP_OR_DOMAIN>');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const triggerToast = (msg: string) => {
    if (onNotification) {
      onNotification(msg);
    }
  };

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerToast(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded ${filename}`);
  };

  const effectiveBaseUrl = `http://${serverHost}/api.asmx`;
  const sampleGetUrl = `${effectiveBaseUrl}/GetDailyTicketAndFnbData?CinemaID=Ahilyanagar&Date=2026-09-08`;

  const rawHttpSnippet = `GET /api.asmx/GetDailyTicketAndFnbData?CinemaID=Ahilyanagar&Date=2026-09-08 HTTP/1.1
Host: ${serverHost.replace(/^https?:\/\//, '')}
Accept: application/json`;

  const nodeCodeSnippet = `const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');

// Configuration
const VISTA_BASE_URL = '${effectiveBaseUrl}';
const CINEMA_ID = 'Ahilyanagar';

/**
 * Fetch day-wise Ticket and F&B data for Ahilyanagar
 * @param {string} date - Date in 'YYYY-MM-DD' format (optional, defaults to today)
 */
async function fetchAhilyanagarDailyData(date = null) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    console.log(\`[\${new Date().toISOString()}] Fetching data for \${CINEMA_ID} on \${targetDate}...\`);

    const response = await axios.get(\`\${VISTA_BASE_URL}/GetDailyTicketAndFnbData\`, {
      params: {
        CinemaID: CINEMA_ID,
        Date: targetDate
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.Status === '1') {
      const { Cinema, QueryDate, Tickets, FnB } = response.data.data;
      console.log(\`✅ Success for \${Cinema.Cinema_strName || CINEMA_ID} on \${QueryDate}\`);
      console.log(\`   - Shows/Sessions found: \${Tickets.Sessions ? Tickets.Sessions.length : 0}\`);
      console.log(\`   - Movies found: \${Tickets.Films ? Tickets.Films.length : 0}\`);
      console.log(\`   - F&B Items found: \${FnB.Items ? FnB.Items.length : 0}\`);

      // Save to local JSON file or save to your project's database
      const fileName = \`ahilyanagar_\${QueryDate}.json\`;
      fs.writeFileSync(fileName, JSON.stringify(response.data.data, null, 2));
      console.log(\`📁 Data saved to \${fileName}\`);
      return response.data.data;
    } else {
      console.error('❌ API returned failure:', response.data.msg);
    }
  } catch (error) {
    console.error('❌ Request error:', error.response ? error.response.data : error.message);
  }
}

/**
 * Fetch data for a range of days (e.g. past 7 days or next 7 days)
 */
async function fetchDateRange(startDateStr, endDateStr) {
  let current = new Date(startDateStr);
  const end = new Date(endDateStr);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    await fetchAhilyanagarDailyData(dateStr);
    current.setDate(current.getDate() + 1);
  }
}

// 1. Run immediately for today on startup
fetchAhilyanagarDailyData();

// 2. Schedule everyday at 06:00 AM automatically
cron.schedule('0 6 * * *', () => {
  console.log('⏰ Running daily scheduled sync for Ahilyanagar...');
  fetchAhilyanagarDailyData();
});
`;

  const pythonCodeSnippet = `import requests
import json
import datetime
import schedule
import time

VISTA_BASE_URL = "${effectiveBaseUrl}"
CINEMA_ID = "Ahilyanagar"

def fetch_ahilyanagar_day_data(date_str=None):
    """
    Fetch day-wise data for Ahilyanagar.
    :param date_str: String in 'YYYY-MM-DD' format (defaults to today)
    """
    if not date_str:
        date_str = datetime.date.today().strftime("%Y-%m-%d")

    print(f"[{datetime.datetime.now()}] Fetching data for {CINEMA_ID} on date: {date_str}...")
    url = f"{VISTA_BASE_URL}/GetDailyTicketAndFnbData"
    params = {
        "CinemaID": CINEMA_ID,
        "Date": date_str
    }

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        if data.get("Status") == "1":
            payload = data.get("data", {})
            cinema = payload.get("Cinema", {})
            tickets = payload.get("Tickets", {})
            fnb = payload.get("FnB", {})

            print(f"✅ Success: {cinema.get('Cinema_strName', CINEMA_ID)}")
            print(f"   • Sessions/Shows: {len(tickets.get('Sessions', []))}")
            print(f"   • Movies: {len(tickets.get('Films', []))}")
            print(f"   • Ticket Price Tiers: {len(tickets.get('Prices', []))}")
            print(f"   • F&B Items: {len(fnb.get('Items', []))}")

            # Save to JSON file or your database
            filename = f"ahilyanagar_{date_str}.json"
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2)
            print(f"📁 Saved to {filename}")
            return payload
        else:
            print(f"❌ API returned error: {data.get('msg')}")
    except Exception as e:
        print(f"❌ Error fetching data: {e}")

# Fetch multiple days (e.g. today + next 6 days)
def fetch_upcoming_week():
    today = datetime.date.today()
    for i in range(7):
        target_day = (today + datetime.timedelta(days=i)).strftime("%Y-%m-%d")
        fetch_ahilyanagar_day_data(target_day)

if __name__ == "__main__":
    # 1. Fetch today's data immediately
    fetch_ahilyanagar_day_data()

    # 2. Schedule everyday at 06:00 AM
    schedule.every().day.at("06:00").do(fetch_ahilyanagar_day_data)
    print("🚀 Scheduler started. Waiting for next run...")

    while True:
        schedule.run_pending()
        time.sleep(60)
`;

  const promptSnippet = `I need to integrate a daily synchronization service in this project to fetch complete day-wise Ticket and Food & Beverage (F&B) data for our cinema location "Ahilyanagar".

### API Specifications:
- **Base Endpoint**: \`${effectiveBaseUrl}/GetDailyTicketAndFnbData\`
- **HTTP Method**: \`GET\`
- **Query Parameters**:
  - \`CinemaID\`: \`"Ahilyanagar"\`
  - \`Date\`: \`"YYYY-MM-DD"\` (Defaults to current date if omitted)
- **Response Format**: JSON:
  \`\`\`json
  {
    "Status": "1",
    "msg": "Success",
    "data": {
      "Cinema": {
        "Cinema_strID": "AH01",
        "Cinema_strName": "Connplex Luxuriance Ahilyanagar"
      },
      "QueryDate": "YYYY-MM-DD",
      "Tickets": {
        "Films": [ { "Film_strCode": "F001", "Film_strTitle": "Raftaar 2" } ],
        "Sessions": [ { "Session_lngID": "S101", "Film_strCode": "F001", "Session_dtmRealShow": "2026-09-08T18:30:00", "Screen_byteNum": 1 } ],
        "Prices": [ { "Price_strCode": "GLD", "Price_curAmount": 250.00 } ],
        "PricePackages": [ ]
      },
      "FnB": {
        "Items": [ { "Item_strID": "FB01", "Item_strName": "Salted Popcorn (L)", "Item_strDescription": "Fresh theatre style salted popcorn" } ],
        "ItemPrices": [ { "Item_strID": "FB01", "ItemPrice": 180.00 } ]
      }
    }
  }
  \`\`\`

### What You Need To Build in This Project:
1. **API Client Service**: A service method \`fetchAhilyanagarDailyData(date)\` that calls the above endpoint for \`CinemaID=Ahilyanagar\` with proper error handling, timeout (30s), and logging.
2. **Data Parser & Storage**: Parse the response and save/upsert the daily data into our database (or local JSON cache):
   - Movie titles and showtimes/sessions for the day.
   - Ticket categories and rates.
   - F&B items with their prices.
3. **Automated Daily Job**: Create a recurring daily cron job / scheduler that runs every day (e.g. at 06:00 AM) to automatically sync today's and upcoming showtimes & F&B menu for Ahilyanagar.
4. **Historical/Date-Range Utility**: A helper function to fetch and sync data for a custom date range (e.g. from \`startDate\` to \`endDate\`).

Replace ${serverHost} with the actual server IP or domain where this Vista WebService is deployed, and you are ready to run!`;

  const sampleJsonSnippet = `{
  "Status": "1",
  "msg": "Success",
  "data": {
    "Cinema": {
      "Cinema_strID": "AH01",
      "Cinema_strName": "Connplex Luxuriance Ahilyanagar"
    },
    "QueryDate": "2026-09-08",
    "Tickets": {
      "Films": [
        {
          "Film_strCode": "F101",
          "Film_strTitle": "Raftaar",
          "Film_strDuration": "152 mins",
          "Film_strRating": "UA"
        },
        {
          "Film_strCode": "F102",
          "Film_strTitle": "Cosmic Drift",
          "Film_strDuration": "145 mins",
          "Film_strRating": "U"
        }
      ],
      "Sessions": [
        {
          "Session_lngID": "91024",
          "Film_strCode": "F101",
          "Session_dtmRealShow": "2026-09-08T14:30:00",
          "Screen_byteNum": 1,
          "Screen_strName": "Screen 1 - Couple Recliner",
          "Seats_Available": 14,
          "Seats_Total": 20
        },
        {
          "Session_lngID": "91025",
          "Film_strCode": "F101",
          "Session_dtmRealShow": "2026-09-08T18:00:00",
          "Screen_byteNum": 1,
          "Screen_strName": "Screen 1 - Couple Recliner",
          "Seats_Available": 20,
          "Seats_Total": 20
        },
        {
          "Session_lngID": "91026",
          "Film_strCode": "F102",
          "Session_dtmRealShow": "2026-09-08T21:15:00",
          "Screen_byteNum": 2,
          "Screen_strName": "Screen 2 - Gold Recliner",
          "Seats_Available": 45,
          "Seats_Total": 60
        }
      ],
      "Prices": [
        {
          "Price_strCode": "REC_CPL",
          "Price_strDescription": "Couple Recliner Pair",
          "Price_curAmount": 700.00
        },
        {
          "Price_strCode": "GOLD",
          "Price_strDescription": "Gold Class Recliner",
          "Price_curAmount": 280.00
        }
      ],
      "PricePackages": []
    },
    "FnB": {
      "Items": [
        {
          "Item_strID": "FNB_POP_01",
          "Item_strName": "Classic Salted Popcorn (L)",
          "Item_strCategory": "Popcorn",
          "Item_strDescription": "Warm theatre-popped salted gourmet corn"
        },
        {
          "Item_strID": "FNB_BEV_01",
          "Item_strName": "Fountain Pepsi (XL)",
          "Item_strCategory": "Beverages",
          "Item_strDescription": "Chilled carbonated fountain drink"
        },
        {
          "Item_strID": "FNB_CMB_01",
          "Item_strName": "Couple Recliner Combo (L Popcorn + 2 Drinks)",
          "Item_strCategory": "Combos",
          "Item_strDescription": "Signature combo paired for 2 guests"
        }
      ],
      "ItemPrices": [
        {
          "Item_strID": "FNB_POP_01",
          "ItemPrice": 180.00
        },
        {
          "Item_strID": "FNB_BEV_01",
          "ItemPrice": 120.00
        },
        {
          "Item_strID": "FNB_CMB_01",
          "ItemPrice": 320.00
        }
      ]
    }
  }
}`;

  return (
    <div id="ahilyanagar-api-integration" className="bg-[#0e1422] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Subtle glow accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">
            <i className="fa-solid fa-server"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Ahilyanagar Location
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Daily Vista Sync Service
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 tracking-tight flex items-center gap-2">
              Day-Wise Ticket &amp; F&amp;B API Integration
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Everything you need to fetch complete daily movie sessions, tickets, and F&amp;B menus for Ahilyanagar in your other projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => copyToClipboard(sampleGetUrl, 'endpoint_url', 'Endpoint URL')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <i className={`fa-solid ${copiedKey === 'endpoint_url' ? 'fa-check text-emerald-400' : 'fa-link text-amber-400'}`}></i>
            <span>{copiedKey === 'endpoint_url' ? 'Copied URL!' : 'Copy API URL'}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-all"
          >
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            <span>{isExpanded ? 'Collapse' : 'Expand Docs'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Server Host Input Bar */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <i className="fa-solid fa-network-wired text-amber-400"></i>
              <span className="font-semibold">Vista Server IP / Domain:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                placeholder="e.g. 192.168.1.100:8080 or vista.yourdomain.com"
                className="px-3 py-1.5 rounded bg-black/60 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400 w-full sm:w-80"
              />
              <button
                onClick={() => setServerHost('<YOUR_VISTA_SERVER_IP_OR_DOMAIN>')}
                title="Reset to placeholder"
                className="px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-[10px]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-2">
            {[
              { id: 'endpoint', label: '1. API Endpoint Details', icon: 'fa-globe' },
              { id: 'nodejs', label: '2. Node.js (Daily Cron)', icon: 'fa-node-js' },
              { id: 'python', label: '2. Python (Daily Schedule)', icon: 'fa-python' },
              { id: 'prompt', label: '3. AI Developer Prompt', icon: 'fa-robot' },
              { id: 'sample', label: 'Response JSON Schema', icon: 'fa-code' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-amber-400' : 'text-gray-500'}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: API ENDPOINT DETAILS */}
          {activeTab === 'endpoint' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Method & Base URL */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">HTTP METHOD &amp; BASE URL</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      GET / POST
                    </span>
                    <span className="text-xs text-gray-300 font-mono">REST / ASMX</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-amber-200 break-all select-all">
                    {effectiveBaseUrl}/GetDailyTicketAndFnbData
                  </div>
                </div>

                {/* Query Parameters */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 lg:col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">QUERY PARAMETERS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-black/50 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-400">CinemaID</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Required</span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong className="text-white">Ahilyanagar</strong> (or cinema code e.g. <code className="text-amber-300">AH01</code> / <code className="text-amber-300">CL...</code> — API auto-resolves matching names).
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-400">Date</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-300">Optional</span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        Format: <code className="text-white">YYYY-MM-DD</code> (e.g. <code className="text-amber-300">2026-09-08</code>). Automatically defaults to today if omitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact HTTP Request */}
              <div className="rounded-xl bg-black/60 border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="text-xs font-mono text-gray-400 ml-2">HTTP 1.1 Request Preview</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(rawHttpSnippet, 'http_req', 'HTTP Request')}
                    className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1.5"
                  >
                    <i className={`fa-solid ${copiedKey === 'http_req' ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                    <span>{copiedKey === 'http_req' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto selection:bg-amber-500/30">
                  {rawHttpSnippet}
                </pre>
              </div>

              {/* Highlights badge bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-gray-300">
                  <i className="fa-solid fa-ticket text-amber-400"></i>
                  <span>Sessions &amp; Recliner Layouts</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-gray-300">
                  <i className="fa-solid fa-burger text-blue-400"></i>
                  <span>F&amp;B Menu Items &amp; Price Tiers</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-gray-300">
                  <i className="fa-solid fa-clock text-emerald-400"></i>
                  <span>06:00 AM Automated Daily Scheduling</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NODE.JS / JAVASCRIPT */}
          {activeTab === 'nodejs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <i className="fa-brands fa-npm text-red-500 text-base"></i>
                  <span>Dependencies required:</span>
                  <code className="px-2 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[11px] border border-white/10">
                    npm install axios node-cron
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard('npm install axios node-cron', 'npm_cmd', 'Install Command')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] border border-white/10"
                  >
                    <i className={`fa-solid ${copiedKey === 'npm_cmd' ? 'fa-check text-emerald-400' : 'fa-copy'} mr-1`}></i>
                    {copiedKey === 'npm_cmd' ? 'Copied' : 'Copy Command'}
                  </button>
                  <button
                    onClick={() => downloadFile(nodeCodeSnippet, 'ahilyanagar_sync.js', 'application/javascript')}
                    className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] border border-blue-500/30"
                  >
                    <i className="fa-solid fa-download mr-1"></i>
                    Download .js
                  </button>
                  <button
                    onClick={() => copyToClipboard(nodeCodeSnippet, 'node_code', 'Node.js Code')}
                    className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40"
                  >
                    <i className={`fa-solid ${copiedKey === 'node_code' ? 'fa-check text-emerald-400' : 'fa-copy'} mr-1`}></i>
                    {copiedKey === 'node_code' ? 'Copied Script!' : 'Copy Full Code'}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-black/70 border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="ml-2 text-white">ahilyanagar_sync.js</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Includes Immediate Sync + 06:00 AM Cron</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-gray-200 overflow-x-auto leading-relaxed max-h-[460px] cc-scrollbar">
                  {nodeCodeSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON */}
          {activeTab === 'python' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <i className="fa-brands fa-python text-yellow-400 text-base"></i>
                  <span>Dependencies required:</span>
                  <code className="px-2 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[11px] border border-white/10">
                    pip install requests schedule
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard('pip install requests schedule', 'pip_cmd', 'Install Command')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] border border-white/10"
                  >
                    <i className={`fa-solid ${copiedKey === 'pip_cmd' ? 'fa-check text-emerald-400' : 'fa-copy'} mr-1`}></i>
                    {copiedKey === 'pip_cmd' ? 'Copied' : 'Copy Command'}
                  </button>
                  <button
                    onClick={() => downloadFile(pythonCodeSnippet, 'ahilyanagar_sync.py', 'text/x-python')}
                    className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] border border-blue-500/30"
                  >
                    <i className="fa-solid fa-download mr-1"></i>
                    Download .py
                  </button>
                  <button
                    onClick={() => copyToClipboard(pythonCodeSnippet, 'py_code', 'Python Code')}
                    className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40"
                  >
                    <i className={`fa-solid ${copiedKey === 'py_code' ? 'fa-check text-emerald-400' : 'fa-copy'} mr-1`}></i>
                    {copiedKey === 'py_code' ? 'Copied Script!' : 'Copy Full Code'}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-black/70 border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="ml-2 text-white">ahilyanagar_sync.py</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Includes Immediate Sync + 06:00 AM Scheduler Loop</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-gray-200 overflow-x-auto leading-relaxed max-h-[460px] cc-scrollbar">
                  {pythonCodeSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: AI / DEVELOPER PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-black/40 to-amber-900/20 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-sparkles text-amber-400"></i>
                    AI Assistant / Team Prompt
                  </h4>
                  <p className="text-xs text-gray-300">
                    Copy and paste this exact prompt into Cursor, Antigravity, ChatGPT, or hand it to your development team:
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadFile(promptSnippet, 'ahilyanagar_prompt.md', 'text/markdown')}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs border border-white/10"
                  >
                    <i className="fa-solid fa-download mr-1.5"></i>
                    Download .md
                  </button>
                  <button
                    onClick={() => copyToClipboard(promptSnippet, 'prompt_text', 'AI Prompt')}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <i className={`fa-solid ${copiedKey === 'prompt_text' ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copiedKey === 'prompt_text' ? 'Copied Prompt!' : 'Copy Complete Prompt'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-black/70 border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="ml-2 text-white">Prompt Template (Markdown)</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Ready for LLMs</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[460px] cc-scrollbar">
                  {promptSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: SAMPLE RESPONSE JSON */}
          {activeTab === 'sample' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <i className="fa-solid fa-file-code text-emerald-400"></i>
                  <span>Expected API JSON Structure for Ahilyanagar:</span>
                </div>
                <button
                  onClick={() => copyToClipboard(sampleJsonSnippet, 'sample_json', 'Sample JSON')}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] border border-white/10"
                >
                  <i className={`fa-solid ${copiedKey === 'sample_json' ? 'fa-check text-emerald-400' : 'fa-copy'} mr-1`}></i>
                  {copiedKey === 'sample_json' ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <div className="rounded-xl bg-black/70 border border-white/10 overflow-hidden">
                <pre className="p-4 text-[11px] font-mono text-gray-200 overflow-x-auto leading-relaxed max-h-[460px] cc-scrollbar">
                  {sampleJsonSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
