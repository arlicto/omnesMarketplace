import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>(searchParams.get('role') === 'seller' ? 'seller' : 'buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', {
        username,
        email,
        password,
        role,
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-surface w-full px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <a href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <img 
              alt="Omnes MarketPlace Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGzUQiCpLxsph3TZOF53eANEqKiAVt1j2Vx2NZzUoQwcbTLWb6F5xZ2E24OmboCnLKtMMtjSL_PxAifcHgUb5ZYdX_oMT8Bq91qaILllMia4NBk0Yl-bL4dFOFqSz2HdBjCB6cNYU8g35FTk5yw48m8zZoPBpUQ0WjpMdwKdxmT6wmXIAhBv2TOrXjxgF4CL9LGJlEpbFYgJknJpsI-rWPXgw-sJlndcqXkgRUvltAslzCE04yBKbZsvn2vnGSrSWcHIxH7nGpnx8" 
            />
            <div className="text-headline-md font-headline-md font-bold text-primary">Omnes MarketPlace</div>
          </a>
        </div>
        <div className="w-full flex justify-end md:-mt-12">
          <div className="hidden md:flex items-center gap-stack-md">
            <span className="text-label-md font-label-md text-on-surface-variant">Already have an account?</span>
            <a className="text-label-md font-label-md text-primary font-bold hover:underline" href="/login">Log In</a>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        {/* Registration Card Container */}
        <div className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row">
          {/* Left Branding/Visual Panel (Desktop Only) */}
          <div className="hidden md:block w-1/3 bg-primary relative">
            <div className="relative h-full p-8 flex flex-col justify-end">
              <h2 className="text-white font-headline-md text-headline-md mb-2">
                {role === 'seller' ? 'Start Your Store.' : 'Join the Collective.'}
              </h2>
              <p className="text-primary-fixed text-body-md opacity-80">
                {role === 'seller' 
                  ? 'List your items and reach thousands of verified buyers in the Omnes community.'
                  : 'Access exclusive listings and connect with verified sellers worldwide.'}
              </p>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="flex-1 p-8 md:p-10">
            <div className="mb-stack-lg">
              <h1 className="font-headline-md text-headline-md text-primary mb-2">
                {role === 'seller' ? 'Become a Seller' : 'Create Account'}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {role === 'seller' 
                  ? 'Start selling your items to the Omnes community.' 
                  : 'Step into a curated world of commerce.'}
              </p>
            </div>
            
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div>
                <label className="block text-label-md font-label-md text-primary mb-3">I want to:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'buyer'
                        ? 'border-secondary bg-secondary-container text-on-secondary-container'
                        : 'border-outline-variant hover:border-outline'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                      <span className="font-bold">Buy</span>
                      <span className="text-sm opacity-80">Browse and purchase items</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'seller'
                        ? 'border-secondary bg-secondary-container text-on-secondary-container'
                        : 'border-outline-variant hover:border-outline'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl">storefront</span>
                      <span className="font-bold">Sell</span>
                      <span className="text-sm opacity-80">List and sell items</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Row */}
              <Input 
                label="Username" 
                id="username" 
                placeholder="johndoe" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              
              {/* Email */}
              <Input 
                label="Email Address" 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Password" 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input 
                  label="Confirm Password" 
                  id="confirm_password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {/* Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-outline-variant bg-surface-bright checked:bg-secondary checked:border-secondary transition-all" type="checkbox"/>
                    <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px]" style={{ fontVariationSettings: '"wght" 700' }}>check</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-on-surface-variant leading-tight">
                    {role === 'seller' 
                      ? 'I agree to the seller terms of service and will list authentic items only.'
                      : 'I agree that by making an offer, I am legally obligated to purchase if the seller accepts.'}
                  </span>
                </label>
              </div>
              
              {/* CTA */}
              <div className="pt-4">
                <Button className="w-full py-4">
                  {role === 'seller' ? 'Start Selling' : 'Create Account'}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-outline-variant md:hidden text-center">
              <span className="text-label-sm font-label-sm text-on-surface-variant">Already have an account? <a className="text-primary font-bold" href="/login">Log In</a></span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-container text-white w-full border-t border-white/10">
        <div className="w-full px-margin-desktop py-12 max-w-container-max mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-8">
            <img 
              alt="Omnes MarketPlace Logo" 
              className="h-12 w-auto" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb6O797DcqGOh7byAzL6hAfG4HBGJdwUECLJSbU0vwS9TkVFOT5-rc8lD2E-RrHMX1smoOJQ6Fb_PQM9kczR7tkAXJVz_AmJKxGwUuJBGCyFX0fbMgeRkPE50UAhGOsRi2pCKM27GXbFIn5-wC3PjaCpF0NuYIbJvqfjieHDFKDnb6dYSXBAi4QwjdANGBA5qNa5NcmRsfGhKHWnymKiE222RhKUxD5VmrGNP-3oUC4pdWA8WTOOwVm0jCN6RSaN95HBh-uJrKy08" 
            />
            <div className="text-headline-md font-headline-md font-bold">Omnes MarketPlace</div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Contact Support</FooterLink>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Student Guidelines</FooterLink>
          </nav>
          <div className="flex gap-6 mb-8">
            <SocialIcon icon="public" />
            <SocialIcon icon="share" />
            <SocialIcon icon="close" />
          </div>
          <div className="pt-stack-md border-t border-white/10 w-full text-center opacity-70">
            <p className="text-label-sm">© 2024 Omnes Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a className="text-label-md font-label-md hover:text-secondary-fixed transition-colors" href={href}>{children}</a>
);

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => (
  <a className="hover:text-secondary-fixed transition-colors" href="#">
    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
  </a>
);
