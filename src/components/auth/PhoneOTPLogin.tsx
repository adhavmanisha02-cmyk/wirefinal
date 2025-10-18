import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SendOTP } from './SendOTP';
import { VerifyOTP } from './VerifyOTP';
import { supabase } from '@/lib/supabase';

interface PhoneOTPLoginProps {
  onSuccess: (userId: string, phoneNumber: string) => void;
}

export const PhoneOTPLogin = ({ onSuccess }: PhoneOTPLoginProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleOTPSent = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
  };

  const handleVerified = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      onSuccess(user.id, phoneNumber);
    }
  };

  const handleBack = () => {
    setStep('phone');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Login</CardTitle>
        <CardDescription>
          {step === 'phone'
            ? 'Enter your phone number to receive an OTP'
            : 'Enter the OTP sent to your phone'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'phone' ? (
          <SendOTP onOTPSent={handleOTPSent} />
        ) : (
          <VerifyOTP
            phoneNumber={phoneNumber}
            onVerified={handleVerified}
            onBack={handleBack}
          />
        )}
      </CardContent>
    </Card>
  );
};
