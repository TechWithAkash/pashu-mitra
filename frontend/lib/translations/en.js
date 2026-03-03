// All farmer-friendly English strings for the app.
// These are the SOURCE strings that get translated via Google Translate API.
const en = {
  // Common
  "common.appName": "Pashumitra",
  "common.loading": "Loading...",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.save": "Save Changes",
  "common.signIn": "Sign In",
  "common.signOut": "Sign Out",
  "common.createAccount": "Create Account",
  "common.profile": "Profile",
  "common.or": "or",

  // Navigation
  "nav.home": "Home",
  "nav.checkAnimal": "Check Animal",
  "nav.pastResults": "Past Results",
  "nav.profile": "My Account",
  "nav.training": "Training",
  "nav.modelInfo": "Model Info",
  "nav.admin": "Admin",

  // Dashboard
  "dashboard.title": "Your Farm's Health",
  "dashboard.subtitle": "Monitor your herd's health at a glance",
  "dashboard.animalsChecked": "Animals Checked",
  "dashboard.needAttention": "Need Attention",
  "dashboard.healthyAnimals": "Healthy Animals",
  "dashboard.healthScore": "Health Score",
  "dashboard.newScan": "Check Animal",
  "dashboard.recentResults": "Recent Results",
  "dashboard.noResults": "No results yet",
  "dashboard.noResultsHint": "Upload a photo of your animal to get started.",
  "dashboard.startFirst": "Check Your First Animal",
  "dashboard.viewAll": "View All",
  "dashboard.quickScan": "Check your animal now",
  "dashboard.quickScanDesc": "Upload a photo of your animal for a quick health check with visual explanation.",
  "dashboard.startScanning": "Check Now",
  "dashboard.loadingDashboard": "Loading your farm's health data...",
  "dashboard.healthy": "Healthy",
  "dashboard.needsAttention": "Needs Attention",

  // Dashboard charts
  "dashboard.healthTrend": "Your Herd's Health Trend",
  "dashboard.healthTrendDesc": "Health score of your animals over time",
  "dashboard.distribution": "Health Overview",
  "dashboard.distributionDesc": "Healthy vs animals that need attention",
  "dashboard.dailyActivity": "Daily Check-ups",
  "dashboard.dailyActivityDesc": "Number of animals checked each day",
  "dashboard.healthMatrix": "Recent Check-ups at a Glance",
  "dashboard.healthMatrixDesc": "Each square is one check-up",
  "dashboard.confidenceChart": "AI Confidence",
  "dashboard.confidenceChartDesc": "How sure the AI was about each result",
  "dashboard.healthyLabel": "Healthy",
  "dashboard.diseasedLabel": "Needs Attention",
  "dashboard.checksLabel": "Check-ups",
  "dashboard.scoreLabel": "Health Score",
  "dashboard.last7Days": "7 Days",
  "dashboard.last14Days": "14 Days",
  "dashboard.improving": "Improving",
  "dashboard.declining": "Declining",
  "dashboard.stable": "Stable",
  "dashboard.notEnoughData": "Check a few more animals to see trends",
  "dashboard.noActivityYet": "No check-ups in this period",
  "dashboard.checkedOn": "Checked on",

  // Predict page
  "predict.title": "Check Your Animal",
  "predict.subtitle": "Upload a photo of your animal for a quick health check",
  "predict.dropzoneTitle": "Drag & drop a photo of your animal here",
  "predict.dropzoneSubtitle": "or tap to choose a photo — JPEG, PNG — max 10 MB",
  "predict.dropHere": "Drop the photo here",
  "predict.analyzeButton": "Check My Animal",
  "predict.analyzing": "Checking...",
  "predict.analysisComplete": "Health check complete",
  "predict.analysisFailed": "Check failed, please try again",
  "predict.fileTooLarge": "Photo is too large. Maximum size is 10 MB.",
  "predict.invalidType": "Please upload a photo (JPEG, PNG).",

  // Photo tips
  "predict.photoTips": "Tips for a good photo",
  "predict.tip1": "Take the photo in good daylight",
  "predict.tip2": "Show the skin area clearly, not too far away",
  "predict.tip3": "Keep the camera steady to avoid blur",
  "predict.tip4": "Include any lumps or spots you are worried about",

  // Results
  "result.title": "Health Check Result",
  "result.healthy": "Your animal looks healthy",
  "result.healthyDesc": "No signs of Lumpy Skin Disease were found.",
  "result.diseased": "Disease signs found — take action now",
  "result.diseasedDesc": "Signs of Lumpy Skin Disease were detected.",
  "result.uncertain": "Not sure — try again with a better photo",
  "result.uncertainDesc": "We could not make a clear determination. Please retake the photo.",
  "result.confidenceHigh": "We are very confident about this result",
  "result.confidenceMedium": "We are fairly confident about this result",
  "result.confidenceLow": "We are not sure — please retake the photo",
  "result.whatToDoNext": "What to do next",

  // Quality warning
  "result.qualityWarning": "Photo Quality Issue",

  // GradCAM
  "gradcam.title": "Where we looked",
  "gradcam.original": "Your photo",
  "gradcam.highlighted": "What we noticed",
  "gradcam.explanation": "The colored areas show where we looked on the photo. Red and yellow areas are where we looked most carefully.",

  // Post-diagnosis actions
  "action.shareWhatsApp": "Share on WhatsApp",
  "action.callVet": "Call Veterinarian",
  "action.downloadReport": "Download Report",
  "action.vetHelpline": "Emergency Vet Helpline",

  // History
  "history.title": "Past Check-ups",
  "history.subtitle": "View and manage your past results",
  "history.noResults": "No check-ups yet",
  "history.noResultsHint": "Your results will appear here after you check your first animal.",
  "history.loadMore": "Load More",
  "history.detailTitle": "Check-up Details",
  "history.deleteTitle": "Delete Result",
  "history.deleteDesc": "This will permanently remove this result. This action cannot be undone.",
  "history.deleted": "Result deleted",
  "history.deleteFailed": "Failed to delete",
  "history.date": "Date",
  "history.file": "Photo",
  "history.result": "Result",
  "history.confidence": "How sure",
  "history.actions": "Actions",
  "history.advice": "Advice",
  "history.loading": "Loading your results...",

  // Landing page
  "landing.badge": "AI-Powered Health Check",
  "landing.heading1": "Detect cattle disease",
  "landing.heading2": "before it spreads",
  "landing.subtext": "Upload a photo, get an instant health check with visual explanations, and take action — all in seconds.",
  "landing.startFree": "Start Free Check",
  "landing.learnMore": "Learn More",
  "landing.trust1": "92%+ Accuracy",
  "landing.trust2": "Instant Results",
  "landing.trust3": "Visual Explanations",

  // Features
  "features.badge": "Features",
  "features.heading": "Everything you need for",
  "features.headingHighlight": "cattle health",
  "features.headingSuffix": "monitoring",
  "features.subtext": "A complete health check tool built with AI for livestock disease detection.",
  "features.f1Title": "Instant Health Check",
  "features.f1Desc": "Upload a photo and receive an accurate health check within seconds.",
  "features.f2Title": "Visual Explanations",
  "features.f2Desc": "See exactly where we looked on the photo. Visual highlights make every result trustworthy.",
  "features.f3Title": "Check-up History",
  "features.f3Desc": "Track every result over time. Monitor your herd's health trends and keep records.",
  "features.f4Title": "For Farmers & Vets",
  "features.f4Desc": "Built for farmers, veterinarians, and farm managers with the right tools for each user.",
  "features.f5Title": "Actionable Advice",
  "features.f5Desc": "Every result includes clear, step-by-step advice on what to do next.",
  "features.f6Title": "Photo Quality Checks",
  "features.f6Desc": "Automatic checks for blur, brightness, and clarity ensure photos meet standards before analysis.",

  // How it works
  "howItWorks.badge": "How It Works",
  "howItWorks.heading": "Three steps to",
  "howItWorks.headingHighlight": "protect your herd",
  "howItWorks.subtext": "From photo to health check in seconds.",
  "howItWorks.step1Title": "Take a Photo",
  "howItWorks.step1Desc": "Take a clear photo of the skin area you are worried about and upload it.",
  "howItWorks.step2Title": "AI Health Check",
  "howItWorks.step2Desc": "Our AI checks the photo instantly, looking for signs of Lumpy Skin Disease.",
  "howItWorks.step3Title": "Get Results & Act",
  "howItWorks.step3Desc": "Get instant results with visual explanations and clear advice on what to do next.",

  // Stats
  "stats.accuracy": "Detection Accuracy",
  "stats.analysisTime": "Analysis Time",
  "stats.availability": "Availability",
  "stats.classes": "Disease Classes",

  // About LSD
  "about.badge": "About the Disease",
  "about.heading": "Understanding",
  "about.headingHighlight": "Lumpy Skin Disease",
  "about.subtext": "Knowledge is the first line of defense against livestock disease.",

  // CTA
  "cta.heading": "Ready to protect",
  "cta.headingHighlight": "your herd",
  "cta.questionMark": "?",
  "cta.subtext": "Join farmers and veterinarians using AI-powered health checks for early disease detection. Start checking for free.",
  "cta.createAccount": "Create Free Account",
  "cta.signIn": "Sign In",

  // Footer
  "footer.copyright": "Pashumitra. All rights reserved.",
  "footer.builtWith": "AI-powered livestock health platform.",

  // Auth
  "auth.loginTitle": "Sign in to Pashumitra",
  "auth.loginSubtitle": "Welcome back. Enter your details to continue.",
  "auth.signupTitle": "Create your account",
  "auth.signupSubtitle": "Start protecting your herd with AI health checks.",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.fullName": "Full name",
  "auth.confirmPassword": "Confirm password",
  "auth.iAmA": "I am a",
  "auth.farmer": "Farmer",
  "auth.veterinarian": "Veterinarian",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.passwordsNoMatch": "Passwords do not match",
  "auth.tagline": "AI-Powered Cattle Health Check",
  "auth.description": "Protecting livestock health with instant AI disease detection. Upload a photo, get results in seconds.",
  "auth.testimonial": "Pashumitra helped me detect disease early and save my cattle. The results are fast and easy to understand.",
  "auth.testimonialAuthor": "Rajesh Kumar",
  "auth.testimonialRole": "Cattle Farmer, Maharashtra",

  // Profile
  "profile.title": "My Account",
  "profile.subtitle": "Manage your account settings",
  "profile.memberSince": "Member since",
  "profile.role": "Role",
  "profile.editProfile": "Edit Profile",
  "profile.changeName": "Full name",
  "profile.changePassword": "New password",
  "profile.dangerZone": "Danger Zone",
  "profile.deleteAccount": "Delete Account",
  "profile.deleteWarning": "This will permanently delete your account and all data. This cannot be undone.",

  // Training (admin)
  "training.title": "Model Training",
  "training.subtitle": "Train or retrain the disease detection model",
  "training.status": "Training Status",
  "training.start": "Start Training",
  "training.inProgress": "Training in Progress...",
  "training.loading": "Loading training status...",

  // Model info (admin)
  "model.title": "Model Information",
  "model.subtitle": "Details about the currently loaded detection model",
  "model.noModel": "No model available",
  "model.noModelDesc": "No model information is available. Train a model first to see its details here.",
  "model.loading": "Loading model information...",

  // 404
  "notFound.title": "Page not found",
  "notFound.message": "The page you are looking for does not exist.",
  "notFound.goHome": "Go Home",

  // Testimonials section
  "testimonials.badge": "What Farmers Say",
  "testimonials.heading": "Trusted by",
  "testimonials.headingHighlight": "farmers across India",
  "testimonials.subtext": "Hear from farmers and veterinarians who use Pashumitra to protect their herds.",
  "testimonials.quote1": "I spotted Lumpy Skin Disease on my cow within seconds. The visual explanation showed me exactly where the problem was. This app is a lifesaver for small farmers like me.",
  "testimonials.name1": "Rajesh Patil",
  "testimonials.role1": "Dairy Farmer, Maharashtra",
  "testimonials.quote2": "As a village veterinarian, I recommend Pashumitra to every farmer I visit. The AI detection is remarkably accurate and the advice is practical.",
  "testimonials.name2": "Dr. Sunita Sharma",
  "testimonials.role2": "Veterinarian, Rajasthan",
  "testimonials.quote3": "My father lost cattle to LSD before we knew what it was. Now with Pashumitra, I can check my animals anytime from my phone. Peace of mind for my family.",
  "testimonials.name3": "Pradeep Singh",
  "testimonials.role3": "Cattle Owner, Uttar Pradesh",

  // FAQ section
  "faq.badge": "Common Questions",
  "faq.heading": "Frequently Asked",
  "faq.headingHighlight": "Questions",
  "faq.q1": "Do I need internet to use Pashumitra?",
  "faq.a1": "Yes, an internet connection is needed to upload the photo and receive AI analysis. However, the app works well even on slow 2G/3G connections since photos are optimized before upload.",
  "faq.q2": "Is Pashumitra free to use?",
  "faq.a2": "Yes, Pashumitra is completely free for farmers. You can create an account and start checking your animals at no cost.",
  "faq.q3": "How accurate is the disease detection?",
  "faq.a3": "Our AI model achieves over 92% accuracy in detecting Lumpy Skin Disease. Visual explanations show you exactly where the AI found signs of disease.",
  "faq.q4": "What kind of photos work best?",
  "faq.a4": "Take clear, well-lit photos of the skin area you are concerned about. Ensure the camera is steady, the area is in focus, and there is good daylight. Close-up photos of lumps or lesions give the best results.",
  "faq.q5": "Can veterinarians use this tool?",
  "faq.a5": "Absolutely. Pashumitra is designed for both farmers and veterinarians. Vets get the same AI analysis with detailed visual explanations to support their clinical assessment.",
  "faq.q6": "What should I do if the app detects disease?",
  "faq.a6": "If disease signs are detected, the app provides step-by-step advice. We recommend isolating the animal, contacting your local veterinarian immediately, and sharing the report via WhatsApp for quick consultation.",

  // About LSD (i18n fix for hardcoded strings)
  "about.lsd1Title": "What is LSD?",
  "about.lsd1Text": "Lumpy Skin Disease is a viral infection caused by the Lumpy Skin Disease Virus (LSDV), affecting cattle worldwide. It causes nodular skin lesions, fever, and reduced milk production.",
  "about.lsd2Title": "Why Early Detection?",
  "about.lsd2Text": "Early detection is critical. LSD spreads rapidly through insect vectors. Identifying infected animals early allows for isolation, reducing herd-wide outbreaks and economic losses.",
  "about.lsd3Title": "Symptoms to Watch For",
  "about.lsd3Text": "Key symptoms include firm, round skin nodules (2-5 cm), fever, swollen lymph nodes, reduced appetite, and drop in milk yield. Skin lesions are the most visible diagnostic marker.",
  "about.lsd4Title": "Global Impact",
  "about.lsd4Text": "LSD has spread across Africa, the Middle East, Europe, and Asia, causing billions in economic losses. It is an OIE-listed disease requiring immediate notification.",

  // Hero enhancement
  "landing.noCreditCard": "No credit card required. Free for all farmers.",

  // Footer section headers
  "footer.product": "Product",
  "footer.support": "Support",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.contact": "Contact Us",
  "footer.help": "Help Center",
  "footer.description": "AI-powered cattle health detection platform helping farmers protect their herds.",

  // Auth strength labels
  "auth.strengthWeak": "Weak",
  "auth.strengthFair": "Fair",
  "auth.strengthGood": "Good",
  "auth.strengthStrong": "Strong",
};

export default en;
