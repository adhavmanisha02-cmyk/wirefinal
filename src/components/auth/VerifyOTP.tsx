import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserAuth } from '@/context/UserAuthContext';

interface VerifyOTPProps {
  phoneNumber: string;
  onVerified: () => void;
  onBack: () => void;
}

export function VerifyOTP({ phoneNumber, onVerified, onBack }: VerifyOTPProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const { verifyOtp, requestOtp } = useUserAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(otp);
      onVerified();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      await requestOtp(phoneNumber);
      setCountdown(60);
      setResendDisabled(true);
      setOtp('');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>
      <div className="space-y-2">
        <Label className="text-center block">
          Enter the code sent to {phoneNumber}
        </Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            inputMode="numeric"
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <Button
        onClick={handleVerifyOTP}
        disabled={loading || otp.length !== 6}
        className="w-full"
      >
        {loading ? 'Verifying...' : 'Verify & Login'}
      </Button>

      <div className="text-center space-y-2">
        <Button
          variant="link"
          onClick={handleResendOTP}
          disabled={resendDisabled || loading}
          className="text-sm"
        >
          {resendDisabled
            ? `Resend in 0:${countdown.toString().padStart(2, '0')}`
            : 'Resend OTP'}
        </Button>
        <div>
          <Button
            variant="link"
            onClick={onBack}
            className="text-sm"
          >
            Change Phone Number
          </Button>
        </div>
      </div>
    </div>
  );
}
