# Connplex B2B Master Cinema Mapping Table (Vista .NET Identity Mapping)

This master registry establishes authoritative mappings between Connplex B2B Franchise Accounts, physical locations, and Vista .NET `tblCinema.Cinema_strID` values.

---

## 1. Network Master Mapping Table

| B2B Franchise Code | Cinema Display Name | City | State | Vista Cinema_strID | Screens | Capacity | Partner Account | Status |
|---|---|---|---|---|---|---|---|---|
| `FR-CL16` | Connplex Luxuriance Ahilyanagar | Ahilyanagar | Maharashtra | `CL16` | 2 | 80 | Vikram Shinde | ACTIVE |
| `FR-SB01` | Connplex Premiere South Bopal | Ahmedabad | Gujarat | `SOUTH BOPA` | 3 | 350 | Mehul Mehta | ACTIVE |
| `FR-CN01` | Connplex Smart Luxe CG Road | Ahmedabad | Gujarat | `CN01` | 4 | 420 | Nirav Shah | ACTIVE |
| `FR-CN02` | Connplex Capital 2 Gandhinagar | Gandhinagar | Gujarat | `CN02` | 6 | 650 | Rakesh Patel | ACTIVE |
| `FR-CN03` | Connplex Royal Jodhpur | Jodhpur | Rajasthan | `CN03` | 4 | 440 | Surendra Rathore | ACTIVE |
| `FR-CN04` | Connplex Pink City Jaipur | Jaipur | Rajasthan | `CN04` | 6 | 720 | Amit Sharma | ACTIVE |
| `FR-CN05` | Connplex Lakeview Udaipur | Udaipur | Rajasthan | `CN05` | 3 | 320 | Kailash Menaria | ACTIVE |
| `FR-CN06` | Connplex Diamond Surat | Surat | Gujarat | `CN06` | 4 | 450 | Bhavin Patel | ACTIVE |
| `FR-CN07` | Connplex Sayaji Vadodara | Vadodara | Gujarat | `CN07` | 3 | 360 | Chirag Desai | ACTIVE |
| `FR-CN08` | Connplex Imperial Rajkot | Rajkot | Gujarat | `CN08` | 4 | 480 | Dharmesh Jadeja | ACTIVE |
| `FR-CN09` | Connplex Heritage Pune | Pune | Maharashtra | `CN09` | 4 | 420 | Sanjay Kulkarni | ACTIVE |
| `FR-CN10` | Connplex Luxe Nashik | Nashik | Maharashtra | `CN10` | 3 | 310 | Pravin Joshi | ACTIVE |

---

## 2. Dynamic Discovery & Identity Resolution

When the background Cinema Discovery Worker executes (`POST /api.asmx/GetAllcinemaDetails`), any newly opened location in `tblCinema` is mapped using:
1. Exact match on `Cinema_strID`.
2. Prefix normalization: `FR-${Cinema_strID.replace(/\s+/g, '')}`.
3. Automatically registered in B2B database under `Franchise` master model with `status: 'ACTIVE'`.
