import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { onAuthChange, getCurrentUser, sendPhoneOTP, verifyPhoneOTP } from "@/lib/firebase-auth";
import { usersDB, UserProfile } from "@/lib/firebase-db";
import { ConfirmationResult } from "firebase/auth";

type UserAuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  requestOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const UserAuthContext = createContext<UserAuthContextValue | undefined>(undefined);

const isValidPhone = (value: string) => {
  return /^[6-9]\d{9}$/.test(value.trim().replace(/[\s-]/g, ''));
};

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const phoneNumber = firebaseUser.phoneNumber || '';
        let userProfile = await usersDB.getById(firebaseUser.uid);

        if (!userProfile) {
          await usersDB.create(firebaseUser.uid, {
            phone: phoneNumber,
            name: firebaseUser.displayName || undefined,
            email: firebaseUser.email || undefined
          });
          userProfile = await usersDB.getById(firebaseUser.uid);
        }

        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const requestOtp = useCallback(async (phoneNumber: string) => {
    const trimmed = phoneNumber.trim();
    if (!isValidPhone(trimmed)) {
      throw new Error("Enter a valid 10-digit mobile number.");
    }

    const formattedPhone = trimmed.startsWith('+91') ? trimmed : `+91${trimmed}`;

    try {
      const result = await sendPhoneOTP(formattedPhone);
      setConfirmationResult(result);

      toast.success("OTP sent successfully.", {
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new Error(error.message || "Failed to send OTP. Please try again.");
    }
  }, []);

  const verifyOtp = useCallback(
    async (otp: string) => {
      if (!/^[0-9]{6}$/.test(otp.trim())) {
        throw new Error("Enter the 6-digit OTP sent to you.");
      }

      if (!confirmationResult) {
        throw new Error("Please request an OTP first.");
      }

      try {
        await verifyPhoneOTP(confirmationResult, otp.trim());

        toast.success("Login successful.", {
          description: "You are now securely logged in.",
        });
      } catch (error: any) {
        console.error('Error verifying OTP:', error);
        throw new Error(error.message || "Invalid OTP. Please try again.");
      }
    },
    [confirmationResult],
  );

  const logout = useCallback(async () => {
    const { signOut } = await import("@/lib/firebase-auth");
    await signOut();
    setUser(null);
    setConfirmationResult(null);
    toast.info("You have been logged out.");
  }, []);

  const value = useMemo<UserAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      requestOtp,
      verifyOtp,
      logout,
      loading,
    }),
    [logout, requestOtp, user, verifyOtp, loading],
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};
