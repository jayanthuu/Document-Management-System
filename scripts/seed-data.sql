-- Seed data for Rural Digital Platform

-- Insert sample department users
INSERT INTO users (user_type, identifier, password_hash, full_name, mobile_number, email, department) VALUES
('department', 'REV001', '$2b$10$example_hash_1', 'Rajesh Kumar', '9876543210', 'rajesh.kumar@tn.gov.in', 'revenue'),
('department', 'EDU001', '$2b$10$example_hash_2', 'Priya Sharma', '9876543211', 'priya.sharma@tn.gov.in', 'education'),
('department', 'NM001', '$2b$10$example_hash_3', 'Arjun Patel', '9876543212', 'arjun.patel@tn.gov.in', 'naan-mudhalvan'),
('department', 'ADM001', '$2b$10$example_hash_4', 'Meera Reddy', '9876543213', 'meera.reddy@tn.gov.in', 'admin');

-- Insert sample citizen users
INSERT INTO users (user_type, identifier, password_hash, full_name, mobile_number, email) VALUES
('citizen', '1234-5678-9012', '$2b$10$example_hash_5', 'Suresh Babu', '8765432109', 'suresh.babu@gmail.com'),
('citizen', '2345-6789-0123', '$2b$10$example_hash_6', 'Lakshmi Devi', '8765432108', 'lakshmi.devi@gmail.com'),
('citizen', '3456-7890-1234', '$2b$10$example_hash_7', 'Karthik Raj', '8765432107', 'karthik.raj@gmail.com'),
('citizen', '4567-8901-2345', '$2b$10$example_hash_8', 'Divya Krishnan', '8765432106', 'divya.krishnan@gmail.com');

-- Insert sample applications
INSERT INTO applications (application_id, citizen_id, service_type, service_name, status, priority, form_data, assigned_officer) VALUES
('APP001', 5, 'revenue', 'Income Certificate', 'approved', 'high', 
 '{"certificateType": "income", "fullName": "Suresh Babu", "purpose": "Bank loan application"}', 1),
('APP002', 6, 'revenue', 'Community Certificate', 'in-review', 'medium',
 '{"certificateType": "community", "fullName": "Lakshmi Devi", "purpose": "College admission"}', 1),
('APP003', 7, 'education', 'Scholarship Application', 'pending', 'high',
 '{"serviceType": "scholarship", "studentName": "Karthik Raj", "course": "Engineering"}', 2),
('APP004', 8, 'naan-mudhalvan', 'Skill Development Program', 'approved', 'low',
 '{"programType": "technical-skills", "fullName": "Divya Krishnan", "skillInterest": "Web Development"}', 3);

-- Insert application history
INSERT INTO application_history (application_id, previous_status, new_status, changed_by, remarks) VALUES
(1, 'pending', 'in-review', 1, 'Application under review'),
(1, 'in-review', 'approved', 1, 'All documents verified and approved'),
(2, 'pending', 'in-review', 1, 'Reviewing submitted documents'),
(4, 'pending', 'approved', 3, 'Eligible for skill development program');

-- Insert sample certificates
INSERT INTO certificates (application_id, certificate_number, certificate_type, issued_by) VALUES
(1, 'IC/2024/001', 'Income Certificate', 1),
(4, 'NM/2024/001', 'Skill Development Certificate', 3);

-- Insert sample notifications
INSERT INTO notifications (user_id, application_id, title, message, notification_type) VALUES
(5, 1, 'Application Approved', 'Your income certificate application has been approved and certificate is ready for download.', 'approval'),
(6, 2, 'Application Under Review', 'Your community certificate application is currently under review.', 'status_update'),
(7, 3, 'Application Received', 'Your scholarship application has been received and assigned for review.', 'acknowledgment'),
(8, 4, 'Program Enrollment Confirmed', 'You have been enrolled in the skill development program. Training will start next month.', 'approval');
