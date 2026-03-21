# AdmitGuard Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database

#### Option A: Local PostgreSQL (with Docker)
```bash
docker run --name admitguard-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
```

#### Option B: Cloud PostgreSQL (Free tier)
Use **Render** or **Railway**:
1. Go to https://render.com or https://railway.app
2. Create free PostgreSQL instance
3. Copy connection string to `.env` as `DATABASE_URL`

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run Database Migration
```bash
npm run migrate
```

### 5. Start Server
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

## API Endpoints

### Create Application
```
POST /api/applications/create
Body: { "email": "user@example.com" }
Response: { "applicationId": "uuid" }
```

### Get Application
```
GET /api/applications/:id
Response: { Full application data }
```

### Save Each Step
```
POST /api/applications/:id/step1  (Personal Details)
POST /api/applications/:id/step2  (Identity Document - multipart/form-data)
POST /api/applications/:id/step3  (Academic Details)
POST /api/applications/:id/step4  (Academic Documents - multipart/form-data)
POST /api/applications/:id/step5  (AI Validation - auto)
POST /api/applications/:id/step6  (Screening Score)
POST /api/applications/:id/step7  (Interview Decision)
POST /api/applications/:id/step8  (Offer Letter)
```

### Admin
```
GET /api/applications  (All applications)
```

## Database Schema

```sql
applications
├── id (UUID) - Primary Key
├── current_step (1-8)
├── full_name, email, phone, dob, aadhaar
├── identity_document_url, identity_validation_status
├── qualification, grad_year, cgpa, institution
├── documents (JSONB array)
├── ai_validation_status, ai_validation_details
├── screening_score, screening_status
├── interview_status, interview_feedback
├── admission_status, offer_letter_sent
├── created_at, updated_at, submitted_at
```

## Next Steps

1. **Frontend Integration**: Update React to call these API endpoints
2. **AI Validation**: Integrate actual document verification service
3. **Email Service**: Add offer letter email sending (Nodemailer/SendGrid)
4. **Authentication**: Add user login if needed
5. **File Storage**: Use AWS S3/Cloudinary for document storage

