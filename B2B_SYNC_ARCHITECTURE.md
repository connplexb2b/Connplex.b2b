# Connplex B2B Background Synchronization & Audit Architecture

This document details the background scheduling, failure recovery, idempotency mechanics, and telemetry monitoring for the Connplex B2B revenue synchronization engine.

---

## 1. Worker Topology & Execution Schedules

```
+---------------------------------------------------------------------------------+
|                         CONNPLEX B2B REVENUE WORKER                             |
+---------------------------------------------------------------------------------+
          │                                 │                                 │
          ▼                                 ▼                                 ▼
   Every 10 Minutes            Every Night at 2:00 AM IST        Every Night at 4:00 AM IST
[Revenue Sync Worker]         [Reconciliation Audit Worker]     [Cinema Discovery Worker]
- Loops over 50 cinemas       - Queries strBMSSalesData EOD     - Queries GetAllcinemaDetails
- Calls GetFranchiseRevenue   - Parses salesDataXml             - Registers unmapped cinemas
- Atomic upsert by            - Logs to ReconciliationAudit     - Updates screen metadata
  { franchiseCode, date }     - Flags variance > tolerance      - Syncs licensing codes
```

---

## 2. Idempotency Standard

### Compound Unique Key:
$$\text{Unique Key} = \{\text{franchiseCode}: 1, \text{businessDate}: 1\}$$

### Atomic Upsert Logic:
```typescript
await DailyFranchiseRevenue.findOneAndUpdate(
  {
    franchiseCode: franchise.franchiseCode,
    businessDate: normalized.businessDate,
  },
  {
    $set: { ...normalizedMetrics, lastSyncedAt: new Date() },
    $inc: { syncVersion: 1 },
  },
  { upsert: true, new: true }
);
```
- Re-running the sync worker updates the active business day's metrics rather than inserting duplicate rows.
- Zero collision or duplicate record anomalies.

---

## 3. Network Resilience & Error Recovery

1. **30-Second Timeout:** All outbound HTTP requests to Vista endpoints timeout after 30,000ms.
2. **Exponential Backoff:** Transient network errors (`ECONNRESET`, `ETIMEDOUT`, 502/503/504) retry up to 3 times with delays of 1s, 2s, and 4s plus random jitter.
3. **Partial Failure Isolation:** If one cinema POS is offline or unreachable, the worker logs the error in `SyncStatus.failedCinemas` and continues processing the remaining cinemas.
4. **Audited Baseline Fallback:** When a cinema POS is completely offline, the system utilizes the verified MTD baseline so the dashboard never renders blank or crashes.

---

## 4. Operational Monitoring & Telemetry

Administrators monitor worker health via `GET /api/v1/franchise-dashboard/sync-status` or the Corporate Admin UI panel.
- Green status: Last sync within 15 minutes, zero failed cinemas.
- Yellow status: Sync successful with transient retries or minor variance within tolerance.
- Red status: Persistent failure requiring network or Vista IIS firewall investigation.
