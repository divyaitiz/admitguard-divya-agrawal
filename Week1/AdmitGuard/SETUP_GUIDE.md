# Quick Start Guide

## 🚀 Full Setup (Frontend + Backend + Database)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Database

Choose **ONE** option:

#### Option A: PostgreSQL with Docker (Local)
```bash
# Install Docker first from https://www.docker.com/

# Run PostgreSQL container
docker run --name admitguard-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:latest

# Update backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=admitguard
```

#### Option B: Free Cloud Database (Recommended)
1. Go to **https://render.com** or **https://railway.app**
2. Create free PostgreSQL instance
3. Copy connection string → `DATABASE_URL` in `.env`

Example:
```
DATABASE_URL=postgresql://user:password@host:port/admitguard
```

### Step 3: Run Database Migration
```bash
cd backend
npm run migrate
```

This creates the `applications` table with all necessary columns.

### Step 4: Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Should see: ✅ Server running on http://localhost:5000

### Step 5: Frontend Environment Setup
```bash
# In root directory, create .env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend
```bash
npm run dev
```

Opens at: http://localhost:5173

---

## 📊 Testing the Flow

1. **User fills Step 1** → Application created in DB with ID
2. **Each step saves data** → Updated in DB
3. **Screen Score → Interview** → Status changes automatically
4. **Final step** → Offer letter generated

---

## 📁 Project Structure

```
AdmitGuard/
├── frontend (React + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ (all 8 steps)
│   │   │   ├── context/FormContext.tsx (state management)
│   │   │   ├── services/api.ts (API calls)
│   │   │   └── App.tsx (main component)
│   │   └── main.tsx
│   └── package.json
│
├── backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/ (business logic)
│   │   ├── routes/ (API endpoints)
│   │   ├── config/ (database config)
│   │   ├── migrations/ (schema)
│   │   └── server.js (entry point)
│   ├── uploads/ (document storage)
│   └── package.json
│
└── database (PostgreSQL)
    └── applications table
```

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/applications/create` | Start new application |
| GET | `/api/applications/:id` | Get application data |
| POST | `/api/applications/:id/step1` | Save personal details |
| POST | `/api/applications/:id/step2` | Upload ID document |
| POST | `/api/applications/:id/step3` | Save academic details |
| POST | `/api/applications/:id/step4` | Upload academic documents |
| POST | `/api/applications/:id/step5` | Run AI validation |
| POST | `/api/applications/:id/step6` | Save screening score |
| POST | `/api/applications/:id/step7` | Save interview result |
| POST | `/api/applications/:id/step8` | Send offer letter |
| GET | `/api/applications` | Get all apps (admin) |

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is free: `netstat -ano | findstr :5000`
- Verify `.env` has correct DB credentials
- Run migration again: `npm run migrate`

### Database connection error
- Ensure PostgreSQL/Docker is running
- Check `.env` DATABASE_URL format
- For cloud: Verify IP whitelisting

### Frontend can't reach API
- Check `VITE_API_URL` in `.env`
- Verify backend is running on port 5000
- Check browser console for CORS errors

### File upload fails
- Check `uploads/` folder exists
- Verify backend has write permissions
- Max file size: 50MB

---

## 🚀 Next Steps

1. **Test with sample data**
2. **Add authentication** (if multi-user)
3. **Integrate real AI validation** (OCR, document verification)
4. **Add email notifications** (offer letters, status updates)
5. **Deploy** (Render/Railway for backend, Vercel for frontend)

---

## 📝 Example: Creating an Application

```javascript
// Frontend
POST /api/applications/create
{
  "email": "student@example.com"
}

// Response
{
  "applicationId": "550e8400-e29b-41d4-a716-446655440000"
}

// Then save Step 1
POST /api/applications/550e8400-e29b-41d4-a716-446655440000/step1
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dob": "2000-01-15",
  "aadhaar": "123456789012"
}
```

All data persists in PostgreSQL! ✅

