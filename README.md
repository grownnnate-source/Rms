# Campus Scoop POS & Restaurant Management System (RMS)

A modern, responsive multi-terminal Restaurant Management System designed for artisan gelato parlors and campus cafes. Features real-time multi-screen order synchronization, integrated Chapa Ethiopian digital payments (Telebirr & CBE Birr), printable 80mm ESC/POS thermal receipts, and real-time business analytics.

---

## 🌐 Live Production Deployments

| Component | Platform | Live URL |
| :--- | :---: | :--- |
| **Frontend Web App** | **Vercel** | [https://rms-chi-dusky.vercel.app](https://rms-chi-dusky.vercel.app) |
| **Backend API & WebSockets** | **Render** | [https://ice-cream-shop-management.onrender.com](https://ice-cream-shop-management.onrender.com) |
| **Database** | **MongoDB Atlas** | Cloud Replica Set (`Cluster0`) |

---

## 🔑 Staff Access PINs (Credentials)

Staff authenticate using an interactive 4-digit PIN numpad that automatically routes each user to their assigned terminal:

| Role | Staff Member | 4-Digit PIN | Assigned Terminal | Key Capabilities |
| :--- | :--- | :---: | :---: | :--- |
| **Attendant** | Abebe Tadesse | `1111` | `/attendant` | Menu browsing, cup size variants, scoop customizations, live cart, submit orders to cashier |
| **Cashier** | Sara Hailu | `2222` | `/cashier` | Live incoming queue, Chapa QR payment requests, live payment simulator, thermal receipt printing |
| **Manager** | Dawit Bekele | `9999` | `/manager` | Sales KPIs, SVG trend charts, menu inventory management, expense tracking, staff PIN updates |

---

## 🛠 Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Axios, Socket.IO Client.
* **Backend**: Node.js, Express 5, MongoDB Atlas (Mongoose), Socket.IO (WebSockets), QRCode, JWT, Bcrypt.js.
* **Payment Gateway**: Chapa Ethiopian Fintech API (Telebirr, CBE Birr, Card settlement).
* **Hosting**: Vercel (Frontend CDN) + Render (Node.js Continuous Container).

---

## 🚀 Environment Configuration

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://ice-cream-shop-management.onrender.com/api
VITE_SOCKET_URL=https://ice-cream-shop-management.onrender.com
```

### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://grownupmenace_db_user:vUKJwaUoutrYefal@cluster0.oodl0np.mongodb.net/icecream_rms?retryWrites=true&w=majority
JWT_SECRET=super_secret_icecream_jwt_key_change_in_production
JWT_EXPIRES_IN=12h
CHAPA_SECRET_KEY=CHASECK_TEST-70t0NFHnsMG25KsG0DtnjgE8qcSllfuB
CLIENT_URL=https://rms-chi-dusky.vercel.app
```

---

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Seed Database**:
   ```bash
   cd backend && npm run seed
   ```
3. **Start Development Servers**:
   ```bash
   # Terminal 1: Backend (Port 3000)
   cd backend && npm run dev

   # Terminal 2: Frontend (Port 5173)
   cd frontend && npm run dev
   ```
