# Connplex B2B Revenue Data Model & Schema Specifications

This document outlines the database schemas, field definitions, and unique index constraints for the Franchise Revenue integration.

---

## 1. Model: `Franchise` (Cinema Master & Identity Mapping)

**Collection:** `franchises`  
**Purpose:** Stores metadata and maps B2B franchise accounts to Vista `tblCinema.Cinema_strID`.

| Field Name | Type | Constraints / Default | Description |
|---|---|---|---|
| `franchiseCode` | String | Unique, Indexed, Required | Authoritative B2B code (e.g. `FR-CL16`, `FR-CN01`) |
| `name` | String | Required | Full display name (e.g. "Connplex Luxuriance Ahilyanagar") |
| `city` | String | Required | City of operation |
| `state` | String | Required | State (e.g. "Maharashtra", "Gujarat") |
| `vistaCinemaId` | String | Indexed, Required | Vista POS identifier (e.g. `CL16`, `CN01`, `SOUTH BOPA`) |
| `vistaCinemaName` | String | Required | Cinema name in Vista `tblCinema` |
| `screenCount` | Number | Default: `2` | Number of cinema screens |
| `totalSeatCapacity` | Number | Default: `300` | Total seating capacity across screens |
| `status` | String | Enum: `['ACTIVE', 'INACTIVE', 'PENDING']` | Operational status |
| `ownerUserId` | String | Optional | B2B user ID reference |
| `ownerName` | String | Optional | Franchise partner display name |
| `contactEmail` | String | Optional | Registered contact email |
| `contactPhone` | String | Optional | Registered contact phone |

---

## 2. Model: `DailyFranchiseRevenue` (Aggregated Daily Performance)

**Collection:** `dailyfranchiserevenues`  
**Purpose:** Stores day-by-day revenue, admissions, channel attributions, and F&B metrics.

> [!IMPORTANT]
> **Compound Unique Constraint (Idempotency Guarantee):**  
> `DailyFranchiseRevenueSchema.index({ franchiseCode: 1, businessDate: 1 }, { unique: true });`

| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `franchiseCode` | String | Required, Indexed | Reference to `Franchise.franchiseCode` |
| `vistaCinemaId` | String | Required, Indexed | Vista POS cinema ID |
| `businessDate` | String | Format: `YYYY-MM-DD`, Indexed | Operating day in `Asia/Kolkata` (06:00 AM cutoff) |
| `totalGrossRevenue` | Number | Default: `0` | Box Office + F&B Concessions ($$\text{TicketRevenue} + \text{FnBRevenue}$$) |
| `ticketRevenue` | Number | Default: `0` | Confirmed box office sales |
| `fnbRevenue` | Number | Default: `0` | Concession food & beverage sales |
| `counterRevenue` | Number | Default: `0` | Walk-in box office ($$\text{TicketRevenue} - (\text{BMS} + \text{Web} + \text{Other})$$) |
| `bookMyShowRevenue` | Number | Default: `0` | BMS channel attribution share |
| `websiteRevenue` | Number | Default: `0` | Connplex website/app attribution share |
| `otherRevenue` | Number | Default: `0` | Corporate / other aggregator attribution share |
| `ticketsSold` | Number | Default: `0` | Confirmed ticket admissions |
| `showsCount` | Number | Default: `0` | Total scheduled shows |
| `availableSeats` | Number | Default: `0` | Total seat capacity across scheduled shows |
| `occupancyPercentage` | Number | Default: `0` | Occupancy ($$(\text{Tickets} / \text{AvailableSeats}) \times 100$$) |
| `averageTicketPrice` | Number | Default: `0` | ATP ($$\text{TicketRevenue} / \text{TicketsSold}$$) |
| `spendPerHead` | Number | Default: `0` | SPH ($$\text{FnBRevenue} / \text{TicketsSold}$$) |
| `fnbToBoxOfficeRatioPercent` | Number | Default: `0` | Ratio ($$(\text{FnBRevenue} / \text{TicketRevenue}) \times 100$$) |
| `isReconciled` | Boolean | Default: `true` | True if channel sum equals total ticket revenue |
| `reconciliationStatus` | String | Enum: `['RECONCILED', 'PENDING', 'DISCREPANCY_DETECTED']` | EOD audit status |
| `varianceAmount` | Number | Default: `0` | Variance in rupees detected during EOD audit |
| `lastSyncedAt` | Date | Default: `Date.now` | Timestamp of latest sync |
| `syncVersion` | Number | Default: `1` | Incrementing version for concurrency tracking |
| `movies` | Array | Subdocuments | Movie performance line items |
| `hourlyDistribution` | Array | Subdocuments | Intraday hourly admissions and revenue |

---

## 3. Model: `SyncStatus` (Sync Telemetry)

**Collection:** `syncstatuses`  
**Purpose:** Tracks execution health and duration of background workers.

| Field Name | Type | Description |
|---|---|---|
| `syncType` | String | Enum: `['REVENUE_10MIN', 'AUDIT_NIGHTLY', 'CINEMA_DISCOVERY']` |
| `status` | String | Enum: `['STARTED', 'SUCCESS', 'PARTIAL', 'FAILED']` |
| `startedAt` | Date | Worker start timestamp |
| `completedAt` | Date | Worker completion timestamp |
| `durationMs` | Number | Execution duration in milliseconds |
| `recordsProcessed` | Number | Count of upserted daily records |
| `failedCinemas` | Array | List of failed cinema IDs and error messages |
| `errorMessage` | String | Captured error message |

---

## 4. Model: `ReconciliationAudit` (Nightly Variance Tracking)

**Collection:** `reconciliationaudits`  
**Purpose:** Records nightly 2:00 AM IST audit comparisons between 10-minute real-time sync aggregates and Vista's official EOD report (`objBook.strBMSSalesData`).

| Field Name | Type | Description |
|---|---|---|
| `franchiseCode` | String | Franchise identifier |
| `vistaCinemaId` | String | Vista cinema ID |
| `auditDate` | String | Audit business date (`YYYY-MM-DD`) |
| `realTimeTotalGross` | Number | 10-minute worker aggregate |
| `auditedTotalGross` | Number | Official Vista EOD report total from XML |
| `varianceAmount` | Number | Difference: `Math.abs(realTimeTotalGross - auditedTotalGross)` |
| `auditStatus` | String | Enum: `['MATCH', 'VARIANCE_WITHIN_TOLERANCE', 'DISCREPANCY']` |
| `details` | Object | Line-item XML breakdown |
| `reviewedBy` | String | Administrator ID who reviewed discrepancy |
| `resolvedAt` | Date | Timestamp of variance resolution |
