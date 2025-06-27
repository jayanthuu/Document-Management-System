-- Create database schema for Rural Digital Platform

-- Users table for both citizens and department officials
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('citizen', 'department')),
    identifier VARCHAR(100) UNIQUE NOT NULL, -- Aadhaar/Mobile/Email for citizens, Employee ID for officials
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15),
    email VARCHAR(255),
    department VARCHAR(50), -- Only for department users
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(20) UNIQUE NOT NULL,
    citizen_id INTEGER REFERENCES users(id),
    service_type VARCHAR(50) NOT NULL, -- revenue, education, naan-mudhalvan
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'approved', 'rejected', 'forwarded')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    form_data JSONB NOT NULL, -- Store all form data as JSON
    submitted_date DATE DEFAULT CURRENT_DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_officer INTEGER REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table for file uploads
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id),
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application history for tracking status changes
CREATE TABLE IF NOT EXISTS application_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by INTEGER REFERENCES users(id),
    remarks TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table for approved applications
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    issued_by INTEGER REFERENCES users(id),
    digital_signature TEXT,
    is_valid BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    application_id INTEGER REFERENCES applications(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_citizen_id ON applications(citizen_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_service_type ON applications(service_type);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_users_identifier ON users(identifier);
