import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      const { user, jwt } = response.data;
      setAuth(user, jwt);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="w-full pt-stack-lg px-margin-desktop flex flex-col items-center gap-stack-sm">
        <div className="bg-transparent flex items-center justify-center">
          <img 
            alt="Omnes Logo Icon" 
            className="h-16 w-auto mix-blend-multiply" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGzUQiCpLxsph3TZOF53eANEqKiAVt1j2Vx2NZzUoQwcbTLWb6F5xZ2E24OmboCnLKtMMtjSL_PxAifcHgUb5ZYdX_oMT8Bq91qaILllMia4NBk0Yl-bL4dFOFqSz2HdBjCB6cNYU8g35FTk5yw48m8zZoPBpUQ0WjpMdwKdxmT6wmXIAhBv2TOrXjxgF4CL9LGJlEpbFYgJknJpsI-rWPXgw-sJlndcqXkgRUvltAslzCE04yBKbZsvn2vnGSrSWcHIxH7nGpnx8" 
          />
        </div>
        <h1 className="text-headline-md font-headline-md text-primary tracking-tight">Omnes MarketPlace</h1>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        {/* Login Card */}
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm border border-outline-variant p-10 flex flex-col gap-stack-lg">
          <div className="text-center flex flex-col gap-stack-sm">
            <h2 className="font-headline-lg text-headline-lg text-primary">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Access your curated marketplace account</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
            <Input 
              label="Email" 
              icon="mail" 
              type="email" 
              id="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              icon="lock" 
              type="password" 
              id="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer appearance-none w-5 h-5 rounded border-2 border-outline-variant checked:bg-primary checked:border-primary transition-all" type="checkbox"/>
                  <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2" style={{ fontSize: '16px' }}>check</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Remember me</span>
              </label>
              <a className="font-label-md text-label-md text-secondary hover:underline" href="#">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full py-4 mt-stack-sm">
              Login
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink mx-4 font-label-sm text-label-sm text-on-surface-variant">or</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          <div className="text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to the community? <a className="text-secondary font-bold hover:underline" href="/register">Create a new buyer account</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#1a2b4c] text-white py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col items-center gap-stack-lg">
          <div className="flex flex-col items-center gap-stack-sm">
            <img 
              alt="Omnes Logo" 
              className="h-12 w-auto brightness-0 invert" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb6O797DcqGOh7byAzL6hAfG4HBGJdwUECLJSbU0vwS9TkVFOT5-rc8lD2E-RrHMX1smoOJQ6Fb_PQM9kczR7tkAXJVz_AmJKxGwUuJBGCyFX0fbMgeRkPE50UAhGOsRi2pCKM27GXbFIn5-wC3PjaCpF0NuYIbJvqfjieHDFKDnb6dYSXBAi4QwjdANGBA5qNa5NcmRsfGhKHWnymKiE222RhKUxD5VmrGNP-3oUC4pdWA8WTOOwVm0jCN6RSaN95HBh-uJrKy08" 
            />
            <span className="text-headline-md font-headline-md tracking-tight">Omnes MarketPlace</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Contact Support</FooterLink>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Student Guidelines</FooterLink>
          </nav>
          <div className="flex gap-6">
            <SocialIcon icon="public" />
            <SocialIcon icon="share" />
            <SocialIcon icon="close" />
          </div>
          <div className="pt-stack-md border-t border-white/10 w-full text-center">
            <p className="text-label-sm opacity-70">© 2024 Omnes Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a className="text-label-md hover:text-secondary-fixed transition-colors" href={href}>{children}</a>
);

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => (
  <a className="hover:text-secondary-fixed transition-colors" href="#">
    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
  </a>
);
