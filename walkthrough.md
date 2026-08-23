# Seating Layout Configuration - Walkthrough

Updates have been successfully made to configure seating layouts for the HNI Premiere Night shows (both the original Spider-Man Premiere Night and the Toxic Premier Nights).

## Changes Made

### 1. Seating Layout Configuration for Toxic Premier Nights
We updated [route.ts](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/api/proxy-layout/route.ts) with the exact seating specifications from the user's seating configuration list:
- **Vaishnodevi**: 18 seats, Row D and E. (Large screen layout: Row E has 14 seats, Row D has seats 5-8).
- **Ahilyanagar**: 20 seats, Row A and B. (Boutique layout: Row A and B have 10 seats each).
- **Tribeca**: 19 seats, Row D and E. (Large screen layout: Row E has 14 seats, Row D has seats 5-9).
- **Adani Shantigram**: 20 seats, Row E and F. (Large screen layout: Row F has 14 seats, Row E has seats 5-10).
- **Mundhra**: 12 seats, Row D. (Changed Mundhra/Mundra to a Medium layout screen; Row D has all 12 seats).
- **Junagadh**: 14 seats, Row F and G. (Medium screen layout: Row G has 8 recliner seats, Row F has seats 4-9).
- **Mehsana**: 20 seats, Row E and F. (Changed Mehsana/Mahesana to a Medium layout screen; Row E and F have seats 2-11).
- **Sangmner**: 30 seats, Row G and H. (Medium screen layout: Customized to give rows G and H 15 seats each).
- **Gandhinagar**: 22 seats, Row E and F. (Implemented a custom theater layout block matching the physical layout exactly: Rows F–A are MILLER seats, and Row CL contains COUPLE LOUNGER couple seats. Rows E and F are the only HNI-open rows, totaling exactly 22 seats).

### 2. Layout Verification Tests
- Updated the expectations in the verification script [verify-toxic-layouts.js](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/scratch/verify-toxic-layouts.js) to match the new counts.
- Ran the test suite successfully with all tests passing.

## Verification & Testing
- Ran the layout validation script which confirmed that all HNI seat allocations match the target counts perfectly:
  - **Vaishnodevi**: 18 / 18 seats ✅ PASS
  - **Ahilyanagar**: 20 / 20 seats ✅ PASS
  - **Tribeca**: 19 / 19 seats ✅ PASS
  - **Adani Shantigram**: 20 / 20 seats ✅ PASS
  - **Mundhra**: 12 / 12 seats ✅ PASS
  - **Junagadh**: 14 / 14 seats ✅ PASS
  - **Mehsana**: 20 / 20 seats ✅ PASS
  - **Sangmner**: 30 / 30 seats ✅ PASS
  - **Gandhinagar**: 22 / 22 seats ✅ PASS
- Successfully verified that the project builds correctly via `npm run build`.
