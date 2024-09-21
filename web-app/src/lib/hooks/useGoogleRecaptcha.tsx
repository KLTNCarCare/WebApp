import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface UseGoogleRecaptchaProps {
  sitekey: string;
  onVerify: (token: string | null) => void;
}

const useGoogleRecaptcha = ({ sitekey, onVerify }: UseGoogleRecaptchaProps) => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  useEffect(() => {
    // Handle any side effects or clean up if needed
  }, [captchaValue]);

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    onVerify(value);
  };

  const RecaptchaComponent = (
    <ReCAPTCHA sitekey={sitekey} onChange={onCaptchaChange} />
  );

  return {
    captchaValue,
    RecaptchaComponent,
  };
};
export default useGoogleRecaptcha;
