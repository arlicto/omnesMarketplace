import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SignUp } from '@clerk/react';
import Layout from "../components/Layout";

type Role = 'buyer' | 'seller';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const [role, setRole] = useState<Role>(initialRole);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const termsText = role === 'seller'
    ? 'I agree to the Seller Terms of Service, Commission Policy, and Privacy Policy'
    : 'I agree to the Terms of Service, Return Policy, and Privacy Policy';

  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/subtle-ambient-motion-people-walking-and-talking-f.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm border border-outline-variant px-8 py-8 relative z-10">
          <div className="text-center mb-6">
            <h2 className="font-headline-lg text-headline-lg text-primary">{role === 'seller' ? 'Become a Seller' : 'Create Account'}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">{role === 'seller' ? 'List your items and start selling on our marketplace.' : 'Step into a curated world of commerce.'}</p>
          </div>

          <div className="flex bg-surface-container-high rounded-xl p-1 mb-6 border border-outline-variant">
            <button
              onClick={() => setRole('buyer')}
              className={`flex-1 py-2.5 rounded-lg text-label-md font-label-md font-bold transition-all ${
                role === 'buyer'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                Buyer
              </span>
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`flex-1 py-2.5 rounded-lg text-label-md font-label-md font-bold transition-all ${
                role === 'seller'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Seller
              </span>
            </button>
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm">
              <SignUp
                path="/register"
                routing="path"
                signInUrl="/login"
                fallbackRedirectUrl={role === 'seller' ? '/seller/onboarding' : '/account'}
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-label-md w-full",
                    formFieldInput: "font-body-md py-3 px-4 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary",
                    formFieldLabel: "font-label-md text-on-surface-variant",
                    card: "bg-surface-container-lowest shadow-none border-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border border-outline-variant rounded-lg font-label-md",
                    dividerLine: "border-outline-variant",
                    dividerText: "font-label-sm text-on-surface-variant",
                    footerActionText: "font-body-md text-on-surface-variant",
                    footerActionLink: "text-secondary font-bold hover:underline",
                  },
                }}
              />
            </div>
          </div>
          <label className="flex items-start gap-3 mt-5 pt-4 border-t border-outline-variant cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
              {termsText}
            </span>
          </label>
        </div>
      </main>
    </Layout>
  );
};

export default Register;

# 1781288289531516136
