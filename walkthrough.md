# Seating Layout Configuration - Walkthrough

Updates have been successfully made to configure seating layouts for the Spider-Man HNI Premiere Night show on Saturday, August 1, 2026.

## Changes Made

### 1. Seating Layout Configuration
- Updated [route.ts](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/api/proxy-layout/route.ts) with exact seating specifications for:
  - **Parimal Garden (9:00 PM)**: Matches the physical theater layout exactly. Row D contains only 7 seats. Rows B, C, E, F, G, H have 12 seats, Row A has 14 seats, and Row I has 10 seats. Rows A–F (69 seats) are HNI-available; Rows G, H, I are blocked public seats.
  - **Adani Shantigram (9:00 PM)**: Matches the physical theater layout exactly. Rows C–G have 9 seats (1–6 on left, 7–9 on right), Row H has 8 seats (1–5 on left, 6–8 on right), and Rows A–B have 10 seats. Rows C–G & H (Seats 1–5) (50 seats total) are HNI-available; other seats/rows are blocked public seats.
  - **Gota (8:00 PM)**: Matches the physical theater layout exactly. Rows A–F have 9 seats per row, and Row G has 5 couple seats (10 seats total with aisles). Rows A–B (18 seats) are HNI-available; Rows C–G are blocked public seats.
  - **Gandhinagar (8:00 PM)**: Matches Image 6 exactly. Removed Rows G and H. Rows B–F have 2 empty aisle columns on the left and 8 seats on the right. Row A has 10 seats. Rows A–B (18 seats) are HNI-available (couple seats); Rows C–F are blocked public seats.
  - **Vadodara (9:10 PM)**: Matches the physical theater layout exactly. Row I is at the top, Row A at the bottom. Rows B, C, D, E have seats 4–14. Row I has seats 4–12. Rows F, G, H have seats 3–9 / 4–9. Row A has seats 3–12. Rows B–C (22 HNI seats total) are HNI-available; other rows are blocked public seats.

### 2. Website Blocking Rules
- Confirmed that general ticketing site bundle [temp_ticketing_bundle.js](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/temp_ticketing_bundle.js) is already correctly configured to intercept clicks on Rows A–F for Parimal, Rows C–G & H (Seats 1–5) for Adani, Rows A–B for Gota, Rows A–B for Gandhinagar, and Rows B–C for Vadodara, redirecting users to the HNI page.

### 3. Real-Time Seat Caching Updates (Cache-Busting)
- Configured [route.ts](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/api/proxy-layout/route.ts) with `export const dynamic = "force-dynamic"` to disable build-time static page generation and force Next.js to run the layout API route dynamically on every request.
- Updated the layout fetch call in [page.tsx](file:///c:/Users/admin/Downloads/Connplex.b2b-main/Connplex.b2b-main/src/app/hni-events/page.tsx) to append a unique timestamp cache-buster query parameter (`&t=${Date.now()}`) and set `{ cache: 'no-store' }`. This ensures any new booking is immediately reflected as booked for subsequent customers.

## Verification & Testing
- Ran a local verification script to check seat generation logic, ensuring:
  - **Parimal Garden**: 69 HNI seats (Rows A–F), correct row order (I at top, A at bottom), Row D with 7 seats, and matching aisle positions.
  - **Adani Shantigram**: 50 HNI seats (Rows C–G & H Seats 1–5), 9 seats per row for Rows C–G, and 8 seats for Row H.
  - **Gota**: 18 HNI seats (Rows A–B), 9 seats per row for Rows A–F, and 5 couple seats for Row G.
  - **Gandhinagar**: 18 HNI seats (Rows A–B couple seats) with 2 empty spaces on the left for Rows B–F, and 6 rows total (F at top, A at bottom).
  - **Vadodara**: 22 HNI seats (Rows B–C) with correct layout grid structures and 9 rows total (I at top, A at bottom).
- Built the Next.js project successfully using `npm run build` with no compilation or TypeScript errors.
