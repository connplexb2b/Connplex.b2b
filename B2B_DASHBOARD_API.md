# Connplex Franchise Revenue Dashboard REST API Specifications

All endpoints are hosted at `/api/v1/franchise-dashboard/*` and are fully authenticated with server-side multi-tenant scope enforcement.

---

## 1. Summary: `GET /api/v1/franchise-dashboard/summary`
Returns today's headline KPIs, yesterday's comparison, day-on-day % change, MTD totals, and sync freshness.

### Headers:
- `Authorization: Bearer <token>`
- `x-user-role: franchise_owner | corporate_admin`
- `x-cinema-id: CL16`

### Sample Response (200 OK):
```json
{
  "status": 200,
  "userRole": "FRANCHISE_OWNER",
  "scopedFranchise": "FR-CL16",
  "data": {
    "franchiseCode": "FR-CL16",
    "effectiveBusinessDate": "2026-10-05",
    "kpis": {
      "totalGrossRevenue": 167000.0,
      "ticketRevenue": 118000.0,
      "fnbRevenue": 49000.0,
      "ticketsSold": 410,
      "showsCount": 8,
      "occupancyPercentage": 74.2,
      "averageTicketPrice": 287.8,
      "spendPerHead": 119.51,
      "fnbToBoxOfficeRatioPercent": 41.53,
      "dayOnDayGrowthPercent": 8.2,
      "isGrowthPositive": true
    },
    "mtd": {
      "totalGrossRevenue": 4820000.0,
      "ticketRevenue": 3320000.0,
      "fnbRevenue": 1500000.0,
      "ticketsSold": 11850
    },
    "channels": {
      "totalBoxOffice": 118000.0,
      "counterRevenue": 42480.0,
      "bookMyShowRevenue": 56640.0,
      "websiteRevenue": 18880.0,
      "otherRevenue": 0.0,
      "isNonAdditiveVerified": true
    },
    "lastSyncedAt": "2026-10-05T02:15:00.000Z",
    "syncHealth": "SUCCESS"
  }
}
```

---

## 2. Daily Historical Ledger: `GET /api/v1/franchise-dashboard/daily`
Accepts `startDate` and `endDate` (`YYYY-MM-DD`). Returns day-by-day records.

### Query Parameters:
- `startDate=2026-09-01`
- `endDate=2026-10-05`

### Sample Response:
```json
{
  "status": 200,
  "data": {
    "franchiseCode": "FR-CL16",
    "startDate": "2026-09-01",
    "endDate": "2026-10-05",
    "count": 26,
    "records": [
      {
        "businessDate": "2026-10-01",
        "ticketsSold": 580,
        "ticketRevenue": 168000,
        "fnbRevenue": 68000,
        "totalGrossRevenue": 236000,
        "averageTicketPrice": 289.65,
        "spendPerHead": 117.24,
        "occupancyPercentage": 72.5
      }
    ]
  }
}
```

---

## 3. Non-Additive Channel Split: `GET /api/v1/franchise-dashboard/channel-breakdown`
Returns BookMyShow, Website, Counter, and Other revenue attributions of total Box Office.

### Sample Response:
```json
{
  "status": 200,
  "data": {
    "totalGrossRevenue": 167000.0,
    "totalBoxOfficeRevenue": 118000.0,
    "fnbConcessionsRevenue": 49000.0,
    "channels": [
      { "name": "BookMyShow", "revenue": 56640, "sharePercentage": 48.0 },
      { "name": "Physical Counter (POS Box Office)", "revenue": 42480, "sharePercentage": 36.0 },
      { "name": "Connplex Official Website & App", "revenue": 18880, "sharePercentage": 16.0 }
    ],
    "isNonAdditiveVerified": true
  }
}
```

---

## 4. F&B Concessions Matrix: `GET /api/v1/franchise-dashboard/fnb-metrics`
Returns F&B gross revenue, SPH, F&B-to-Box-Office ratio %, and popular category metrics.

---

## 5. Movie Performance: `GET /api/v1/franchise-dashboard/movie-wise`
Returns movie title, shows, tickets sold, ticket revenue, F&B revenue, and occupancy %.

---

## 6. Hourly Progression: `GET /api/v1/franchise-dashboard/hourly`
Returns intraday admissions and revenue distribution across show slots.

---

## 7. Occupancy Analytics: `GET /api/v1/franchise-dashboard/occupancy`
Returns show count, seat capacity, admissions, and overall occupancy rate.

---

## 8. Sync Status: `GET /api/v1/franchise-dashboard/sync-status`
Returns 10-minute worker health, 2:00 AM nightly audit status, and active cinema count.

---

## 9. Trigger Sync (Admin Only): `POST /api/v1/franchise-dashboard/sync-trigger`
Triggers immediate background synchronization.

### Request Body:
```json
{
  "franchiseCode": "FR-CL16"
}
```

---

## 10. Corporate Overview (Admin Only): `GET /api/v1/franchise-dashboard/corporate-overview`
Returns network totals across 50 cinemas, top 5 and bottom 5 rankings, and cinema comparison ledger.
