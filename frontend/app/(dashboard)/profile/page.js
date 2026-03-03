"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Pencil,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One digit", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const passwordStrength = PASSWORD_RULES.map((r) => ({
    ...r,
    passed: r.test(newPassword),
  }));
  const allPasswordRulesPassed = !newPassword || passwordStrength.every((r) => r.passed);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError("");
    if (newPassword && !allPasswordRulesPassed) {
      setUpdateError("Password does not meet complexity requirements");
      return;
    }

    setIsUpdating(true);
    try {
      const data = {};
      if (name && name !== user.name) data.name = name;
      if (newPassword) data.password = newPassword;

      if (Object.keys(data).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateProfile(data);
      toast.success("Profile updated");
      setIsEditing(false);
      setNewPassword("");
    } catch (err) {
      setUpdateError(err.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-2xl space-y-8"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Manage your account settings
        </p>
      </div>

      {/* Profile info card */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-border/60 bg-card shadow-premium overflow-hidden"
      >
        <div className="p-6 pb-0 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Account Information</h3>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border-border/60 text-xs font-medium hover:bg-muted/50"
            >
              <Pencil className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              {updateError && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={100}
                  className="rounded-xl border-border/60 focus:border-primary/30 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                  New Password{" "}
                  <span className="normal-case tracking-normal font-normal">
                    (leave blank to keep current)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password (optional)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="rounded-xl border-border/60 focus:border-primary/30 h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {newPassword && (
                  <div className="space-y-1.5 pt-2">
                    {passwordStrength.map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                          rule.passed ? "text-healthy" : "text-muted-foreground/60"
                        }`}
                      >
                        {rule.passed ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-1">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl px-5"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-border/60"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                    setNewPassword("");
                    setUpdateError("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-0">
              {/* Avatar + Name header */}
              <div className="flex items-center gap-4 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold gradient-text">{userInitials}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                <div className="flex items-center gap-3.5 py-4 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Name</p>
                    <p className="font-medium text-sm text-foreground">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 py-4 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Email</p>
                    <p className="font-medium text-sm text-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 py-4 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Role</p>
                    <Badge
                      variant="secondary"
                      className="capitalize mt-0.5 rounded-md text-xs font-medium px-2 py-0.5"
                    >
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 py-4 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Member since</p>
                    <p className="font-medium text-sm text-foreground">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl border border-destructive/15 bg-card shadow-premium overflow-hidden"
      >
        <div className="p-6 pb-0 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Permanently delete your account and all associated data including prediction
            history. This action is irreversible and cannot be undone.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md shadow-elevated border-border/60">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-center">Delete Account</DialogTitle>
            <DialogDescription className="text-center leading-relaxed">
              This will permanently delete your account and all prediction
              history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-xl flex-1 sm:flex-none sm:min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl flex-1 sm:flex-none sm:min-w-[120px]"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
