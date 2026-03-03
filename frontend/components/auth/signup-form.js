"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One digit", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const ROLES = [
  { value: "farmer", labelKey: "auth.farmer" },
  { value: "veterinarian", labelKey: "auth.veterinarian" },
];

function getStrengthColor(ratio) {
  if (ratio <= 0.33) return "bg-red-500";
  if (ratio <= 0.66) return "bg-amber-500";
  return "bg-emerald-500";
}

function getStrengthLabel(ratio) {
  if (ratio === 0) return "";
  if (ratio <= 0.33) return "Weak";
  if (ratio <= 0.66) return "Fair";
  if (ratio < 1) return "Good";
  return "Strong";
}

export default function SignupForm() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    return PASSWORD_RULES.map((rule) => ({
      ...rule,
      passed: rule.test(form.password),
    }));
  }, [form.password]);

  const passedCount = passwordStrength.filter((r) => r.passed).length;
  const strengthRatio = form.password.length > 0 ? passedCount / PASSWORD_RULES.length : 0;
  const allRulesPassed = passedCount === PASSWORD_RULES.length;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allRulesPassed) {
      setError("Password does not meet complexity requirements");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.passwordsNoMatch"));
      return;
    }

    setIsLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      router.push("/dashboard");
    } catch (err) {
      if (err.status === 409 || err.message?.includes("already exists")) {
        setError("An account with this email already exists");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">
          {t("auth.signupTitle")}
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {t("auth.signupSubtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-elevated">
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-destructive/5 border border-destructive/15 px-4 py-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.fullName")}
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="h-11 rounded-lg bg-background px-4 text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="signup-email"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.email")}
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-lg bg-background px-4 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="signup-password"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.password")}
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                autoComplete="new-password"
                className="h-11 rounded-lg bg-background pr-11 px-4 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5 pt-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getStrengthColor(strengthRatio)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${strengthRatio * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ml-3 min-w-[44px] text-right ${
                      strengthRatio <= 0.33
                        ? "text-red-500"
                        : strengthRatio <= 0.66
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {getStrengthLabel(strengthRatio)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-foreground"
            >
              {t("auth.confirmPassword")}
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
                autoComplete="new-password"
                className="h-11 rounded-lg bg-background pr-11 px-4 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <AnimatePresence>
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-destructive pt-0.5"
                  >
                    {t("auth.passwordsNoMatch")}
                  </motion.p>
                )}
            </AnimatePresence>
          </div>

          {/* Role - Pill Toggle */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-foreground">
              {t("auth.iAmA")}
            </Label>
            <div className="relative flex rounded-lg bg-muted p-1">
              {/* Animated pill background */}
              <motion.div
                className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm"
                layout
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                style={{
                  width: `calc(50% - 4px)`,
                  left:
                    form.role === "farmer"
                      ? "4px"
                      : "calc(50% + 0px)",
                }}
              />
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => updateField("role", role.value)}
                  className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    form.role === role.value
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  {t(role.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-lg text-sm font-medium mt-2 transition-all duration-200 hover:shadow-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {t("common.createAccount")}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t("auth.hasAccount")}{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          {t("common.signIn")}
        </Link>
      </p>
    </motion.div>
  );
}
