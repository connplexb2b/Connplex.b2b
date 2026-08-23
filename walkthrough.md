# Seating Layout Configuration - Walkthrough

Updates have been successfully made to configure seating layouts for the HNI Premiere Night shows (both the original Spider-Man Premiere Night and the Toxic Premier Nights).

## Changes Made

### 1. Seating Layout Configuration for Toxic Premier Nights
We updated [route.ts](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/api/proxy-layout/route.ts) with the exact seating specifications from the user's seating configuration list:
- **Vaishnodevi**: 18 seats, Row D and E. (Large screen layout: Row E has 14 seats, Row D has seats 5-8).
- **Ahilyanagar**: 20 seats, Row A and B. (Boutique layout: Row A and B have 10 seats each).
- **Tribeca**: 19 seats, Row D and E. (Large screen layout: Row E has 14 seats, Row D has seats 5-9).
- **Adani Shantigram**: 20 seats, Row E and F. (Custom Adani Shantigram layout matching the physical layout exactly: Rows A-F are COUPLE LOUNGER couple seats. Rows A and B have 6 couple seats, and Rows C-F have 5 couple seats. Rows E and F are fully open for HNI booking, totaling exactly 20 open seats).
- **Mundhra**: 12 seats, Row D. (Custom Mundhra layout matching the physical layout exactly: Rows A-D are COUPLE LOUNGER couple seats. Row A has 7 couple seats, and Rows B-D have 6 couple seats. Row D is fully open for HNI booking, totaling exactly 12 open seats).
- **Junagadh**: 14 seats, Row F and G. (Custom Junagadh layout matching the physical layout exactly: Sofa Slider is rows A-G, and Lounger is row H. Rows F and G have 7 seats each, and both rows are fully open, totaling exactly 14 open seats).
- **Mehsana**: 20 seats, Row E and F. (Custom Mehsana layout matching the physical layout exactly: Sofa Slider Plus is rows A-D, Miller is rows E-F, and Lounger is row G. Rows E and F have 9 and 11 seats respectively, and both rows are fully open, totaling exactly 20 open seats).
- **Sangmner**: 30 seats, Row G and H. (Medium screen layout: Customized to give rows G and H 15 seats each).
- **Gandhinagar**: 22 seats, Row E and F. (Custom Gandhinagar layout matching the physical layout exactly: Miller is rows A-F, and Couple Lounger is row G. Row A has 12 seats, rows B-D have 10 seats, and rows E-F have 11 seats each. Rows E and F are fully open, totaling exactly 22 open seats).

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
