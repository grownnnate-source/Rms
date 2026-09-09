# Campus Scoop POS - Staff Terminal Credentials & PIN Directory

This document contains the official 4-digit terminal access PINs for the seeded staff accounts in MongoDB Atlas.

---

## 1. Active Staff Accounts & PINs

| Staff Name | Terminal Role | 4-Digit PIN | Target URL | Operational Responsibilities |
| :--- | :--- | :---: | :--- | :--- |
| **Abebe Tadesse** | `attendant` | **`1111`** | `/attendant` | POS Scoop Builder, Cup/Cone customization, customer note capture, order submission to cashier queue. |
| **Sara Hailu** | `cashier` | **`2222`** | `/cashier` | Live incoming orders queue, Chapa QR generation, Telebirr/CBE payment verification, thermal receipt printing. |
| **Dawit Bekele** | `manager` | **`9999`** | `/manager` | Store analytics, product catalog management, operating expense logging, staff PIN administration. |

---

## 2. Authentication Flow & Security Architecture

```
[Keypad / Keyboard Entry (4 digits)]
                │
                ▼
      POST /api/auth/pin-login
                │
                ▼
  [MongoDB Atlas: User Collection]
                │
  User.findOne({ pin, isActive: true })
                │
         ┌──────┴──────┐
         ▼             ▼
   [Staff Found]   [Not Found]
         │             │
  Generate JWT     401 Error
         │
   Redirect to Role URL
  - attendant -> /attendant
  - cashier   -> /cashier
  - manager   -> /manager
```

- **Storage**: PINs are stored as direct 4-digit strings (`1111`, `2222`, `9999`) with a `maxlength: 4` schema constraint. This allows rapid direct indexing (`User.findOne({ pin, isActive: true })`) without cryptographic looping or hashing delays.
- **PIN Visibility**: The current active PIN is visible directly to the manager on each staff member's profile card in the Settings tab.
- **Session**: Upon successful authentication, the server returns a signed JWT token valid for 24 hours.
- **Role Redirection**: The login terminal automatically inspects `result.user.role` and dispatches the user to their designated terminal screen.

---

## 3. How to Update a Staff PIN

### Via Manager Dashboard:
1. Log in with Manager PIN **`9999`** at `/login` or navigate to `/manager`.
2. Select the **Settings** tab on the sidebar.
3. Locate the staff member in the **Staff Access & Security PINs** section.
4. Click **Change PIN** — an inline input appears directly inside the card (restricted strictly to 4 numeric digits with `maxLength={4}` and automatic non-digit filtering, without prompt popups).
5. Enter the new 4-digit code and click **Save** (check icon).
6. The frontend calls `PATCH /api/auth/staff/:id/pin`, which updates the PIN in MongoDB Atlas immediately.

### Via REST API:
```bash
PATCH /api/auth/staff/:id/pin
Authorization: Bearer <MANAGER_JWT_TOKEN>
Content-Type: application/json

{
  "pin": "1234"
}
```

---

## 4. Chapa Payment Gateway Credentials & API Endpoints

| Resource | Value / Link | Description |
| :--- | :--- | :--- |
| **Merchant Dashboard** | [https://dashboard.chapa.co/](https://dashboard.chapa.co/) | Chapa Merchant portal (Transactions, API keys, Webhooks) |
| **Developer Documentation** | [https://developer.chapa.co/](https://developer.chapa.co/) | Official Chapa API documentation & guides |
| **Test Secret Key** | `CHASECK_TEST-70t0NFHnsMG25KsG0DtnjgE8qcSllfuB` | Bearer token for server authorization in `.env` |
| **Transaction Initialize URL** | `POST https://api.chapa.co/v1/transaction/initialize` | Generates hosted checkout link & QR for customer |
| **Transaction Verify URL** | `GET https://api.chapa.co/v1/transaction/verify/{tx_ref}` | Validates payment status with Telebirr / CBE Birr |

