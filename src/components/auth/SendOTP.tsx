import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUserAuth } from '@/context/UserAuthContext';

interface SendOTPProps {
  onOTPSent: (phoneNumber: string) => void;
}

export function SendOTP({ onOTPSent }: SendOTPProps) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestOtp } = useUserAuth();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setLoading(true);

    try {
      await requestOtp(fullPhoneNumber);
      onOTPSent(fullPhoneNumber);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div id="recaptcha-container"></div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+91">+91 (IN)</SelectItem>
              <SelectItem value="+1">+1 (US)</SelectItem>
              <SelectItem value="+44">+44 (UK)</SelectItem>
              <SelectItem value="+61">+61 (AU)</SelectItem>
              <SelectItem value="+65">+65 (SG)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="flex-1"
          />
        </div>
      </div>
      <Button
        onClick={handleSendOTP}
        disabled={loading || !phoneNumber}
        className="w-full"
      >
        {loading ? 'Sending...' : 'Send OTP'}
      </Button>
    </div>
  );
}
