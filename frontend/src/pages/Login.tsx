import { SignIn } from '@clerk/react';
import Layout from "../components/Layout";

const Login = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/subtle-ambient-motion-people-walking-and-talking-f.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm border border-outline-variant px-8 py-8 relative z-10">
          <div className="text-center mb-6">
            <h2 className="font-headline-lg text-headline-lg text-primary">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Access your curated marketplace account</p>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm">
              <SignIn
                path="/login"
                routing="path"
                signUpUrl="/register"
                fallbackRedirectUrl="/account"
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
                    identityPreviewText: "font-body-md text-on-surface-variant",
                    identityPreviewEditButton: "text-primary",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;
