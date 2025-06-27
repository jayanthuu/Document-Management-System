// Ultra-comprehensive knowledge base for the rural community platform chatbot
export interface ChatbotResponse {
  answer: string
  tamilAnswer: string
  category: string
  followUpQuestions?: string[]
}

export const knowledgeBase: { [key: string]: ChatbotResponse } = {
  // General Platform Questions
  "what is this platform": {
    answer:
      "This is a Rural Community Digital Platform that provides online government services for citizens. You can apply for various certificates from Revenue Department (Income, Community, Nativity, Property certificates), Education Department schemes (Scholarships, Fee reimbursement), and Naan Mudhalvan skill development programs. The platform features voice assistance in Tamil and English, real-time application tracking, and digital certificate generation.",
    tamilAnswer:
      "இது கிராமப்புற சமுதாய டிஜிட்டல் தளம் ஆகும், இது குடிமக்களுக்கு ஆன்லைன் அரசு சேவைகளை வழங்குகிறது. நீங்கள் வருவாய் துறையிலிருந்து பல்வேறு சான்றிதழ்களுக்கு (வருமானம், சமுதாயம், பூர்வீகம், சொத்து சான்றிதழ்கள்), கல்வித் துறை திட்டங்கள் (உதவித்தொகை, கட்டணம் திரும்பப் பெறுதல்), மற்றும் நான் முதல்வன் திறன் மேம்பாட்டு திட்டங்களுக்கு விண்ணப்பிக்கலாம்.",
    category: "general",
    followUpQuestions: [
      "How to register on this platform?",
      "What services are available?",
      "How to use voice assistant?",
    ],
  },

  // Revenue Department - Community Certificate
  "how to apply for community certificate": {
    answer:
      "To apply for Community Certificate: 1) Login to your citizen account 2) Navigate to 'Apply for Revenue Services' 3) Select 'Community Certificate' 4) Fill the application form with your personal details: Full name, Father's name, Mother's name, Date of birth, Complete address, Mobile number, Email 5) Upload required documents: Aadhaar Card (mandatory), School Transfer Certificate or Birth Certificate, Address proof (Ration card/Voter ID/Utility bill), Passport size photograph 6) Pay the application fee of ₹30 7) Submit the application. You will receive an Application ID for tracking. Processing time is 7-10 working days. The certificate will be available for download once approved.",
    tamilAnswer:
      "சமுதாய சான்றிதழுக்கு விண்ணப்பிக்க: 1) உங்கள் குடிமக்கள் கணக்கில் உள்நுழையவும் 2) 'வருவாய் சேவைகளுக்கு விண்ணப்பிக்கவும்' என்பதற்குச் செல்லவும் 3) 'சமுதாய சான்றிதழ்' தேர்ந்தெடுக்கவும் 4) உங்கள் தனிப்பட்ட விவரங்களுடன் விண்ணப்ப படிவத்தை நிரப்பவும் 5) தேவையான ஆவணங்களை பதிவேற்றவும்: ஆதார் அட்டை (கட்டாயம்), பள்ளி இடமாற்று சான்றிதழ் அல்லது பிறப்பு சான்றிதழ், முகவரி சான்று, பாஸ்போர்ட் அளவு புகைப்படம் 6) ₹30 விண்ணப்பக் கட்டணம் செலுத்தவும் 7) விண்ணப்பத்தை சமர்ப்பிக்கவும்.",
    category: "revenue",
    followUpQuestions: [
      "What documents are needed for community certificate?",
      "What is the fee for community certificate?",
      "How long does community certificate take?",
    ],
  },

  "community certificate documents": {
    answer:
      "Required documents for Community Certificate: 1) Aadhaar Card (mandatory) - Clear scanned copy 2) Birth Certificate or School Transfer Certificate - To verify community details 3) Address Proof - Any one: Ration Card, Voter ID Card, Electricity bill, Water bill, Property tax receipt 4) Passport size photograph - Recent color photo 5) Parent's community certificate (if available) - Helps in verification 6) School leaving certificate - Shows community mentioned in school records. All documents should be clear, readable scanned copies in PDF, JPG, or PNG format. Maximum file size 2MB per document.",
    tamilAnswer:
      "சமுதாய சான்றிதழுக்கு தேவையான ஆவணங்கள்: 1) ஆதார் அட்டை (கட்டாயம்) 2) பிறப்பு சான்றிதழ் அல்லது பள்ளி இடமாற்று சான்றிதழ் 3) முகவரி சான்று - ரேஷன் அட்டை, வாக்காளர் அடையாள அட்டை, மின்சார பில், தண்ணீர் பில், சொத்து வரி ரசீது ஆகியவற்றில் ஏதேனும் ஒன்று 4) பாஸ்போர்ட் அளவு புகைப்படம் 5) பெற்றோரின் சமுதாய சான்றிதழ் (இருந்தால்) 6) பள்ளி விடுப்பு சான்றிதழ்.",
    category: "revenue",
  },

  // Revenue Department - Income Certificate
  "how to apply for income certificate": {
    answer:
      "To apply for Income Certificate: 1) Login to citizen portal 2) Select 'Revenue Services' 3) Choose 'Income Certificate' 4) Fill the form with personal details, family income information, occupation details 5) Upload required documents: Aadhaar Card, Salary slips (last 3 months) for employed persons, Income tax returns (if applicable), Bank statements (last 6 months), Agricultural income proof (for farmers), Business license and income proof (for self-employed), Employer certificate with salary details 6) Pay fee of ₹30 7) Submit application. Processing time is 10-15 working days. The certificate shows annual family income and is used for various government schemes and educational purposes.",
    tamilAnswer:
      "வருமான சான்றிதழுக்கு விண்ணப்பிக்க: 1) குடிமக்கள் போர்ட்டலில் உள்நுழையவும் 2) 'வருவாய் சேவைகள்' தேர்ந்தெடுக்கவும் 3) 'வருமான சான்றிதழ்' தேர்வு செய்யவும் 4) தனிப்பட்ட விவரங்கள், குடும்ப வருமான தகவல், தொழில் விவரங்களுடன் படிவத்தை நிரப்பவும் 5) தேவையான ஆவணங்களை பதிவேற்றவும் 6) ₹30 கட்டணம் செலுத்தவும் 7) விண்ணப்பத்தை சமர்ப்பிக்கவும்.",
    category: "revenue",
    followUpQuestions: [
      "What documents are needed for income certificate?",
      "What is family income limit for schemes?",
      "How to calculate annual family income?",
    ],
  },

  "income certificate documents": {
    answer:
      "Required documents for Income Certificate: 1) Aadhaar Card (mandatory) 2) For Salaried persons: Salary slips of last 3 months, Employment certificate from employer, Bank statements of last 6 months, Form 16 or Income Tax Returns 3) For Farmers: Land ownership documents, Agricultural income records, Crop yield certificates, Bank statements 4) For Business owners: Business license, GST registration, Income tax returns, Bank statements, Profit & Loss statements 5) For Daily wage workers: Employer certificate, MGNREGA job card (if applicable), Bank statements 6) Family details: Ration card, Voter ID cards of all family members 7) Address proof: Utility bills, Property documents. Income should be calculated as total annual family income from all sources.",
    tamilAnswer:
      "வருமான சான்றிதழுக்கு தேவையான ஆவணங்கள்: 1) ஆதார் அட்டை 2) சம்பளம் பெறுபவர்களுக்கு: கடந்த 3 மாத சம்பள சீட்டுகள், வேலைதாதா சான்றிதழ், வங்கி அறிக்கைகள், படிவம் 16 3) விவசாயிகளுக்கு: நில உரிமை ஆவணங்கள், விவசாய வருமான பதிவுகள், பயிர் விளைச்சல் சான்றிதழ்கள் 4) வணிகர்களுக்கு: வணிக உரிமம், GST பதிவு, வருமான வரி ரிட்டர்ன்கள் 5) குடும்ப விவரங்கள்: ரேஷன் அட்டை, வாக்காளர் அடையாள அட்டைகள்.",
    category: "revenue",
  },

  // Revenue Department - Nativity Certificate
  "how to apply for nativity certificate": {
    answer:
      "To apply for Nativity Certificate: 1) Access Revenue Services portal 2) Select 'Nativity Certificate' 3) Fill form with birth details, parent information, residential history 4) Upload required documents: Birth Certificate (mandatory), School Transfer Certificate or School Leaving Certificate, Aadhaar Card, Parent's Nativity Certificate (if available), Voter ID Card, Property documents (if any), Residential proof for continuous stay 5) Pay fee of ₹30 6) Submit application. This certificate proves your place of birth and native place. Processing time is 7-10 working days. It's required for government jobs, educational admissions, and various state-specific benefits.",
    tamilAnswer:
      "பூர்வீக சான்றிதழுக்கு விண்ணப்பிக்க: 1) வருவாய் சேவைகள் போர்ட்டலை அணுகவும் 2) 'பூர்வீக சான்றிதழ்' தேர்ந்தெடுக்கவும் 3) பிறப்பு விவரங்கள், பெற்றோர் தகவல், குடியிருப்பு வரலாறுடன் படிவத்தை நிரப்பவும் 4) தேவையான ஆவணங்களை பதிவேற்றவும் 5) ₹30 கட்டணம் செலுத்தவும் 6) விண்ணப்பத்தை சமர்ப்பிக்கவும்.",
    category: "revenue",
    followUpQuestions: [
      "What documents are needed for nativity certificate?",
      "What is the difference between domicile and nativity certificate?",
      "How long is nativity certificate valid?",
    ],
  },

  "nativity certificate documents": {
    answer:
      "Required documents for Nativity Certificate: 1) Birth Certificate (mandatory) - Issued by local registrar 2) School Transfer Certificate or School Leaving Certificate - Shows place of birth and study 3) Aadhaar Card of applicant 4) Parent's Nativity Certificate (if available) - Helps establish native place 5) Voter ID Card - Shows current address 6) Property documents - Land records, house documents (if family owns property) 7) Continuous residence proof - Utility bills, ration card showing long-term residence 8) Passport size photographs 9) Parent's Aadhaar Cards 10) Marriage certificate (for married women to show maiden name). The certificate establishes that you are a native of Tamil Nadu and eligible for state-specific benefits and reservations.",
    tamilAnswer:
      "பூர்வீக சான்றிதழுக்கு தேவையான ஆவணங்கள்: 1) பிறப்பு சான்றிதழ் (கட்டாயம்) 2) பள்ளி இடமாற்று சான்றிதழ் அல்லது பள்ளி விடுப்பு சான்றிதழ் 3) விண்ணப்பதாரரின் ஆதார் அட்டை 4) பெற்றோரின் பூர்வீக சான்றிதழ் (இருந்தால்) 5) வாக்காளர் அடையாள அட்டை 6) சொத்து ஆவணங்கள் 7) தொடர்ச்சியான குடியிருப்பு சான்று 8) பாஸ்போர்ட் அளவு புகைப்படங்கள் 9) பெற்றோரின் ஆதார் அட்டைகள்.",
    category: "revenue",
  },

  // Education Department - Scholarship
  "how to apply for scholarship": {
    answer:
      "To apply for Educational Scholarship: 1) Login to citizen account 2) Navigate to 'Education Schemes' 3) Select appropriate scholarship type: Merit-based scholarship (for academic excellence), Need-based scholarship (for economically weaker sections), Minority scholarship, SC/ST scholarship 4) Fill student details, academic records, family income information, bank details 5) Upload required documents: Latest mark sheets, Income certificate (family income should be below ₹2.5 lakhs per annum for most schemes), Caste certificate (if applicable), Bank account details, Aadhaar card, Admission receipt, Fee structure from institution 6) Submit before deadline. Scholarship amount varies from ₹5,000 to ₹50,000 per year based on course and category. Processing time is 30-45 days.",
    tamilAnswer:
      "கல்வி உதவித்தொகைக்கு விண்ணப்பிக்க: 1) குடிமக்கள் கணக்கில் உள்நுழையவும் 2) 'கல்வி திட்டங்கள்' செல்லவும் 3) பொருத்தமான உதவித்தொகை வகையைத் தேர்ந்தெடுக்கவும் 4) மாணவர் விவரங்கள், கல்வி பதிவுகள், குடும்ப வருமான தகவல், வங்கி விவரங்களை நிரப்பவும் 5) தேவையான ஆவணங்களை பதிவேற்றவும் 6) காலக்கெடுவுக்கு முன் சமர்ப்பிக்கவும்.",
    category: "education",
    followUpQuestions: [
      "What documents are needed for scholarship?",
      "What is the income limit for scholarship?",
      "When is the scholarship application deadline?",
    ],
  },

  "scholarship documents": {
    answer:
      "Required documents for Scholarship: 1) Academic documents: Latest mark sheets of previous qualifying examination, Admission receipt from current institution, Fee structure and receipt, Bonafide certificate from institution 2) Income documents: Family income certificate (annual income below ₹2.5 lakhs), Salary certificates of all earning members, Income tax returns (if applicable), Bank statements of last 6 months 3) Identity documents: Student's Aadhaar card, Ration card, Voter ID (if applicable) 4) Caste documents: Caste certificate (for SC/ST/OBC categories), Minority certificate (for minority scholarships) 5) Bank details: Bank account details, Cancelled cheque or bank passbook copy 6) Other documents: Passport size photographs, Parent's Aadhaar cards, Disability certificate (if applicable for special scholarships). All documents should be attested by Gazetted Officer or institution head.",
    tamilAnswer:
      "உதவித்தொகைக்கு தேவையான ஆவணங்கள்: 1) கல்வி ஆவணங்கள்: சமீபத்திய மதிப்பெண் பட்டியல், சேர்க்கை ரசீது, கட்டண அமைப்பு, நல்ல நடத்தை சான்றிதழ் 2) வருமான ஆவணங்கள்: குடும்ப வருமான சான்றிதழ், சம்பள சான்றிதழ்கள், வங்கி அறிக்கைகள் 3) அடையாள ஆவணங்கள்: மாணவரின் ஆதார் அட்டை, ரேஷன் அட்டை 4) சாதி ஆவணங்கள்: சாதி சான்றிதழ், சிறுபான்மை சான்றிதழ் 5) வங்கி விவரங்கள்: வங்கி கணக்கு விவரங்கள், ரத்து செய்யப்பட்ட காசோலை.",
    category: "education",
  },

  // Education Department - Fee Reimbursement
  "how to apply for fee reimbursement": {
    answer:
      "To apply for Fee Reimbursement: 1) Access Education Schemes portal 2) Select 'Fee Reimbursement' scheme 3) Fill application with student details, course information, fee details paid 4) Upload required documents: Admission receipt with fee details, Fee payment receipts (tuition fee, exam fee, etc.), Latest mark sheets, Income certificate (family income below ₹2 lakhs per annum), Bank account details, Aadhaar card, Caste certificate (if applicable), Institution bonafide certificate 5) Submit within academic year. Reimbursement covers tuition fees up to ₹35,000 for general category and ₹40,000 for SC/ST students. Processing time is 45-60 days. Amount will be directly transferred to student's bank account.",
    tamilAnswer:
      "கட்டணம் திரும்பப் பெறுவதற்கு விண்ணப்பிக்க: 1) கல்வி திட்டங்கள் போர்ட்டலை அணுகவும் 2) 'கட்டணம் திரும்பப் பெறுதல்' திட்டத்தைத் தேர்ந்தெடுக்கவும் 3) மாணவர் விவரங்கள், பாடநெறி தகவல், செலுத்திய கட்டண விவரங்களுடன் விண்ணப்பத்தை நிரப்பவும் 4) தேவையான ஆவணங்களை பதிவேற்றவும் 5) கல்வியாண்டுக்குள் சமர்ப்பிக்கவும்.",
    category: "education",
    followUpQuestions: [
      "What documents are needed for fee reimbursement?",
      "What is the maximum reimbursement amount?",
      "When will I receive the reimbursement?",
    ],
  },

  "fee reimbursement documents": {
    answer:
      "Required documents for Fee Reimbursement: 1) Fee documents: Original admission receipt showing fee structure, Fee payment receipts (tuition fee, development fee, exam fee), Demand draft or online payment receipts 2) Academic documents: Latest mark sheets with minimum 50% marks, Previous year mark sheets, Bonafide certificate from institution, Course completion certificate (for final year) 3) Income documents: Family income certificate (annual income below ₹2 lakhs), Parent's salary certificates, Income tax returns (if applicable) 4) Identity documents: Student's Aadhaar card, Bank account details with IFSC code, Cancelled cheque or passbook copy 5) Category documents: Caste certificate (for SC/ST/OBC students), Minority certificate (if applicable) 6) Other documents: Passport size photographs, Parent's Aadhaar cards, Residence certificate. Fee reimbursement is available only for courses approved by government and recognized institutions.",
    tamilAnswer:
      "கட்டணம் திரும்பப் பெறுவதற்கு தேவையான ஆவணங்கள்: 1) கட்டண ஆவணங்கள்: சேர்க்கை ரசீது, கட்டணம் செலுத்திய ரசீதுகள், ஆன்லைன் பேமெண்ட் ரசீதுகள் 2) கல்வி ஆவணங்கள்: சமீபத்திய மதிப்பெண் பட்டியல், முந்தைய ஆண்டு மதிப்பெண்கள், நல்ல நடத்தை சான்றிதழ் 3) வருமான ஆவணங்கள்: குடும்ப வருமான சான்றிதழ், பெற்றோரின் சம்பள சான்றிதழ்கள் 4) அடையாள ஆவணங்கள்: மாணவரின் ஆதார் அட்டை, வங்கி கணக்கு விவரங்கள் 5) சாதி ஆவணங்கள்: சாதி சான்றிதழ்.",
    category: "education",
  },

  // Naan Mudhalvan Program
  "what is naan mudhalvan": {
    answer:
      "Naan Mudhalvan is Tamil Nadu's flagship skill development program launched to make youth industry-ready and employable. The program offers free training in high-demand skills including: Technical Skills - Web Development, Mobile App Development, Data Science, Artificial Intelligence, Machine Learning, Cyber Security, Cloud Computing; Soft Skills - Communication, Leadership, Problem-solving, Team work; Digital Skills - Digital Marketing, E-commerce, Social Media Management; Industry-specific training - Healthcare, Manufacturing, Retail, Banking. The program provides 3-6 months intensive training, industry mentorship, placement assistance, and certification. Over 1 lakh youth have been trained with 70% placement rate. Training is conducted in partnership with leading companies like TCS, Infosys, Wipro, and international organizations.",
    tamilAnswer:
      "நான் முதல்வன் தமிழ்நாட்டின் முக்கிய திறன் மேம்பாட்டு திட்டம் ஆகும், இது இளைஞர்களை தொழில்துறைக்கு தயார்படுத்துவதற்காக தொடங்கப்பட்டது. இந்த திட்டம் அதிக தேவையுள்ள திறன்களில் இலவச பயிற்சி அளிக்கிறது: தொழில்நுட்ப திறன்கள் - வலை வளர்ச்சி, மொபைல் ஆப் வளர்ச்சி, தரவு அறிவியல், செயற்கை நுண்ணறிவு, இயந்திர கற்றல், சைபர் பாதுகாப்பு; மென்திறன்கள் - தொடர்பு, தலைமைத்துவம், பிரச்சனை தீர்த்தல்; டிஜிட்டல் திறன்கள் - டிஜிட்டல் மார்க்கெட்டிங், மின்வணிகம்.",
    category: "naan-mudhalvan",
    followUpQuestions: [
      "How to apply for Naan Mudhalvan?",
      "What courses are available in Naan Mudhalvan?",
      "What is the eligibility for Naan Mudhalvan?",
    ],
  },

  "how to apply for naan mudhalvan": {
    answer:
      "To apply for Naan Mudhalvan: 1) Login to citizen portal 2) Select 'Naan Mudhalvan Programs' 3) Choose your preferred skill domain and specific course 4) Fill application form with personal details, educational qualification, employment status, skill interests 5) Upload required documents: Educational certificates (10th, 12th, Degree), Aadhaar card, Resume (if any work experience), Passport size photographs, Address proof 6) Take online aptitude test (for technical courses) 7) Submit application. Eligibility: Age 18-35 years, Minimum 10th pass, Tamil Nadu resident. Selection is based on aptitude test, educational qualification, and interview. Training is completely free with stipend provided during training period. Placement assistance guaranteed with partner companies.",
    tamilAnswer:
      "நான் முதல்வனுக்கு விண்ணப்பிக்க: 1) குடிமக்கள் போர்ட்டலில் உள்நுழையவும் 2) 'நான் முதல்வன் திட்டங்கள்' தேர்ந்தெடுக்கவும் 3) உங்கள் விருப்பமான திறமை துறை மற்றும் குறிப்பிட்ட பாடநெறியைத் தேர்வு செய்யவும் 4) தனிப்பட்ட விவரங்கள், கல்வித் தகுதி, வேலைவாய்ப்பு நிலை, திறமை ஆர்வங்களுடன் விண்ணப்ப படிவத்தை நிரப்பவும் 5) தேவையான ஆவணங்களை பதிவேற்றவும் 6) ஆன்லைன் திறன் தேர்வு எடுக்கவும் 7) விண்ணப்பத்தை சமர்ப்பிக்கவும்.",
    category: "naan-mudhalvan",
    followUpQuestions: [
      "What documents are needed for Naan Mudhalvan?",
      "What is the age limit for Naan Mudhalvan?",
      "Is there any fee for Naan Mudhalvan training?",
    ],
  },

  "naan mudhalvan documents": {
    answer:
      "Required documents for Naan Mudhalvan: 1) Educational certificates: 10th standard mark sheet and certificate, 12th standard mark sheet and certificate (if completed), Degree/Diploma certificates (if applicable), Technical course certificates (if any) 2) Identity documents: Aadhaar card (mandatory), Voter ID card (if available), Passport (if available) 3) Address proof: Ration card, Utility bills, Bank statements 4) Employment documents: Resume/CV (if any work experience), Experience certificates (if applicable), Salary slips (for employed candidates) 5) Other documents: Passport size photographs (recent), Bank account details for stipend transfer, Caste certificate (if applicable for reserved category benefits), Income certificate (for economically weaker section benefits). All documents should be clear scanned copies. Original documents need to be produced during verification process.",
    tamilAnswer:
      "நான் முதல்வனுக்கு தேவையான ஆவணங்கள்: 1) கல்வி சான்றிதழ்கள்: 10ஆம் வகுப்பு மதிப்பெண் பட்டியல் மற்றும் சான்றிதழ், 12ஆம் வகுப்பு மதிப்பெண் பட்டியல் மற்றும் சான்றிதழ், பட்டம்/டிப்ளோமா சான்றிதழ்கள், தொழில்நுட்ப பாடநெறி சான்றிதழ்கள் 2) அடையாள ஆவணங்கள்: ஆதார் அட்டை, வாக்காளர் அடையாள அட்டை 3) முகவரி சான்று: ரேஷன் அட்டை, பயன்பாட்டு பில்கள் 4) வேலைவாய்ப்பு ஆவணங்கள்: ரெஸ்யூம், அனுபவ சான்றிதழ்கள் 5) பிற ஆவணங்கள்: பாஸ்போர்ட் அளவு புகைப்படங்கள், வங்கி கணக்கு விவரங்கள்.",
    category: "naan-mudhalvan",
  },

  // Application Status and Tracking
  "how to check application status": {
    answer:
      "To check application status: 1) Login to your citizen dashboard 2) Navigate to 'My Applications Status' section 3) Find your application by Application ID or service type 4) View current status: Submitted (Application received), Under Review (Documents being verified), Query Raised (Additional information needed), Approved (Certificate ready for download), Rejected (Application not approved with reasons) 5) Check progress bar showing completion percentage 6) View last updated date and expected completion date 7) Download certificate if approved 8) Respond to queries if any raised by department. You can also track status using voice assistant by saying 'Check my application status' and providing Application ID. SMS and email notifications are sent for status updates.",
    tamilAnswer:
      "விண்ணப்ப நிலையை சரிபார்க்க: 1) உங்கள் குடிமக்கள் டாஷ்போர்டில் உள்நுழையவும் 2) 'எனது விண்ணப்பங்களின் நிலை' பிரிவுக்குச் செல்லவும் 3) விண்ணப்ப ஐடி அல்லது சேவை வகை மூலம் உங்கள் விண்ணப்பத்தைக் கண்டறியவும் 4) தற்போதைய நிலையைப் பார்க்கவும் 5) முன்னேற்ற பட்டியைச் சரிபார்க்கவும் 6) கடைசியாக புதுப்பிக்கப்பட்ட தேதி மற்றும் எதிர்பார்க்கப்படும் முடிவு தேதியைப் பார்க்கவும் 7) அங்கீகரிக்கப்பட்டால் சான்றிதழைப் பதிவிறக்கவும்.",
    category: "status",
    followUpQuestions: [
      "What does 'Under Review' status mean?",
      "How long does application processing take?",
      "What to do if application is rejected?",
    ],
  },

  // Voice Assistant Usage
  "how to use voice assistant": {
    answer:
      "Voice Assistant helps you fill forms easily and get information: 1) On any application form, click 'Voice Assistant' button 2) Choose language (English/Tamil) using language toggle 3) Use 'Interactive Voice' for complete step-by-step form filling - Assistant asks questions one by one in Tamil and fills answers in English 4) Use 'Quick Voice' for single field input - Say things like 'My name is Ram' or 'Mobile number 9876543210' 5) Use 'Read Form' to hear all filled details read back to you 6) Voice assistant understands natural speech patterns and converts Tamil speech to English text automatically 7) For chatbot, click microphone icon and ask questions like 'How to apply for community certificate?' 8) Voice assistant works offline for form filling and online for information queries.",
    tamilAnswer:
      "குரல் உதவியாளர் படிவங்களை எளிதாக நிரப்பவும் தகவல் பெறவும் உதவுகிறது: 1) எந்த விண்ணப்ப படிவத்திலும் 'குரல் உதவியாளர்' பொத்தானைக் கிளிக் செய்யவும் 2) மொழி டாக்கிளைப் பயன்படுத்தி மொழியைத் தேர்ந்தெடுக்கவும் 3) முழுமையான படிப்படியான படிவ நிரப்புதலுக்கு 'ஊடாடும் குரல்' பயன்படுத்தவும் 4) ஒற்றை புல உள்ளீட்டிற்கு 'விரைவு குரல்' பயன்படுத்தவும் 5) நிரப்பப்பட்ட அனைத்து விவரங்களையும் கேட்க 'படிவத்தைப் படிக்கவும்' பயன்படுத்தவும்.",
    category: "voice-assistant",
    followUpQuestions: [
      "Does voice assistant work in Tamil?",
      "Can I use voice to check application status?",
      "How accurate is voice recognition?",
    ],
  },

  // Registration and Login
  "how to register": {
    answer:
      "To register on the platform: 1) Visit the homepage 2) Click 'Citizen Registration' 3) Fill registration form: Aadhaar number (12 digits), Full name (as per Aadhaar), Mobile number (10 digits), Email address, Complete address with pincode, Date of birth, Gender 4) Create strong password (minimum 8 characters with uppercase, lowercase, number, and special character) 5) Verify mobile number with OTP 6) Verify email address with verification link 7) Complete registration. After registration, you can login and access all government services. For department users, contact system administrator for credentials. Keep your login credentials secure and do not share with others. You can reset password using 'Forgot Password' option if needed.",
    tamilAnswer:
      "தளத்தில் பதிவு செய்ய: 1) முகப்புப் பக்கத்திற்குச் செல்லவும் 2) 'குடிமக்கள் பதிவு' கிளிக் செய்யவும் 3) பதிவு படிவத்தை நிரப்பவும்: ஆதார் எண், முழு பெயர், மொபைல் எண், மின்னஞ்சல் முகவரி, முழுமையான முகவரி, பிறந்த தேதி, பாலினம் 4) வலுவான கடவுச்சொல்லை உருவாக்கவும் 5) மொபைல் எண்ணை OTP மூலம் சரிபார்க்கவும் 6) மின்னஞ்சல் முகவரியை சரிபார்ப்பு இணைப்பு மூலம் சரிபார்க்கவும் 7) பதிவை முடிக்கவும்.",
    category: "registration",
    followUpQuestions: [
      "What details are needed for registration?",
      "How to verify mobile number?",
      "What if I don't receive OTP?",
    ],
  },

  // Fees and Processing Time
  "what is the fee": {
    answer:
      "Service fees structure: Revenue Department certificates - Community Certificate: ₹30, Income Certificate: ₹30, Nativity Certificate: ₹30, Property Certificate: ₹50, Land Records: ₹20 per document; Education Department schemes - Most scholarships: Free application, Fee reimbursement: Free application, Document verification: ₹10; Naan Mudhalvan programs - All training programs: Completely free, Certification: Free, Placement assistance: Free. Payment methods: Online payment through debit/credit card, net banking, UPI, mobile wallets. Offline payment at Common Service Centers (CSC) with additional service charge of ₹20. Fee once paid is non-refundable. Urgent processing available for additional 50% fee with 3-5 days processing time.",
    tamilAnswer:
      "சேவை கட்டண அமைப்பு: வருவாய் துறை சான்றிதழ்கள் - சமுதாய சான்றிதழ்: ₹30, வருமான சான்றிதழ்: ₹30, பூர்வீக சான்றிதழ்: ₹30, சொத்து சான்றிதழ்: ₹50; கல்வித் துறை திட்டங்கள் - பெரும்பாலான உதவித்தொகைகள்: இலவச விண்ணப்பம், கட்டணம் திரும்பப் பெறுதல்: இலவச விண்ணப்பம்; நான் முதல்வன் திட்டங்கள் - அனைத்து பயிற்சி திட்டங்களும்: முற்றிலும் இலவசம்.",
    category: "fees",
    followUpQuestions: [
      "How to pay application fee?",
      "Is urgent processing available?",
      "Can I get refund if application is rejected?",
    ],
  },

  "how long does it take": {
    answer:
      "Processing times for different services: Revenue Department - Community Certificate: 7-10 working days, Income Certificate: 10-15 working days, Nativity Certificate: 7-10 working days, Property Certificate: 15-20 working days; Education Department - Scholarship applications: 30-45 days (depends on verification and approval process), Fee reimbursement: 45-60 days (includes verification and fund transfer), Document verification: 5-7 working days; Naan Mudhalvan - Application processing: 15-20 days, Selection process: 2-4 weeks (includes aptitude test and interview), Training duration: 3-6 months based on course. Urgent processing available for Revenue certificates with additional fee - processing time reduced to 3-5 working days. Processing time may vary during peak seasons and holidays.",
    tamilAnswer:
      "பல்வேறு சேவைகளுக்கான செயலாக்க நேரம்: வருவாய் துறை - சமுதாய சான்றிதழ்: 7-10 வேலை நாட்கள், வருமான சான்றிதழ்: 10-15 வேலை நாட்கள், பூர்வீக சான்றிதழ்: 7-10 வேலை நாட்கள்; கல்வித் துறை - உதவித்தொகை விண்ணப்பங்கள்: 30-45 நாட்கள், கட்டணம் திரும்பப் பெறுதல்: 45-60 நாட்கள்; நான் முதல்வன் - விண்ணப்ப செயலாக்கம்: 15-20 நாட்கள், தேர்வு செயல்முறை: 2-4 வாரங்கள், பயிற்சி காலம்: 3-6 மாதங்கள்.",
    category: "processing-time",
    followUpQuestions: [
      "Why is my application taking longer?",
      "Can I expedite my application?",
      "What happens after processing is complete?",
    ],
  },

  // Technical Support
  "i forgot my password": {
    answer:
      "To reset your password: 1) Go to the login page 2) Click 'Forgot Password' link below the login form 3) Enter your registered mobile number or Aadhaar number 4) Click 'Send OTP' 5) Enter the 6-digit OTP received on your mobile 6) Create new password (must be 8+ characters with uppercase, lowercase, number, and special character) 7) Confirm new password 8) Click 'Reset Password'. Your password will be updated immediately. If you don't receive OTP, check if mobile number is correct and try after 2 minutes. For persistent issues, contact support at 1800-123-4567. Keep your new password secure and don't share with anyone. You can change password anytime from your profile settings after login.",
    tamilAnswer:
      "உங்கள் கடவுச்சொல்லை மீட்டமைக்க: 1) உள்நுழைவு பக்கத்திற்குச் செல்லவும் 2) 'கடவுச்சொல்லை மறந்துவிட்டேன்' இணைப்பைக் கிளிக் செய்யவும் 3) உங்கள் பதிவு செய்யப்பட்ட மொபைல் எண் அல்லது ஆதார் எண்ணை உள்ளிடவும் 4) 'OTP அனுப்பு' கிளிக் செய்யவும் 5) உங்கள் மொபைலில் பெறப்பட்ட 6 இலக்க OTP ஐ உள்ளிடவும் 6) புதிய கடவுச்சொல்லை உருவாக்கவும் 7) புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும் 8) 'கடவுச்சொல்லை மீட்டமைக்கவும்' கிளிக் செய்யவும்.",
    category: "technical-support",
    followUpQuestions: [
      "What if I don't receive OTP for password reset?",
      "How to create a strong password?",
      "Can I change password after login?",
    ],
  },

  // Contact Information and Support
  "contact support": {
    answer:
      "For technical support and assistance: Help Desk: 1800-123-4567 (Toll-free, available 24/7), Email: support@ruralplatform.gov.in (Response within 24 hours), WhatsApp: +91-9876543210 (Text support only), Office hours: Monday to Friday 9:00 AM to 6:00 PM, Saturday 9:00 AM to 1:00 PM. For in-person assistance: Visit your nearest Common Service Center (CSC), District Collectorate office, Block Development Office. For specific department queries: Revenue Department: revenue@ruralplatform.gov.in, Education Department: education@ruralplatform.gov.in, Naan Mudhalvan: naanmudhalvan@ruralplatform.gov.in. For grievances: File complaint through online grievance portal, Call grievance helpline: 1800-456-7890. Average response time: Phone support - Immediate, Email support - 24 hours, Grievance resolution - 7-15 days.",
    tamilAnswer:
      "தொழில்நுட்ப ஆதரவு மற்றும் உதவிக்கு: உதவி மையம்: 1800-123-4567 (கட்டணமில்லா, 24/7 கிடைக்கும்), மின்னஞ்சல்: support@ruralplatform.gov.in, WhatsApp: +91-9876543210, அலுவலக நேரம்: திங்கள் முதல் வெள்ளி காலை 9:00 முதல் மாலை 6:00 வரை. நேரில் உதவிக்கு: உங்கள் அருகிலுள்ள பொதுவான சேவை மையம் (CSC), மாவட்ட ஆட்சியர் அலுவலகம், வட்டார வளர்ச்சி அலுவலகத்தைப் பார்வையிடவும்.",
    category: "contact",
    followUpQuestions: [
      "What are the office hours for support?",
      "How to file a grievance?",
      "Where is the nearest CSC center?",
    ],
  },

  // Default response for unmatched questions
  default: {
    answer:
      "I understand you're looking for information, but I couldn't find a specific answer to your question. I can help you with: Applying for Revenue certificates (Community, Income, Nativity, Property), Education schemes (Scholarships, Fee reimbursement), Naan Mudhalvan skill development programs, Checking application status, Using voice assistant, Registration and login issues, Fee information and processing times, Technical support and contact details. Please try asking a more specific question like 'How to apply for community certificate?' or 'What documents are needed for scholarship?' You can also contact our support team at 1800-123-4567 for personalized assistance.",
    tamilAnswer:
      "நீங்கள் தகவல் தேடுகிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன், ஆனால் உங்கள் கேள்விக்கு குறிப்பிட்ட பதில் கிடைக்கவில்லை. நான் உங்களுக்கு உதவ முடியும்: வருவாய் சான்றிதழ்களுக்கு விண்ணப்பித்தல், கல்வி திட்டங்கள், நான் முதல்வன் திறன் மேம்பாட்டு திட்டங்கள், விண்ணப்ப நிலையைச் சரிபார்த்தல், குரல் உதவியாளரைப் பயன்படுத்துதல், பதிவு மற்றும் உள்நுழைவு சிக்கல்கள், கட்டணத் தகவல் மற்றும் செயலாக்க நேரங்கள், தொழில்நுட்ப ஆதரவு மற்றும் தொடர்பு விவரங்கள்.",
    category: "default",
  },
}

// Enhanced question patterns for intelligent matching
export const questionPatterns = [
  // General patterns
  { pattern: /what.*platform|about.*platform|platform.*about|what.*this.*site/i, key: "what is this platform" },

  // Revenue certificate patterns
  {
    pattern: /community.*certificate|apply.*community|community.*apply/i,
    key: "how to apply for community certificate",
  },
  { pattern: /community.*documents|documents.*community|community.*papers/i, key: "community certificate documents" },
  { pattern: /income.*certificate|apply.*income|income.*apply/i, key: "how to apply for income certificate" },
  { pattern: /income.*documents|documents.*income|income.*papers/i, key: "income certificate documents" },
  {
    pattern: /nativity.*certificate|apply.*nativity|nativity.*apply|domicile/i,
    key: "how to apply for nativity certificate",
  },
  { pattern: /nativity.*documents|documents.*nativity|nativity.*papers/i, key: "nativity certificate documents" },

  // Education patterns
  { pattern: /scholarship|apply.*scholarship|scholarship.*apply/i, key: "how to apply for scholarship" },
  { pattern: /scholarship.*documents|documents.*scholarship|scholarship.*papers/i, key: "scholarship documents" },
  { pattern: /fee.*reimbursement|reimbursement|refund.*fee/i, key: "how to apply for fee reimbursement" },
  {
    pattern: /reimbursement.*documents|documents.*reimbursement|reimbursement.*papers/i,
    key: "fee reimbursement documents",
  },

  // Naan Mudhalvan patterns
  { pattern: /naan.*mudhalvan|skill.*development|what.*naan/i, key: "what is naan mudhalvan" },
  { pattern: /apply.*naan.*mudhalvan|naan.*mudhalvan.*apply/i, key: "how to apply for naan mudhalvan" },
  { pattern: /naan.*mudhalvan.*documents|documents.*naan.*mudhalvan/i, key: "naan mudhalvan documents" },

  // Status patterns
  {
    pattern: /check.*status|application.*status|status.*application|track.*application/i,
    key: "how to check application status",
  },

  // Voice assistant patterns
  { pattern: /voice.*assistant|how.*voice|voice.*help|voice.*use/i, key: "how to use voice assistant" },

  // Registration patterns
  { pattern: /register|registration|sign.*up|create.*account/i, key: "how to register" },

  // Fee patterns
  { pattern: /fee|cost|price|charge|payment/i, key: "what is the fee" },

  // Time patterns
  { pattern: /how.*long|processing.*time|time.*take|when.*ready/i, key: "how long does it take" },

  // Technical support patterns
  { pattern: /forgot.*password|reset.*password|password.*forgot|password.*reset/i, key: "i forgot my password" },
  { pattern: /contact|support|help|phone|email|assistance/i, key: "contact support" },
]

// Tamil question patterns
export const tamilQuestionPatterns = [
  { pattern: /சமுதாய.*சான்றிதழ்|சமுதாய.*விண்ணப்பம்/i, key: "how to apply for community certificate" },
  { pattern: /சமுதாய.*ஆவணங்கள்|ஆவணங்கள்.*சமுதாய/i, key: "community certificate documents" },
  { pattern: /வருமான.*சான்றிதழ்|வருமான.*விண்ணப்பம்/i, key: "how to apply for income certificate" },
  { pattern: /வருமான.*ஆவணங்கள்|ஆவணங்கள்.*வருமான/i, key: "income certificate documents" },
  { pattern: /பூர்வீக.*சான்றிதழ்|பூர்வீக.*விண்ணப்பம்/i, key: "how to apply for nativity certificate" },
  { pattern: /பூர்வீக.*ஆவணங்கள்|ஆவணங்கள்.*பூர்வீக/i, key: "nativity certificate documents" },
  { pattern: /உதவித்தொகை|scholarship/i, key: "how to apply for scholarship" },
  { pattern: /உதவித்தொகை.*ஆவணங்கள்|ஆவணங்கள்.*உதவித்தொகை/i, key: "scholarship documents" },
  { pattern: /கட்டணம்.*திரும்ப|திரும்ப.*கட்டணம்/i, key: "how to apply for fee reimbursement" },
  { pattern: /நான்.*முதல்வன்/i, key: "what is naan mudhalvan" },
  { pattern: /நான்.*முதல்வன்.*விண்ணப்பம்/i, key: "how to apply for naan mudhalvan" },
  { pattern: /நான்.*முதல்வன்.*ஆவணங்கள்/i, key: "naan mudhalvan documents" },
  { pattern: /ஆவணங்கள்.*தேவை|தேவையான.*ஆவணங்கள்/i, key: "what documents are required" },
  { pattern: /விண்ணப்ப.*நிலை|நிலை.*சரிபார்/i, key: "how to check application status" },
  { pattern: /பதிவு.*செய்/i, key: "how to register" },
  { pattern: /கட்டணம்|விலை/i, key: "what is the fee" },
  { pattern: /எவ்வளவு.*நேரம்|செயலாக்க.*நேரம்/i, key: "how long does it take" },
  { pattern: /கடவுச்சொல்.*மறந்து/i, key: "i forgot my password" },
  { pattern: /தொடர்பு|ஆதரவு|உதவி/i, key: "contact support" },
]

export class ChatbotEngine {
  findBestMatch(question: string): ChatbotResponse | null {
    const lowerQuestion = question.toLowerCase().trim()

    // Try exact matches first
    if (knowledgeBase[lowerQuestion]) {
      return knowledgeBase[lowerQuestion]
    }

    // Try English patterns
    for (const pattern of questionPatterns) {
      if (pattern.pattern.test(question)) {
        return knowledgeBase[pattern.key]
      }
    }

    // Try Tamil patterns
    for (const pattern of tamilQuestionPatterns) {
      if (pattern.pattern.test(question)) {
        return knowledgeBase[pattern.key]
      }
    }

    // Enhanced fuzzy matching
    const keys = Object.keys(knowledgeBase).filter((key) => key !== "default")
    let bestMatch = null
    let highestScore = 0

    for (const key of keys) {
      const keyWords = key.split(" ")
      const questionWords = lowerQuestion.split(" ")

      let matchScore = 0
      const totalWords = keyWords.length

      for (const keyWord of keyWords) {
        for (const questionWord of questionWords) {
          // Exact word match
          if (questionWord === keyWord) {
            matchScore += 2
          }
          // Partial word match
          else if (questionWord.includes(keyWord) || keyWord.includes(questionWord)) {
            matchScore += 1
          }
          // Phonetic similarity for common words
          else if (this.areSimilar(questionWord, keyWord)) {
            matchScore += 0.5
          }
        }
      }

      const finalScore = matchScore / totalWords
      if (finalScore > highestScore && finalScore > 0.3) {
        highestScore = finalScore
        bestMatch = key
      }
    }

    return bestMatch ? knowledgeBase[bestMatch] : null
  }

  private areSimilar(word1: string, word2: string): boolean {
    // Simple phonetic similarity check
    const similarWords = [
      ["certificate", "cert", "sertificate"],
      ["application", "apply", "applying"],
      ["document", "documents", "papers"],
      ["scholarship", "scholar"],
      ["reimbursement", "refund", "reimburse"],
      ["community", "caste"],
      ["income", "salary"],
      ["nativity", "domicile", "native"],
    ]

    for (const group of similarWords) {
      if (group.includes(word1) && group.includes(word2)) {
        return true
      }
    }
    return false
  }

  getDefaultResponse(): ChatbotResponse {
    return knowledgeBase["default"]
  }
}
