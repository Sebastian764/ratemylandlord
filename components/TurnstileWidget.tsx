import { useCity } from '../cities/context';
import React from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  turnstileRef?: React.RefObject<TurnstileInstance>;
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ 
  onSuccess, 
  onError, 
  onExpire,
  turnstileRef 
}) => {
  const city = useCity();
  React.useEffect(() => { if (city) onSuccess('city-demo-only'); }, [city, onSuccess]);
  if (city) return <p className="text-sm text-gray-500">Demo review — saved only until you leave this city or refresh. No verification or upload is performed.</p>;

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error('Turnstile site key is not configured');
    return (
      <div className="text-red-500 text-sm p-2 border border-red-300 rounded bg-red-50">
        Security verification is not configured. Please contact support.
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  );
};

export default TurnstileWidget;
