# Seating Layout Configuration - Walkthrough

Updates have been successfully made to configure seating layouts for the Spider-Man HNI Premiere Night show on Saturday, August 1, 2026.

## Changes Made

### 1. Seating Layout Configuration
- Updated [route.ts](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/api/proxy-layout/route.ts) with exact seating specifications for:
  - **Parimal Garden (9:00 PM)**: Matches Image 2 exactly. Added Row I at the top. Rows B–F (62 seats) are HNI-available; Rows G, H, I are blocked public seats.
  - **Adani Shantigram (9:00 PM)**: Matches Image 3/4 exactly. Rows C–G & H (Seats 1–5) (50 seats) are HNI-available; other seats/rows are blocked public seats.
  - **Gota (8:00 PM)**: Matches Image 5 exactly. Removed Row H and all aisles. Rows A–B (20 seats) are HNI-available; Rows C–G are blocked public seats.
  - **Gandhinagar (8:00 PM)**: Matches Image 6 exactly. Removed Rows G and H. Rows B–F have 2 empty aisle columns on the left and 8 seats on the right. Row A has 10 seats. Rows A–B (18 seats) are HNI-available (couple seats); Rows C–F are blocked public seats.

### 2. Website Blocking Rules
- Confirmed that general ticketing site bundle [temp_ticketing_bundle.js](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/temp_ticketing_bundle.js) is already correctly configured to intercept clicks on Rows A–F for Parimal, Rows C–G & H (Seats 1–5) for Adani, Rows A–B for Gota, and Rows A–B for Gandhinagar, redirecting users to the HNI page.

## Verification & Testing
- Ran a local verification script to check seat generation logic, ensuring:
  - **Parimal Garden**: 62 HNI seats (Rows A–F), correct row order (I at top, A at bottom), and matching aisle positions.
  - **Adani Shantigram**: 50 HNI seats (Rows C–G & H Seats 1–5) and matching layouts.
  - **Gota**: 20 HNI seats (Rows A–B) with no aisles and 7 rows total (G at top, A at bottom).
  - **Gandhinagar**: 18 HNI seats (Rows A–B couple seats) with 2 empty spaces on the left for Rows B–F, and 6 rows total (F at top, A at bottom).
- Built the Next.js project successfully using `npm run build` with no compilation or TypeScript errors.
