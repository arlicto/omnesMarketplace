import { SignIn } from '@clerk/react';
import Layout from "../components/Layout";

const Login = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-sm border border-outline-variant p-10">
          <div className="text-center mb-6">
            <h2 className="font-headline-lg text-headline-lg text-primary">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Access your curated marketplace account</p>
          </div>
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/register"
            redirectUrl="/account"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-label-md",
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
      </main>
    </Layout>
  );
};

export default Login;
