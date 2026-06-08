import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import Layout from "../components/Layout";

const SellerOnboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'updating' | 'done' | 'error'>('updating');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (user.unsafeMetadata?.role === 'seller') {
      navigate('/seller', { replace: true });
      return;
    }
    user.update({ unsafeMetadata: { role: 'seller' } })
      .then(() => {
        setStatus('done');
        setTimeout(() => navigate('/seller', { replace: true }), 1500);
      })
      .catch((err: Error) => {
        setStatus('error');
        setError(err.message);
      });
  }, [isLoaded, user, navigate]);

  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm border border-outline-variant p-10 text-center">
          {status === 'updating' && (
            <>
              <span className="material-symbols-outlined text-5xl text-secondary mb-4 animate-spin">sync</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Setting Up Your Seller Account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Please wait a moment...</p>
            </>
          )}
          {status === 'done' && (
            <>
              <span className="material-symbols-outlined text-5xl text-secondary mb-4">check_circle</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">You're All Set!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Redirecting to your seller dashboard...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Something went wrong</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">{error}</p>
              <button onClick={() => navigate('/seller', { replace: true })} className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold">
                Continue to Dashboard
              </button>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SellerOnboarding;

# 1780942685772543200
