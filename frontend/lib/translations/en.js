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
};

export default en;
