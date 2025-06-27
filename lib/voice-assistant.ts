// Voice Assistant functionality with Tamil questions and English storage
export class VoiceAssistant {
  private recognition: any | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private currentLanguage = "en-IN"

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = this.currentLanguage
      }

      // Initialize Speech Synthesis
      this.synthesis = window.speechSynthesis
    }
  }

  // Set language (Tamil or English)
  setLanguage(lang: "ta-IN" | "en-IN") {
    this.currentLanguage = lang
    if (this.recognition) {
      this.recognition.lang = lang
    }
  }

  // Start listening for voice input
  startListening(callback: (text: string) => void, errorCallback?: (error: string) => void): void {
    if (!this.recognition) {
      errorCallback?.("Speech recognition not supported")
      return
    }

    if (this.isListening) {
      this.stopListening()
      return
    }

    this.isListening = true

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      callback(transcript)
      this.isListening = false
    }

    this.recognition.onerror = (event) => {
      errorCallback?.(event.error)
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    this.recognition.start()
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Speak text in current language
  speak(text: string, lang?: string): void {
    if (!this.synthesis) return

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang || this.currentLanguage
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    this.synthesis.speak(utterance)
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening
  }

  // Enhanced voice commands for form filling with Tamil support
  processVoiceCommand(command: string, formType: string): { field: string; value: string } | null {
    const lowerCommand = command.toLowerCase()

    // English patterns
    const englishPatterns = {
      fullName: /(?:my (?:full )?name is|name|called) (.+)/i,
      studentName: /(?:student name is|my name is) (.+)/i,
      fatherName: /(?:father(?:'s)? name is|father is) (.+)/i,
      motherName: /(?:mother(?:'s)? name is|mother is) (.+)/i,
      mobileNumber: /(?:mobile|phone|number) (?:is )?(\d{10})/i,
      email: /(?:email|mail) (?:is )?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      address: /(?:address|live at|residing at) (.+)/i,
      dateOfBirth: /(?:date of birth|born on|dob) (?:is )?(.+)/i,
      age: /(?:age|years old) (?:is )?(\d+)/i,
      qualification: /(?:qualification|studied|education) (.+)/i,
      course: /(?:course|studying) (.+)/i,
      institution: /(?:college|institution|school) (?:is )?(.+)/i,
      purpose: /(?:purpose|reason) (?:is )?(.+)/i,
      identifier: /(?:aadhaar|aadhar) (?:number )?(?:is )?(\d{12})/i,
      employeeId: /(?:employee|emp) (?:id|number) (?:is )?([A-Z0-9]+)/i,
      pincode: /(?:pincode|pin) (?:is )?(\d{6})/i,
      familyIncome: /(?:family income|income) (?:is )?(?:rupees )?(\d+)/i,
    }

    // Tamil patterns (basic support)
    const tamilPatterns = {
      fullName: /(?:என் பெயர்|பெயர்) (.+)/i,
      mobileNumber: /(?:மொபைல்|போன்) (?:எண் )?(\d{10})/i,
      address: /(?:முகவரி|வீட்டு முகவரி) (.+)/i,
    }

    // Try English patterns first
    for (const [field, pattern] of Object.entries(englishPatterns)) {
      const match = lowerCommand.match(pattern)
      if (match) {
        return { field, value: match[1].trim() }
      }
    }

    // Try Tamil patterns
    for (const [field, pattern] of Object.entries(tamilPatterns)) {
      const match = command.match(pattern)
      if (match) {
        return { field, value: match[1].trim() }
      }
    }

    return null
  }

  // Interactive form filling with voice guidance
  async startInteractiveFormFilling(
    formType: string,
    onFieldUpdate: (field: string, value: string) => void,
    onComplete: (formData: any) => void,
    language: "en-IN" | "ta-IN" = "en-IN",
  ) {
    this.setLanguage(language)

    const questions = this.getFormQuestions(formType, language)
    const formData: any = {}
    let currentQuestionIndex = 0

    const askNextQuestion = () => {
      if (currentQuestionIndex >= questions.length) {
        this.confirmFormData(formData, language, onComplete)
        return
      }

      const question = questions[currentQuestionIndex]
      this.speak(question.text, language)

      setTimeout(() => {
        this.startListening(
          (answer) => {
            // Process the answer and translate if needed
            const processed = this.processAndTranslateAnswer(answer, question.field, formType, language)
            if (processed) {
              formData[question.field] = processed.value
              onFieldUpdate(question.field, processed.value)

              const confirmText = this.getConfirmationText(question.field, processed.value, language)
              this.speak(confirmText, language)

              setTimeout(() => {
                currentQuestionIndex++
                askNextQuestion()
              }, 2000)
            } else {
              const retryText = this.getRetryText(language)
              this.speak(retryText, language)
              setTimeout(askNextQuestion, 2000)
            }
          },
          (error) => {
            const errorText = this.getErrorText(language)
            this.speak(errorText, language)
            setTimeout(askNextQuestion, 2000)
          },
        )
      }, 1000)
    }

    const welcomeText = this.getWelcomeText(language)
    this.speak(welcomeText, language)
    setTimeout(askNextQuestion, 2000)
  }

  private getFormQuestions(formType: string, language: "en-IN" | "ta-IN") {
    const questions = {
      revenue: {
        "en-IN": [
          { field: "fullName", text: "What is your full name?" },
          { field: "fatherName", text: "What is your father's name?" },
          { field: "motherName", text: "What is your mother's name?" },
          { field: "dateOfBirth", text: "What is your date of birth? Please say day, month, year." },
          { field: "mobileNumber", text: "What is your mobile number?" },
          { field: "address", text: "What is your complete address?" },
          { field: "pincode", text: "What is your pincode?" },
          { field: "purpose", text: "What is the purpose of this certificate?" },
        ],
        "ta-IN": [
          { field: "fullName", text: "உங்கள் முழு பெயர் என்ன?" },
          { field: "fatherName", text: "உங்கள் தந்தையின் பெயர் என்ன?" },
          { field: "motherName", text: "உங்கள் தாயின் பெயர் என்ன?" },
          { field: "dateOfBirth", text: "உங்கள் பிறந்த தேதி என்ன? தயவுசெய்து நாள், மாதம், வருடம் சொல்லுங்கள்." },
          { field: "mobileNumber", text: "உங்கள் மொபைல் எண் என்ன?" },
          { field: "address", text: "உங்கள் முழு முகவரி என்ன?" },
          { field: "pincode", text: "உங்கள் பின்கோட் என்ன?" },
          { field: "purpose", text: "இந்த சான்றிதழின் நோக்கம் என்ன?" },
        ],
      },
      education: {
        "en-IN": [
          { field: "studentName", text: "What is the student's name?" },
          { field: "fatherName", text: "What is the father's name?" },
          { field: "motherName", text: "What is the mother's name?" },
          { field: "course", text: "What course is the student studying?" },
          { field: "institution", text: "What is the name of the institution?" },
          { field: "mobileNumber", text: "What is your mobile number?" },
          { field: "familyIncome", text: "What is the annual family income in rupees?" },
        ],
        "ta-IN": [
          { field: "studentName", text: "மாணவரின் பெயர் என்ன?" },
          { field: "fatherName", text: "தந்தையின் பெயர் என்ன?" },
          { field: "motherName", text: "தாயின் பெயர் என்ன?" },
          { field: "course", text: "என்ன படிப்பு படிக்கிறார்?" },
          { field: "institution", text: "கல்லூரியின் பெயர் என்ன?" },
          { field: "mobileNumber", text: "உங்கள் மொபைல் எண் என்ன?" },
          { field: "familyIncome", text: "வருடாந்திர குடும்ப வருமானம் எவ்வளவு ரூபாய்?" },
        ],
      },
      "naan-mudhalvan": {
        "en-IN": [
          { field: "fullName", text: "What is your full name?" },
          { field: "qualification", text: "What is your highest qualification?" },
          { field: "skillInterest", text: "What skills are you interested in learning?" },
          { field: "mobileNumber", text: "What is your mobile number?" },
          { field: "email", text: "What is your email address?" },
        ],
        "ta-IN": [
          { field: "fullName", text: "உங்கள் முழு பெயர் என்ன?" },
          { field: "qualification", text: "உங்கள் உயர்ந்த கல்வித் தகுதி என்ன?" },
          { field: "skillInterest", text: "எந்த திறமைகளை கற்க விரும்புகிறீர்கள்?" },
          { field: "mobileNumber", text: "உங்கள் மொபைல் எண் என்ன?" },
          { field: "email", text: "உங்கள் மின்னஞ்சல் முகவரி என்ன?" },
        ],
      },
    }

    return questions[formType as keyof typeof questions]?.[language] || []
  }

  private processAndTranslateAnswer(answer: string, field: string, formType: string, language: "en-IN" | "ta-IN") {
    const cleanAnswer = answer.trim()

    // Handle mobile numbers (extract digits) - improved pattern matching
    if (field === "mobileNumber") {
      // Remove all non-digit characters and extract 10-digit number
      const cleanedNumber = cleanAnswer.replace(/\D/g, "")
      const mobileMatch = cleanedNumber.match(/(\d{10})/)
      if (mobileMatch) {
        return { field, value: mobileMatch[1] }
      }

      // Also try to match spoken numbers
      const spokenNumber = this.convertSpokenNumbersToDigits(cleanAnswer)
      if (spokenNumber && spokenNumber.length === 10) {
        return { field, value: spokenNumber }
      }

      return null
    }

    // Handle email
    if (field === "email") {
      const emailMatch = cleanAnswer.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
      return emailMatch ? { field, value: emailMatch[1] } : null
    }

    // Handle pincode
    if (field === "pincode") {
      const pincodeMatch = cleanAnswer.match(/(\d{6})/)
      return pincodeMatch ? { field, value: pincodeMatch[1] } : null
    }

    // Handle family income
    if (field === "familyIncome") {
      const incomeMatch = cleanAnswer.match(/(\d+)/)
      return incomeMatch ? { field, value: incomeMatch[1] } : null
    }

    // Handle date of birth
    if (field === "dateOfBirth") {
      const translatedDate = this.translateDateToEnglish(cleanAnswer, language)
      return translatedDate ? { field, value: translatedDate } : null
    }

    // Handle qualification translation
    if (field === "qualification") {
      const translatedQualification = this.translateQualificationToEnglish(cleanAnswer, language)
      return { field, value: translatedQualification }
    }

    // Handle general text translation from Tamil to English
    if (language === "ta-IN") {
      const translatedText = this.translateTamilToEnglish(cleanAnswer, field)
      return { field, value: translatedText }
    }

    // For English, return as is
    return cleanAnswer.length > 0 ? { field, value: cleanAnswer } : null
  }

  private translateTamilToEnglish(tamilText: string, field: string): string {
    // Basic Tamil to English name translations
    const nameTranslations: { [key: string]: string } = {
      // Common Tamil names
      ராம்: "Ram",
      கிருஷ்ணன்: "Krishnan",
      முருகன்: "Murugan",
      லக்ஷ்மி: "Lakshmi",
      பிரியா: "Priya",
      அருண்: "Arun",
      விஜய்: "Vijay",
      சுரேஷ்: "Suresh",
      ராஜேஷ்: "Rajesh",
      கமலா: "Kamala",
      சுந்தர்: "Sundar",
      வெங்கடேஷ்: "Venkatesh",
      ராதா: "Radha",
      கீதா: "Geetha",
      மீனா: "Meena",
      ரவி: "Ravi",
      சந்திரன்: "Chandran",
      பாலாஜி: "Balaji",
      ஸ்ரீனிவாசன்: "Srinivasan",

      // Common words
      சென்னை: "Chennai",
      கோயம்புத்தூர்: "Coimbatore",
      மதுரை: "Madurai",
      திருச்சி: "Trichy",
      சேலம்: "Salem",
      வேலூர்: "Vellore",
      தஞ்சாவூர்: "Thanjavur",
      திருநெல்வேலி: "Tirunelveli",

      // Education related
      பொறியியல்: "Engineering",
      மருத்துவம்: "Medicine",
      கணினி: "Computer",
      வணிகம்: "Commerce",
      கலை: "Arts",
      அறிவியல்: "Science",
      கணிதம்: "Mathematics",
      இயற்பியல்: "Physics",
      வேதியியல்: "Chemistry",
      உயிரியல்: "Biology",

      // Skills
      "வலை வடிவமைப்பு": "Web Development",
      "மொபைல் ஆப்": "Mobile App Development",
      "தரவு அறிவியல்": "Data Science",
      "செயற்கை நுண்ணறிவு": "Artificial Intelligence",
      "இயந்திர கற்றல்": "Machine Learning",
      "சைபர் பாதுகாப்பு": "Cyber Security",
      "டிஜிட்டல் மார்க்கெட்டிங்": "Digital Marketing",
      "கிராபிக் டிசைன்": "Graphic Design",
    }

    // Check for direct translations
    for (const [tamil, english] of Object.entries(nameTranslations)) {
      if (tamilText.includes(tamil)) {
        return tamilText.replace(tamil, english)
      }
    }

    // If no direct translation found, try to transliterate
    return this.transliterateTamilToEnglish(tamilText)
  }

  private transliterateTamilToEnglish(tamilText: string): string {
    // Basic Tamil to English transliteration mapping
    const tamilToEnglish: { [key: string]: string } = {
      அ: "a",
      ஆ: "aa",
      இ: "i",
      ஈ: "ee",
      உ: "u",
      ஊ: "oo",
      எ: "e",
      ஏ: "ae",
      ஐ: "ai",
      ஒ: "o",
      ஓ: "oa",
      ஔ: "au",
      க: "ka",
      ங: "nga",
      ச: "cha",
      ஞ: "nya",
      ட: "ta",
      ண: "na",
      த: "tha",
      ன: "na",
      ப: "pa",
      ம: "ma",
      ய: "ya",
      ர: "ra",
      ல: "la",
      வ: "va",
      ழ: "zha",
      ள: "la",
      ற: "ra",
      ன: "na",
      ஜ: "ja",
      ஷ: "sha",
      ஸ: "sa",
      ஹ: "ha",
      க்ஷ: "ksha",
    }

    let result = tamilText
    for (const [tamil, english] of Object.entries(tamilToEnglish)) {
      result = result.replace(new RegExp(tamil, "g"), english)
    }

    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  private translateDateToEnglish(dateText: string, language: "en-IN" | "ta-IN"): string | null {
    if (language === "ta-IN") {
      // Tamil month translations
      const tamilMonths: { [key: string]: string } = {
        ஜனவரி: "January",
        பிப்ரவரி: "February",
        மார்ச்: "March",
        ஏப்ரல்: "April",
        மே: "May",
        ஜூன்: "June",
        ஜூலை: "July",
        ஆகஸ்ட்: "August",
        செப்டம்பர்: "September",
        அக்டோபர்: "October",
        நவம்பர்: "November",
        டிசம்பர்: "December",
      }

      let translatedDate = dateText
      for (const [tamil, english] of Object.entries(tamilMonths)) {
        translatedDate = translatedDate.replace(tamil, english)
      }

      // Extract date components and format as YYYY-MM-DD
      const dateMatch = translatedDate.match(/(\d{1,2}).*?(\w+).*?(\d{4})/)
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, "0")
        const month = dateMatch[2]
        const year = dateMatch[3]

        const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1
        return `${year}-${monthNumber.toString().padStart(2, "0")}-${day}`
      }
    }

    // Try to parse English date
    const dateMatch = dateText.match(/(\d{1,2}).*?(\d{1,2}).*?(\d{4})/)
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, "0")
      const month = dateMatch[2].padStart(2, "0")
      const year = dateMatch[3]
      return `${year}-${month}-${day}`
    }

    return null
  }

  private translateQualificationToEnglish(qualificationText: string, language: "en-IN" | "ta-IN"): string {
    if (language === "ta-IN") {
      const qualificationTranslations: { [key: string]: string } = {
        "பத்தாம் வகுப்பு": "10th Standard",
        "பன்னிரண்டாம் வகுப்பு": "12th Standard",
        டிப்ளோமா: "Diploma",
        இளங்கலை: "Under Graduate",
        முதுகலை: "Post Graduate",
        பொறியியல்: "Engineering",
        மருத்துவம்: "Medicine",
        கலை: "Arts",
        அறிவியல்: "Science",
        வணிகம்: "Commerce",
      }

      for (const [tamil, english] of Object.entries(qualificationTranslations)) {
        if (qualificationText.includes(tamil)) {
          return english
        }
      }
    }

    return qualificationText
  }

  private getConfirmationText(field: string, value: string, language: "en-IN" | "ta-IN"): string {
    if (language === "ta-IN") {
      const fieldNames: { [key: string]: string } = {
        fullName: "பெயர்",
        fatherName: "தந்தையின் பெயர்",
        motherName: "தாயின் பெயர்",
        studentName: "மாணவர் பெயர்",
        mobileNumber: "மொபைல் எண்",
        address: "முகவரி",
        course: "படிப்பு",
        institution: "கல்லூரி",
        qualification: "கல்வித் தகுதி",
        skillInterest: "திறமைகள்",
        purpose: "நோக்கம்",
        pincode: "பின்கோட்",
        familyIncome: "குடும்ப வருமானம்",
        email: "மின்னஞ்சல்",
        dateOfBirth: "பிறந்த தேதி",
      }

      const fieldName = fieldNames[field] || field
      return `சரி, ${fieldName} ${value} என்று பதிவு செய்யப்பட்டது`
    }

    return `Okay, I've recorded ${field} as ${value}`
  }

  private getRetryText(language: "en-IN" | "ta-IN"): string {
    return language === "ta-IN"
      ? "மன்னிக்கவும், புரியவில்லை. மீண்டும் சொல்லுங்கள்"
      : "Sorry, I didn't understand. Please try again."
  }

  private getErrorText(language: "en-IN" | "ta-IN"): string {
    return language === "ta-IN" ? "குரல் கேட்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்" : "Could not hear you. Please try again."
  }

  private getWelcomeText(language: "en-IN" | "ta-IN"): string {
    return language === "ta-IN"
      ? "வணக்கம்! நான் உங்களுக்கு படிவம் நிரப்ப உதவுகிறேன். கேள்விகளுக்கு பதில் சொல்லுங்கள்"
      : "Hello! I'll help you fill the form. Please answer the questions I ask."
  }

  private confirmFormData(formData: any, language: "en-IN" | "ta-IN", onComplete: (data: any) => void) {
    const confirmText =
      language === "ta-IN"
        ? "படிவம் நிரப்பப்பட்டது. விவரங்களை சரிபார்க்கவும்"
        : "Form completed. Please review the details and submit."

    this.speak(confirmText, language)
    onComplete(formData)
  }

  // Read form data in selected language
  readFormData(formData: any, language: "en-IN" | "ta-IN"): void {
    const filledFields = Object.entries(formData).filter(
      ([key, value]) => value && value !== "" && typeof value !== "boolean",
    )

    if (filledFields.length === 0) {
      const emptyText =
        language === "ta-IN" ? "படிவத்தில் எந்த விவரமும் நிரப்பப்படவில்லை" : "No details have been filled in the form"
      this.speak(emptyText, language)
      return
    }

    const introText = language === "ta-IN" ? "நிரப்பப்பட்ட விவரங்கள்:" : "Filled details are:"

    this.speak(introText, language)

    // Read each field one by one with a pause
    filledFields.forEach(([key, value], index) => {
      setTimeout(
        () => {
          const fieldText = this.getFieldReadingText(key, value as string, language)
          this.speak(fieldText, language)
        },
        (index + 1) * 2000,
      ) // 2 second delay between each field
    })
  }

  private getFieldReadingText(field: string, value: string, language: "en-IN" | "ta-IN"): string {
    if (language === "ta-IN") {
      const fieldNames: { [key: string]: string } = {
        fullName: "முழு பெயர்",
        fatherName: "தந்தையின் பெயர்",
        motherName: "தாயின் பெயர்",
        studentName: "மாணவர் பெயர்",
        mobileNumber: "மொபைல் எண்",
        address: "முகவரி",
        course: "படிப்பு",
        institution: "கல்லூரி",
        qualification: "கல்வித் தகுதி",
        skillInterest: "திறமைகள்",
        purpose: "நோக்கம்",
        pincode: "பின்கோட்",
        familyIncome: "குடும்ப வருமானம்",
        email: "மின்னஞ்சல்",
        dateOfBirth: "பிறந்த தேதி",
        certificateType: "சான்றிதழ் வகை",
        serviceType: "சேவை வகை",
        programType: "திட்ட வகை",
        gender: "பாலினம்",
        category: "வகை",
        yearOfStudy: "படிப்பு ஆண்டு",
        bankAccount: "வங்கி கணக்கு",
        ifscCode: "ஐ.எஃப்.எஸ்.சி குறியீடு",
        employmentStatus: "வேலை நிலை",
        preferredLocation: "விருப்பமான இடம்",
        experience: "அனுபவம்",
      }

      const fieldName = fieldNames[field] || field
      return `${fieldName}: ${value}`
    }

    // Convert camelCase to readable format for English
    const readableField = field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    return `${readableField}: ${value}`
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  private convertSpokenNumbersToDigits(text: string): string {
    const numberWords: { [key: string]: string } = {
      zero: "0",
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
      // Tamil numbers
      பூஜ்யம்: "0",
      ஒன்று: "1",
      இரண்டு: "2",
      மூன்று: "3",
      நான்கு: "4",
      ஐந்து: "5",
      ஆறு: "6",
      ஏழு: "7",
      எட்டு: "8",
      ஒன்பது: "9",
    }

    let result = text.toLowerCase()

    // Replace word numbers with digits
    for (const [word, digit] of Object.entries(numberWords)) {
      result = result.replace(new RegExp(word, "g"), digit)
    }

    // Extract only digits
    const digits = result.replace(/\D/g, "")
    return digits
  }
}

export const voiceAssistant = new VoiceAssistant()
