"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

interface Providers {
  [key: string]: Provider;
}

export default function SignIn() {
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-extrabold text-2xl tracking-tight bg-neutral-900 rounded-lg px-3 py-1 border border-neutral-800">
              BR
            </span>
            <span className="text-neutral-400 font-medium text-lg tracking-tight">
              Background Remover
            </span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
          <p className="text-neutral-400 text-center">
            Sign in to access all features
          </p>
        </div>

        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-neutral-700 rounded-lg hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 group"
              >
                {provider.name === "Google" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-neutral-200 cursor-pointer font-medium">
                  Continue with {provider.name}
                </span>
              </button>
            ))}
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-neutral-500">
            By signing in, you accept our{" "}
            <a href="#" className="text-neutral-300 hover:text-white underline">
              terms of service
            </a>{" "}
            and our{" "}
            <a href="#" className="text-neutral-300 hover:text-white underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
