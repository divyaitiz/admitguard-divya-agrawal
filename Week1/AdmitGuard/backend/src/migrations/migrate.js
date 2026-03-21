import pool from '../config/database.js';

const createTables = async () => {
  try {
    // Applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        current_step INTEGER DEFAULT 1,
        
        -- Step 1: Personal Details
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(10),
        dob DATE,
        aadhaar VARCHAR(12),
        
        -- Step 2: Identity Verification
        identity_document_url VARCHAR(500),
        identity_validation_status VARCHAR(50),
        identity_validation_date TIMESTAMP,
        identity_validation_details JSONB,
        
        -- Step 3: Academic Details
        qualification VARCHAR(100),
        grad_year INTEGER,
        cgpa DECIMAL(3,2),
        institution VARCHAR(255),
        
        -- Step 4: Documents
        documents JSONB,
        
        -- Step 5: AI Validation
        ai_validation_status VARCHAR(50),
        ai_validation_details JSONB,
        ai_validation_date TIMESTAMP,
        
        -- Step 6: Screening
        screening_score INTEGER,
        screening_feedback VARCHAR(1000),
        screening_status VARCHAR(50),
        
        -- Step 7: Interview
        interview_status VARCHAR(50),
        interview_feedback VARCHAR(1000),
        interview_date TIMESTAMP,
        
        -- Step 8: Admission
        admission_status VARCHAR(50),
        offer_letter_sent BOOLEAN DEFAULT FALSE,
        admission_details VARCHAR(1000),
        
        -- Exception Tracking
        exceptions_approved INTEGER DEFAULT 0,
        requires_manager_review BOOLEAN DEFAULT FALSE,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP
      );
    `);

    console.log('✅ Applications table created');

    // Exceptions table for tracking soft rule exceptions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exceptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
        field VARCHAR(50) NOT NULL,
        rationale TEXT NOT NULL,
        supporting_documents JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        manager_feedback TEXT,
        manager_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP
      );
    `);

    console.log('✅ Exceptions table created');

    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
      CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
      CREATE INDEX IF NOT EXISTS idx_exceptions_application_id ON exceptions(application_id);
      CREATE INDEX IF NOT EXISTS idx_exceptions_status ON exceptions(status);
    `);

    console.log('✅ Indexes created');
    console.log('✅ Database migration complete!');
    
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
};

// Only close pool if running as standalone script (not imported)
const isStandalone = import.meta.url === `file://${process.argv[1]}`;
createTables().then(() => {
  if (isStandalone) {
    pool.end();
  }
});
